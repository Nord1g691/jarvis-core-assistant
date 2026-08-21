/** JARVIS V9 settings model: keeps connection/account separate from dashboard categories. */
(() => {
  const KEY = 'jarvis-v9-settings';
  const defaults = {
    account: { connected: false },
    dashboard: { showCategories: true, layout: 'none' },
    updateControl: { enabled: true, position: 'fixed-bottom-right' }
  };

  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || JSON.stringify(defaults));
    } catch {
      return JSON.parse(JSON.stringify(defaults));
    }
  };

  const patch = (changes) => {
    const next = { ...read(), ...changes };
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('jarvis:v9-settings-changed', { detail: next }));
    return next;
  };

  window.JARVIS_V9_SETTINGS = Object.freeze({ key: KEY, read, patch });
})();
