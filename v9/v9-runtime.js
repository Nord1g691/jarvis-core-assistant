/** JARVIS V9 runtime — additive integration layer. */
(() => {
  'use strict';
  const V9 = window.JARVIS_V9;
  if (!V9) return;
  const state = { entities: [], index: {}, lastRefresh: 0 };
  const getConfig = () => ({ url: window.HA_URL || window.location.origin, token: window.HA_TOKEN || '' });
  async function api(path, options = {}) {
    const { url, token } = getConfig();
    if (!token || token === 'ton_token_ici') throw new Error('Token Home Assistant non configuré');
    const response = await fetch(`${url}${path}`, { ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
  async function refreshEntities() {
    const entities = await api('/api/states');
    state.entities = Array.isArray(entities) ? entities : [];
    state.index = V9.buildEntityIndex(state.entities);
    state.lastRefresh = Date.now();
    window.JARVIS_V9_HA?.replace(state.entities);
    window.dispatchEvent(new CustomEvent('jarvis:v9:entities', { detail: { entities: state.entities, index: state.index } }));
    return state.index;
  }
  const getCategory = categoryId => state.index[categoryId] || [];
  const getEntity = entityId => state.entities.find(entity => entity.entity_id === entityId) || null;
  function getStateSummary(entity) {
    if (!entity) return null;
    const category = entity.category || V9.classifyEntity(entity), attrs = entity.attributes || {}, hints = V9.stateHints[category] || ['state'];
    const values = {};
    for (const key of hints) if (key === 'state') values.state = entity.state; else if (Object.prototype.hasOwnProperty.call(attrs, key)) values[key] = attrs[key];
    return values;
  }
  const getCategories = () => V9.categories.map(category => ({ ...category, entities: getCategory(category.id), count: getCategory(category.id).length }));
  async function callService(domain, service, serviceData = {}, target = {}) {
    const descriptor = { entity_id: target.entity_id || target.entity_id?.[0], action: service, data: serviceData };
    const gateway = window.JARVIS_V9_ACTION_GATEWAY;
    if (gateway && descriptor.entity_id) return gateway.execute(descriptor, safe => api(`/api/services/${encodeURIComponent(domain)}/${encodeURIComponent(safe.action)}`, { method: 'POST', body: JSON.stringify({ ...safe.data, target: { entity_id: safe.entity_id } }) }));
    throw new Error('JARVIS V9 action gateway unavailable');
  }
  const apiPublic = Object.freeze({ refreshEntities, getCategory, getEntity, getStateSummary, getCategories, callService, get lastRefresh() { return state.lastRefresh; } });
  window.JARVIS_V9_RUNTIME = apiPublic;
  window.addEventListener('jarvis:v9:refresh', () => refreshEntities().catch(error => window.dispatchEvent(new CustomEvent('jarvis:v9:error', { detail: error }))));
  window.addEventListener('load', () => refreshEntities().catch(error => window.dispatchEvent(new CustomEvent('jarvis:v9:error', { detail: error }))), { once: true });
})();
