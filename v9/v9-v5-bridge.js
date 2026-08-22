/** JARVIS V9 -> V5 compatibility bridge. No credentials are forwarded. */
(() => {
  'use strict';
  const emit=(name,detail={})=>window.dispatchEvent(new CustomEvent(name,{detail}));
  const safeConnection=()=>{const s=window.JARVIS_V9_CORE?.getConnection?.()||{};return {status:s.status||'disconnected',url:s.url||'',error:s.error||'',ok:s.status==='connected'}};
  const sync=()=>emit('jarvis:v5:connection',{connection:safeConnection()});
  window.JARVIS_V9_V5_BRIDGE=Object.freeze({sync});
  window.addEventListener('jarvis:v9-connection',sync);
  window.addEventListener('jarvis:v9-ready',sync);
})();
