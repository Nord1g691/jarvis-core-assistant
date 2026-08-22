/** V9 state presenter: exposes only useful, HA-provided values to the UI. */
(() => {
  const pick = (entity, fields = []) => {
    const attrs = entity?.attributes || {};
    const out = { state: entity?.state ?? null };
    for (const field of fields) if (attrs[field] !== undefined && attrs[field] !== null) out[field] = attrs[field];
    return out;
  };
  const summarize = entity => {
    const domain = String(entity?.entity_id || '').split('.')[0];
    const fields = window.JARVIS_V9?.stateHints?.[entity?.category] || [];
    const state = pick(entity, fields);
    if (domain === 'climate') state.temperature = state.current_temperature ?? state.temperature ?? null;
    return state;
  };
  window.JARVIS_V9_STATE_PRESENTER = Object.freeze({ pick, summarize });
})();
