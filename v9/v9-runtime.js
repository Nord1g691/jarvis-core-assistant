/**
 * JARVIS V9 runtime — additive integration layer.
 * Loaded independently so the existing HUD can remain visually unchanged.
 */
(() => {
  'use strict';

  const V9 = window.JARVIS_V9;
  if (!V9) return;

  const state = {
    entities: [],
    index: {},
    lastRefresh: 0
  };

  function getConfig() {
    const url = window.HA_URL || window.location.origin;
    const token = window.HA_TOKEN || '';
    return { url, token };
  }

  async function api(path, options = {}) {
    const { url, token } = getConfig();
    if (!token || token === 'ton_token_ici') throw new Error('Token Home Assistant non configuré');
    const response = await fetch(`${url}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async function refreshEntities() {
    const entities = await api('/api/states');
    state.entities = Array.isArray(entities) ? entities : [];
    state.index = V9.buildEntityIndex(state.entities);
    state.lastRefresh = Date.now();
    window.dispatchEvent(new CustomEvent('jarvis:v9:entities', {
      detail: { entities: state.entities, index: state.index }
    }));
    return state.index;
  }

  function getCategory(categoryId) {
    return state.index[categoryId] || [];
  }

  function getEntity(entityId) {
    return state.entities.find(entity => entity.entity_id === entityId) || null;
  }

  function getStateSummary(entity) {
    if (!entity) return null;
    const category = entity.category || V9.classifyEntity(entity);
    const attrs = entity.attributes || {};
    const hints = V9.stateHints[category] || ['state'];
    const values = {};
    for (const key of hints) {
      if (key === 'state') values.state = entity.state;
      else if (Object.prototype.hasOwnProperty.call(attrs, key)) values[key] = attrs[key];
    }
    return values;
  }

  function getCategories() {
    return V9.categories.map(category => ({
      ...category,
      entities: getCategory(category.id),
      count: getCategory(category.id).length
    }));
  }

  async function callService(domain, service, serviceData = {}, target = {}) {
    return api('/api/services/' + encodeURIComponent(domain) + '/' + encodeURIComponent(service), {
      method: 'POST',
      body: JSON.stringify({ ...serviceData, target })
    });
  }

  const apiPublic = Object.freeze({
    refreshEntities,
    getCategory,
    getEntity,
    getStateSummary,
    getCategories,
    callService,
    get lastRefresh() { return state.lastRefresh; }
  });

  window.JARVIS_V9_RUNTIME = apiPublic;

  // Expose a stable event-driven contract for the existing UI and future cards.
  window.addEventListener('jarvis:v9:refresh', () => {
    refreshEntities().catch(error => {
      window.dispatchEvent(new CustomEvent('jarvis:v9:error', { detail: error }));
    });
  });

  // Initial discovery is intentionally delayed until the existing page has loaded.
  window.addEventListener('load', () => {
    refreshEntities().catch(error => {
      window.dispatchEvent(new CustomEvent('jarvis:v9:error', { detail: error }));
    });
  }, { once: true });
})();
