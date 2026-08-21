/** JARVIS V9 bridge: one stable API for the existing HUD to consume V9. */
(() => {
  const api = {};

  api.getEntities = () => window.JARVIS_V9_HA?.all?.() || [];
  api.getSelection = () => window.JARVIS_V9_SELECTION?.read?.() || { categories: {}, layout: 'none' };
  api.getMenu = () => window.JARVIS_V9_MENU?.read?.() || {};
  api.getSettings = () => window.JARVIS_V9_SETTINGS?.read?.() || {};
  api.getLayout = () => window.JARVIS_V9_LAYOUT?.read?.() || 'none';
  api.buildDashboard = () => window.JARVIS_V9_DASHBOARD?.build?.(
    api.getEntities(), api.getSelection().categories
  ) || { cards: {}, layout: { mode: 'none', enabled: false }, updateControl: { enabled: true, position: 'fixed-bottom-right' } };

  api.validateAction = descriptor => window.JARVIS_V9_ACTION_POLICY?.validate?.(descriptor) || { ok: false, reason: 'policy-unavailable' };

  api.subscribe = fn => {
    const store = window.JARVIS_V9_HA;
    return store?.subscribe ? store.subscribe(() => fn(api.buildDashboard())) : () => {};
  };

  window.JARVIS_V9_BRIDGE = Object.freeze(api);
  window.dispatchEvent(new CustomEvent('jarvis:v9-bridge-ready', { detail: api }));
})();
