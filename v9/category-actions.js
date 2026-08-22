/** V9 safe action descriptor. UI/voice layer can use this to request HA service calls. */
(() => {
  const domainActions = Object.freeze({
    light: ['turn_on', 'turn_off', 'toggle'],
    climate: ['set_temperature', 'set_hvac_mode', 'turn_on', 'turn_off'],
    lock: ['lock', 'unlock'],
    cover: ['open_cover', 'close_cover', 'stop_cover', 'set_cover_position'],
    media_player: ['play_media', 'media_play_pause', 'media_stop', 'volume_set'],
    switch: ['turn_on', 'turn_off', 'toggle']
  });
  const getActions = entityId => {
    const domain = String(entityId || '').split('.')[0];
    return domainActions[domain] ? [...domainActions[domain]] : [];
  };
  const descriptor = (entityId, action, data = {}) => {
    const entityIds = Array.isArray(entityId) ? entityId : [entityId];
    return { entity_id: [...entityIds], action, data: { ...data } };
  };
  window.JARVIS_V9_ACTIONS = Object.freeze({ domainActions, getActions, descriptor });
})();
