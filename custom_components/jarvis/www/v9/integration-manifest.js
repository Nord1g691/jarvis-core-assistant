/** JARVIS V9 integration manifest for the existing HUD. */
(() => {
  const scripts = [
    'v9/v9-config.js',
    'v9/ha-state-store.js',
    'v9/entity-discovery.js',
    'v9/entity-adapter.js',
    'v9/card-model.js',
    'v9/entity-selection.js',
    'v9/settings-model.js',
    'v9/card-layout.js',
    'v9/dashboard-model.js',
    'v9/category-actions.js',
    'v9/v9-bridge.js'
  ];

  const load = src => new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-jarvis-v9="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.jarvisV9 = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`V9 module failed: ${src}`));
    document.head.appendChild(script);
  });

  window.JARVIS_V9_MANIFEST = Object.freeze({ scripts: [...scripts], load });
})();
