/** JARVIS V9 entity selection preferences. */
(() => {
  const KEY = 'jarvis-v9-entity-selection';
  const layouts = new Set(['none','grid','list','focus']);
  const defaults = { categories: {}, layout: 'none' };
  const validEntityId = id => typeof id === 'string' && /^[a-z0-9_]+\.[a-z0-9_]+$/i.test(id);
  const sanitize = value => {
    const categories = {};
    const source = value?.categories && typeof value.categories === 'object' ? value.categories : {};
    for (const [category, ids] of Object.entries(source)) {
      if (!Array.isArray(ids)) continue;
      const valid = [...new Set(ids.filter(validEntityId))];
      if (valid.length) categories[category] = valid;
    }
    return { categories, layout: layouts.has(value?.layout) ? value.layout : defaults.layout };
  };
  const read = () => {
    try { return sanitize(JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch { return { ...defaults, categories: {} }; }
  };
  const write = value => {
    const next = sanitize(value);
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('jarvis:v9-selection-changed', { detail: next }));
    return next;
  };
  const toggle = (category, entityId) => {
    if (typeof category !== 'string' || !category || !validEntityId(entityId)) return read();
    const state = read();
    const current = new Set(state.categories[category] || []);
    current.has(entityId) ? current.delete(entityId) : current.add(entityId);
    return write({ ...state, categories: { ...state.categories, [category]: [...current] } });
  };
  window.JARVIS_V9_SELECTION = Object.freeze({ key: KEY, defaults: { ...defaults, categories: {} }, read, write, toggle, sanitize, setLayout: layout => write({ ...read(), layout }) });
})();
