/** JARVIS V9 — guarded Home Assistant action gateway. */
(() => {
  'use strict';
  const ALLOWED = Object.freeze({
    light: new Set(['toggle','turn_on','turn_off']),
    switch: new Set(['toggle','turn_on','turn_off']),
    fan: new Set(['toggle','turn_on','turn_off']),
    input_boolean: new Set(['toggle','turn_on','turn_off']),
    group: new Set(['toggle','turn_on','turn_off']),
    cover: new Set(['open_cover','close_cover','stop_cover']),
    media_player: new Set(['media_play','media_pause','media_play_pause','media_stop'])
  });
  const validId = id => typeof id === 'string' && /^[a-z0-9_]+\.[a-z0-9_]+$/i.test(id);
  const execute = async (request, transport) => {
    if (!request || !validId(request.entity_id) || typeof request.action !== 'string') throw new Error('Action V9 invalide');
    const domain = request.entity_id.split('.')[0].toLowerCase();
    const allowed = ALLOWED[domain];
    if (!allowed || !allowed.has(request.action)) throw new Error(`Action ${domain}.${request.action} non autorisée par V9`);
    const data = request.data && typeof request.data === 'object' ? { ...request.data } : {};
    delete data.entity_id;
    delete data.target;
    return transport({ entity_id: request.entity_id, action: request.action, data });
  };
  window.JARVIS_V9_ACTION_GATEWAY = Object.freeze({ execute, allowed: domain => Array.from(ALLOWED[domain] || []) });
})();
