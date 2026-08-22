/** JARVIS V9 — category view model, action mapping and safe rendering helpers. */
(() => {
  'use strict';
  const config=()=>window.JARVIS_V9;
  const entities=()=>window.JARVIS_V9_HA?.getAll?.()||[];
  const domain=e=>String(e?.entity_id||'').split('.')[0];
  const matches=(e,c)=>{const d=domain(e), ids=c.domains||[];return ids.includes(d)||(c.key==='energy'&&['sensor','number','input_number'].includes(d))};
  const categoryEntities=key=>{const c=config?.()?.categories?.find?.(x=>x.id===key||x.key===key);return c?entities().filter(e=>matches(e,c)):[]};
  const actionsFor=e=>{const d=domain(e);if(d==='light')return ['lightOn','lightOff','toggleLight'];if(d==='climate')return ['climateMode','temperature'];if(d==='cover')return ['coverOpen','coverClose','coverStop'];if(d==='media_player')return ['mediaPlay','mediaPause','mediaStop','mediaVolume'];if(d==='lock')return ['lock','unlock'];if(d==='fan')return ['fanOn','fanOff'];return []};
  const label=e=>e?.attributes?.friendly_name||e?.entity_id||'Entité';
  const model=key=>categoryEntities(key).map(e=>({entity_id:e.entity_id,label:label(e),state:e.state,domain:domain(e),actions:actionsFor(e),attributes:e.attributes||{}}));
  const html=key=>model(key).map(e=>`<article class="j9-card" data-entity="${e.entity_id}"><div class="j9-card-title">${label(e)}</div><div class="j9-card-state">${e.state}</div><div class="j9-card-actions">${e.actions.map(a=>`<button type="button" data-j9-action="${a}" data-j9-entity="${e.entity_id}">${a}</button>`).join('')}</div></article>`).join('');
  window.JARVIS_V9_CATEGORY_VIEW=Object.freeze({model,html,actionsFor});
})();
