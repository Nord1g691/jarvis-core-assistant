/** JARVIS V9 entity selection preferences. */
(() => {
  const KEY = 'jarvis-v9-entity-selection';
  const defaults = { categories: {}, layout: 'none' };

  const read = () => {
    try { return { ...defaults, ...(JSON.parse(localStorage.getItem(KEY) || '{}')) }; }
    catch { return { ...defaults }; }
  };

  const write = (value) => {
    localStorage.setItem(KEY, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('jarvis:v9-selection-changed', { detail: value }));
  };

  const toggle = (category, entityId) => {
    const state = read();
    const current = new Set(state.categories[category] || []);
    current.has(entityId) ? current.delete(entityId) : current.add(entityId);
    write({ ...state, categories: { ...state.categories, [category]: [...current] } });
  };

  window.JARVIS_V9_SELECTION = Object.freeze({
    key: KEY,
    read,
    write,
    toggle,
    setLayout: layout => write({ ...read(), layout })
  });
})();
