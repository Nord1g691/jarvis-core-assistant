/** V9 manual menu: user-selectable categories/entities without hard-coded IDs. */
(() => {
  const selection = () => window.JARVIS_V9_SELECTION;
  const read = () => selection()?.read?.() || { categories: {}, layout: 'none' };
  const setCategory = (category, entityIds = []) => {
    const current = read();
    const categories = { ...(current.categories || {}) };
    categories[category] = [...new Set(entityIds.filter(Boolean))];
    selection()?.write?.({ ...current, categories });
    return read();
  };
  const clearCategory = category => {
    const current = read();
    const categories = { ...(current.categories || {}) };
    delete categories[category];
    selection()?.write?.({ ...current, categories });
    return read();
  };
  const clear = () => selection()?.write?.({ categories: {}, layout: 'none' });
  window.JARVIS_V9_MENU = Object.freeze({ read, setCategory, clearCategory, clear });
})();
