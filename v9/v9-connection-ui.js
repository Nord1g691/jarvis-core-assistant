/** JARVIS V9 — native Home Assistant connection controller. */
(()=>{'use strict';
const core=()=>window.JARVIS_V9_CORE;
const state=()=>core()?.getConnection?.()||{status:'disconnected',url:'',error:'',native:false};
const view=()=>{const s=state();return {status:s.status,url:s.url,error:s.error,native:s.native,ok:s.status==='connected',label:s.status==='connected'?'Connecté à Home Assistant':s.status==='connecting'?'Connexion…':s.status==='error'?'Erreur':'Déconnecté'}};
const connect=async()=>{try{return await core()?.connectNative?.()}catch(e){window.dispatchEvent(new CustomEvent('jarvis:v9-connection-invalid',{detail:{message:e.message}}));throw e}};
const api=Object.freeze({view,connect,submit:connect,disconnect:()=>core()?.disconnect?.()});
window.JARVIS_V9_CONNECTION_UI=api;
window.addEventListener('jarvis:v9-connection',()=>window.dispatchEvent(new CustomEvent('jarvis:v9:connection-view',{detail:view()})));
})();
