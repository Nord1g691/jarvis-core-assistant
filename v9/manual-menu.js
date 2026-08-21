/** V9 manual menu: user-selectable categories/entities without hard-coded IDs. */
(() => {
  const KEY = 'jarvis-v9-menu-selection';
  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; }
  };
  const setCategory = (category, entityIds = []) => {
    const value = read();
    value[category] = [...new Set(entityIds.filter(Boolean))];
    localStorage.setItem(KEY, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('jarvis:v9-menu-changed', { detail: value }));
    return value;
  };
  const clearCategory = category => {
    const value = read();
    delete value[category];
    localStorage.setItem(KEY, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('jarvis:v9-menu-changed', { detail: value }));
    return value;
  };
  window.JARVIS_V9_MENU = Object.freeze({ read, setCategory, clearCategory, clear: () => { localStorage.removeItem(KEY); window.dispatchEvent(new CustomEvent('jarvis:v9-menu-changed', { detail: {} })); } });
})();
