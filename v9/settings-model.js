/** JARVIS V9 settings model: keeps connection/account separate from dashboard categories. */
(() => {
  const KEY = 'jarvis-v9-settings';
  const defaults = {
    account: { connected: false },
    dashboard: { showCategories: true, layout: 'none' },
    updateControl: { enabled: true, position: 'fixed-bottom-right' }
  };
  const clone = value => JSON.parse(JSON.stringify(value));
  const merge = (base, patch) => ({ ...base, ...(patch || {}) });
  const sanitize = value => {
    const next = {
      account: merge(defaults.account, value?.account),
      dashboard: merge(defaults.dashboard, value?.dashboard),
      updateControl: merge(defaults.updateControl, value?.updateControl)
    };
    if (!['none','grid','list','focus'].includes(next.dashboard.layout)) next.dashboard.layout = defaults.dashboard.layout;
    next.dashboard.showCategories = Boolean(next.dashboard.showCategories);
    next.updateControl.enabled = Boolean(next.updateControl.enabled);
    if (!['fixed-bottom-right','fixed-top-right','inline'].includes(next.updateControl.position)) next.updateControl.position = defaults.updateControl.position;
    next.account.connected = Boolean(next.account.connected);
    return next;
  };
  const read = () => {
    try { return sanitize(JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch { return clone(defaults); }
  };
  const patch = changes => {
    const current = read();
    const next = sanitize({
      ...current,
      ...changes,
      dashboard: { ...current.dashboard, ...(changes?.dashboard || {}) },
      account: { ...current.account, ...(changes?.account || {}) },
      updateControl: { ...current.updateControl, ...(changes?.updateControl || {}) }
    });
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('jarvis:v9-settings-changed', { detail: next }));
    return next;
  };
  window.JARVIS_V9_SETTINGS = Object.freeze({ key: KEY, defaults: clone(defaults), read, patch, sanitize });
})();
