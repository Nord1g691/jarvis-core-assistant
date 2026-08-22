/** JARVIS V9 — UI action dispatcher. Delegates exclusively to secured presets. */
(() => {
  'use strict';
  const actions=()=>window.JARVIS_V9_ACTIONS;
  async function dispatch(action,entityId,detail={}){
    const a=actions(); if(!a||typeof a[action]!=='function') throw new Error(`Action V9 inconnue: ${action}`);
    const result=await a[action](entityId,detail.value??detail.temperature??detail.level);
    window.dispatchEvent(new CustomEvent('jarvis:v9:action-complete',{detail:{action,entityId,result}}));
    return result;
  }
  function bind(root=document){root.addEventListener('click',async event=>{const b=event.target.closest?.('[data-j9-action][data-j9-entity]');if(!b)return;event.preventDefault();b.disabled=true;try{await dispatch(b.dataset.j9Action,b.dataset.j9Entity,{value:b.dataset.j9Value})}catch(error){window.dispatchEvent(new CustomEvent('jarvis:v9:error',{detail:{message:error.message,action:b.dataset.j9Action,entityId:b.dataset.j9Entity}}))}finally{b.disabled=false}})}
  window.JARVIS_V9_ACTION_DISPATCHER=Object.freeze({dispatch,bind});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>bind());else bind();
})();
