/** JARVIS V9 — deterministic module loader. */
(() => {
  'use strict';
  if (window.JARVIS_V9_LOAD_ALL) return;
  const files=[
    'v9/v9-config.js','v9/v9-core.js','v9/entity-adapter.js','v9/entity-discovery.js','v9/entity-selection.js',
    'v9/ha-state-store.js','v9/action-policy.js','v9/action-gateway.js','v9/category-actions.js','v9/card-model.js',
    'v9/card-layout.js','v9/dashboard-model.js','v9/context-router.js','v9/v9-bridge.js','v9/hud-bootstrap.js',
    'v9/v9-runtime.js','v9/v9-self-test.js','v9/v9-action-presets.js','v9/v9-category-view.js','v9/v9-action-dispatcher.js',
    'v9/v9-settings-panel.js','v9/v9-quick-actions.js','v9/v9-connection-ui.js','v9/v9-connection-form.js','v9/v9-log-controller.js','v9/v9-v5-bridge.js','v9/v9-ui-controller.js'
  ];
  const loaded=new Set();
  const load=src=>new Promise((resolve,reject)=>{if(loaded.has(src)||document.querySelector(`script[data-jarvis-v9="${src}"]`)){loaded.add(src);resolve();return}const s=document.createElement('script');s.src=new URL(src,document.baseURI).href;s.dataset.jarvisV9=src;s.onload=()=>{loaded.add(src);resolve()};s.onerror=()=>reject(new Error(`Impossible de charger ${src}`));document.head.appendChild(s)});
  window.JARVIS_V9_LOAD_ALL=async()=>{for(const f of files)await load(f);const result=window.JARVIS_V9_SELF_TEST?.run?.();window.dispatchEvent(new CustomEvent('jarvis:v9-ready',{detail:result||null}));return true};
})();
