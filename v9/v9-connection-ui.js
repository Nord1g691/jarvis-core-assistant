/** JARVIS V9 — connection state UI contract. Keeps credentials out of rendered markup. */
(() => {
  'use strict';
  const core=()=>window.JARVIS_V9_CORE;
  const state=()=>core()?.getConnection?.()||{status:'disconnected',url:'',error:''};
  const view=()=>{const s=state();return {status:s.status,url:s.url,error:s.error,label:s.status==='connected'?'Connecté':s.status==='connecting'?'Connexion…':s.status==='error'?'Erreur':'Déconnecté',ok:s.status==='connected'}};
  const api={view,connect:(url,token)=>core()?.connect(url,token),disconnect:()=>core()?.disconnect()};
  window.JARVIS_V9_CONNECTION_UI=Object.freeze(api);
  window.addEventListener('jarvis:v9-connection',()=>window.dispatchEvent(new CustomEvent('jarvis:v9:connection-view',{detail:view()})));
})();
