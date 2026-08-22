/** V9 dashboard model: optional manual categories with configurable card placement. */
(() => {
  const build = (entities = [], selected = {}) => {
    const cards = window.JARVIS_V9_CARDS?.build(entities) || {};
    const result = {};
    for (const [category, items] of Object.entries(cards)) {
      const allowed = selected[category];
      result[category] = Array.isArray(allowed) && allowed.length ? items.filter(card => allowed.includes(card.entity_id)) : items;
    }
    const layout = window.JARVIS_V9_LAYOUT?.read?.() || 'none';
    const total = Object.values(result).reduce((sum, items) => sum + (Array.isArray(items) ? items.length : 0), 0);
    return {
      cards: result,
      meta: { totalCards: total, generatedAt: Date.now(), categories: Object.keys(result).length },
      layout: { mode: layout, enabled: layout !== 'none' },
      updateControl: { enabled: true, position: 'fixed-bottom-right' }
    };
  };
  window.JARVIS_V9_DASHBOARD = Object.freeze({ build });
})();
