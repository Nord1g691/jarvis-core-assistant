/** JARVIS V9 settings model: keeps connection/account separate from dashboard categories. */
(() => {
  const KEY = 'jarvis-v9-settings';
  const defaults = {
    account: { connected: false },
    dashboard: { showCategories: true, layout: 'none' },
    updateControl: { enabled: true, position: 'fixed-bottom-right' }
  };
  const clone = value => JSON.parse(JSON.stringify(value));
  const read = () => {
    try { return { ...clone(defaults), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
    catch { return clone(defaults); }
  };
  const patch = changes => {
    const current = read();
    const next = {
      ...current,
      ...changes,
      dashboard: { ...current.dashboard, ...(changes?.dashboard || {}) },
      account: { ...current.account, ...(changes?.account || {}) },
      updateControl: { ...current.updateControl, ...(changes?.updateControl || {}) }
    };
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('jarvis:v9-settings-changed', { detail: next }));
    return next;
  };
  window.JARVIS_V9_SETTINGS = Object.freeze({ key: KEY, defaults: clone(defaults), read, patch });
})();
