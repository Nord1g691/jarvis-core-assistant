/** V9 discovery bridge: accepts Home Assistant states/events without hard-coded IDs. */
(() => {
  const normalize = entity => entity && entity.entity_id ? {
    entity_id: entity.entity_id,
    state: entity.state,
    attributes: entity.attributes || {}
  } : null;

  const ingestStates = (states = []) => {
    const store = window.JARVIS_V9_HA;
    if (!store) return [];
    const normalized = states.map(normalize).filter(Boolean);
    store.replace(normalized);
    return normalized;
  };

  const ingestEvent = event => {
    const store = window.JARVIS_V9_HA;
    const entity = normalize(event?.data?.new_state || event?.new_state || event);
    if (!store || !entity) return null;
    store.update(entity);
    return entity;
  };

  window.JARVIS_V9_DISCOVERY = Object.freeze({ ingestStates, ingestEvent });
})();
