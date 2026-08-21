/** V9 action policy: validates service descriptors before any HA call is executed. */
(() => {
  const allowed = new Set(['turn_on','turn_off','toggle','set_temperature','set_hvac_mode','lock','unlock','open_cover','close_cover','stop_cover','set_cover_position','play_media','media_play_pause','media_stop','volume_set']);
  const validate = descriptor => {
    const ids = Array.isArray(descriptor?.entity_id) ? descriptor.entity_id : [descriptor?.entity_id];
    const validIds = ids.filter(entityIdIsValid);
    if (!validIds.length) return { ok: false, reason: 'invalid-entity' };
    if (!allowed.has(descriptor.action)) return { ok: false, reason: 'action-not-allowed' };
    return { ok: true, descriptor: { entity_id: validIds, action: descriptor.action, data: { ...(descriptor.data || {}) } } };
  };
  const entityIdIsValid = id => typeof id === 'string' && /^[a-z0-9_]+\.[a-z0-9_]+$/i.test(id);
  window.JARVIS_V9_ACTION_POLICY = Object.freeze({ validate, entityIdIsValid });
})();
