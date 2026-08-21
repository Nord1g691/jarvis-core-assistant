/** V9 dashboard model: optional manual categories with fixed update control. */
(() => {
  const build = (entities = [], selected = {}) => {
    const cards = window.JARVIS_V9_CARDS?.build(entities) || {};
    const result = {};
    for (const [category, items] of Object.entries(cards)) {
      const allowed = selected[category];
      result[category] = Array.isArray(allowed) && allowed.length
        ? items.filter(card => allowed.includes(card.entity_id))
        : items;
    }
    return {
      cards: result,
      updateControl: { enabled: true, position: 'fixed-bottom-right' }
    };
  };
  window.JARVIS_V9_DASHBOARD = Object.freeze({ build });
})();
