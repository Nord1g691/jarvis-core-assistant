/** JARVIS V9 — high-level action presets. Uses the secured runtime gateway only. */
(() => {
  'use strict';
  const runtime = () => window.JARVIS_V9_RUNTIME;
  const call = (domain, service, data, entity_id) => runtime()?.callService(domain, service, data, {entity_id});
  const api = {
    toggleLight: id => call('light','toggle',{},id),
    lightOn: (id,data={}) => call('light','turn_on',data,id),
    lightOff: id => call('light','turn_off',{},id),
    climateMode: (id,mode) => call('climate','set_hvac_mode',{hvac_mode:mode},id),
    temperature: (id,temp) => call('climate','set_temperature',{temperature:Number(temp)},id),
    coverOpen: id => call('cover','open_cover',{},id),
    coverClose: id => call('cover','close_cover',{},id),
    coverStop: id => call('cover','stop_cover',{},id),
    mediaPlay: id => call('media_player','media_play',{},id),
    mediaPause: id => call('media_player','media_pause',{},id),
    mediaStop: id => call('media_player','media_stop',{},id),
    mediaVolume: (id,level) => call('media_player','volume_set',{volume_level:Number(level)},id),
    lock: id => call('lock','lock',{},id),
    unlock: id => call('lock','unlock',{},id),
    fanOn: id => call('fan','turn_on',{},id),
    fanOff: id => call('fan','turn_off',{},id),
    refresh: () => window.dispatchEvent(new CustomEvent('jarvis:v9:refresh'))
  };
  window.JARVIS_V9_ACTIONS = Object.freeze(api);
})();
