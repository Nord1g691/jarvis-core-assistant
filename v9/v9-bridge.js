/** JARVIS V9 bridge: one stable API for the existing HUD to consume V9. */
(() => {
  const api = {};

  api.getEntities = () => window.JARVIS_V9_HA?.all?.() || [];
  api.getSelection = () => window.JARVIS_V9_SELECTION?.read?.() || { categories: {}, layout: 'none' };
  api.getSettings = () => window.JARVIS_V9_SETTINGS?.read?.() || {};
  api.getLayout = () => window.JARVIS_V9_LAYOUT?.read?.() || 'none';
  api.buildDashboard = () => window.JARVIS_V9_DASHBOARD?.build?.(
    api.getEntities(), api.getSelection().categories
  ) || { cards: {}, updateControl: { enabled: true, position: 'fixed-bottom-right' } };

  api.subscribe = fn => {
    const store = window.JARVIS_V9_HA;
    return store?.subscribe ? store.subscribe(() => fn(api.buildDashboard())) : () => {};
  };

  window.JARVIS_V9_BRIDGE = Object.freeze(api);
  window.dispatchEvent(new CustomEvent('jarvis:v9-bridge-ready', { detail: api }));
})();
