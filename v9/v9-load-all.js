/** JARVIS V9 loader — loads the additive modules once, in dependency order. */
(() => {
  'use strict';
  if (window.JARVIS_V9_LOAD_ALL) return;
  const files = [
    'v9/v9-config.js','v9/v9-core.js','v9/entity-adapter.js','v9/entity-discovery.js','v9/entity-selection.js',
    'v9/ha-state-store.js','v9/action-policy.js','v9/action-gateway.js','v9/category-actions.js','v9/card-model.js',
    'v9/card-layout.js','v9/dashboard-model.js','v9/context-router.js','v9/v9-bridge.js','v9/hud-bootstrap.js',
    'v9/v9-runtime.js','v9/v9-self-test.js','v9/v9-ui-controller.js'
  ];
  const loaded=new Set();
  const load=src=>new Promise((resolve,reject)=>{if(loaded.has(src)||document.querySelector(`script[data-jarvis-v9="${src}"]`)){loaded.add(src);resolve();return}const script=document.createElement('script');script.src=new URL(src,document.baseURI).href;script.dataset.jarvisV9=src;script.onload=()=>{loaded.add(src);resolve()};script.onerror=()=>reject(new Error(`Impossible de charger ${src}`));document.head.appendChild(script)});
  window.JARVIS_V9_LOAD_ALL=async()=>{for(const file of files)await load(file);const result=window.JARVIS_V9_SELF_TEST?.run?.();window.dispatchEvent(new CustomEvent('jarvis:v9-ready',{detail:result||null}));return true};
})();
