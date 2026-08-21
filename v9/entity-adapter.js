/** JARVIS V9 entity adapter: normalizes Home Assistant state data for cards. */
(() => {
  const V9 = window.JARVIS_V9;
  if (!V9) return;
  const value = (entity, key, fallback = null) => {
    if (!entity) return fallback;
    if (key === 'state') return entity.state ?? fallback;
    return entity.attributes?.[key] ?? fallback;
  };
  const displayState = entity => {
    const domain = String(entity?.entity_id || '').split('.')[0], state = entity?.state, attrs = entity?.attributes || {};
    if (domain === 'light') return state === 'on' ? 'Allumée' : 'Éteinte';
    if (domain === 'climate') return attrs.current_temperature ?? attrs.temperature ?? state;
    if (domain === 'lock') return state === 'locked' ? 'Verrouillé' : state === 'unlocked' ? 'Déverrouillé' : state;
    if (domain === 'cover') return state === 'open' ? 'Ouvert' : state === 'closed' ? 'Fermé' : state;
    if (domain === 'media_player') return state === 'playing' ? 'Lecture' : state === 'paused' ? 'Pause' : state;
    return state;
  };
  const cardModel = entity => ({
    entity_id: entity.entity_id,
    category: entity.category || V9.classifyEntity(entity),
    name: entity.attributes?.friendly_name || entity.entity_id,
    state: entity.state,
    displayState: displayState(entity),
    attributes: entity.attributes || {},
    presentation: window.JARVIS_V9_STATE_PRESENTER?.summarize(entity) || { state: entity.state }
  });
  const cardModels = entities => (Array.isArray(entities) ? entities.map(cardModel).filter(Boolean) : []);
  window.JARVIS_V9_ENTITY_ADAPTER = Object.freeze({ value, displayState, cardModel, cardModels });
})();
