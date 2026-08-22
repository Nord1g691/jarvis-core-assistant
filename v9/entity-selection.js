/** JARVIS V9 entity selection preferences. */
(() => {
  'use strict';
  const KEY='jarvis-v9-entity-selection';
  const layouts=new Set(['none','bottom','orbital']);
  const validEntityId=id=>typeof id==='string'&&/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(id);
  const validCategory=id=>window.JARVIS_V9?.categories?.some(category=>category.id===id)===true;
  const defaults={categories:{},layout:'none'};
  const sanitize=value=>{const categories={},source=value?.categories&&typeof value.categories==='object'&&!Array.isArray(value.categories)?value.categories:{};for(const[category,ids]of Object.entries(source)){if(!validCategory(category)||!Array.isArray(ids))continue;const valid=[...new Set(ids.filter(validEntityId))];if(valid.length)categories[category]=valid}return{categories,layout:layouts.has(value?.layout)?value.layout:defaults.layout}};
  const read=()=>{try{return sanitize(JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(_){return{...defaults,categories:{}}}};
  const write=value=>{const next=sanitize(value);try{localStorage.setItem(KEY,JSON.stringify(next))}catch(_){throw new Error('Impossible de sauvegarder la sélection V9')}window.dispatchEvent(new CustomEvent('jarvis:v9-selection-changed',{detail:next}));return next};
  const toggle=(category,entityId)=>{if(!validCategory(category)||!validEntityId(entityId))return read();const state=read(),current=new Set(state.categories[category]||[]);current.has(entityId)?current.delete(entityId):current.add(entityId);return write({...state,categories:{...state.categories,[category]:[...current]}})};
  const setLayout=layout=>write({...read(),layout});
  window.JARVIS_V9_SELECTION=Object.freeze({key:KEY,defaults:{...defaults,categories:{}},read,write,toggle,sanitize,setLayout,layouts:[...layouts]});
})();
