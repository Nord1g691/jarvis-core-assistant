/** V9 category/card model. UI can render this without knowing HA internals. */
(() => {
  const V9 = window.JARVIS_V9;
  const Adapter = window.JARVIS_V9_ENTITY_ADAPTER;
  if (!V9 || !Adapter) return;
  const cardsFor = (entities = [], category) => entities
    .filter(entity => (entity.category || V9.classifyEntity(entity)) === category)
    .map(Adapter.cardModel);
  const build = (entities = []) => Object.fromEntries(
    V9.categories.map(category => [category.id, cardsFor(entities, category.id)])
  );
  const visible = (entities = [], settings = {}) => {
    if (settings.dashboard?.showCategories === false) return {};
    return build(entities);
  };
  window.JARVIS_V9_CARDS = Object.freeze({ cardsFor, build, visible });
})();
