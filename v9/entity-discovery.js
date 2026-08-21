/** V9 discovery bridge: accepts Home Assistant states/events without hard-coded IDs. */
(() => {
  const normalize = entity => entity && entity.entity_id ? { entity_id: entity.entity_id, state: entity.state, attributes: entity.attributes || {} } : null;
  const ingestStates = (states = []) => {
    const store = window.JARVIS_V9_HA;
    if (!store) return [];
    const normalized = states.map(normalize).filter(Boolean);
    store.replace(normalized);
    return normalized;
  };
  const ingestEvent = event => {
    const store = window.JARVIS_V9_HA;
    if (!store) return null;
    const oldState = event?.data?.old_state ?? event?.old_state;
    const newState = event?.data?.new_state ?? event?.new_state;
    const entityId = event?.data?.entity_id || event?.entity_id || newState?.entity_id || oldState?.entity_id;
    if (!entityId) return null;
    if (newState === null) { store.remove(entityId); return null; }
    const entity = normalize(newState);
    if (!entity) return null;
    store.update(entity);
    return entity;
  };
  const ingestEventBatch = events => (Array.isArray(events) ? events.map(ingestEvent).filter(Boolean) : []);
  window.JARVIS_V9_DISCOVERY = Object.freeze({ ingestStates, ingestEvent, ingestEventBatch, normalize });
})();
