/** Minimal V9 loader: append-only, loaded by the existing HUD when wired. */
(() => {
  const base = 'v9/';
  const files = [
    'v9-config.js',
    'entity-adapter.js',
    'entity-selection.js',
    'settings-model.js',
    'card-layout.js',
    'ha-state-store.js',
    'card-model.js',
    'category-actions.js',
    'entity-discovery.js',
    'dashboard-model.js',
    'v9-bridge.js'
  ];

  const load = (file) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = base + file;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`JARVIS V9: failed to load ${file}`));
    document.head.appendChild(script);
  });

  window.JARVIS_V9_LOAD = load;
  window.JARVIS_V9_LOAD_ALL = () => files.reduce((p, file) => p.then(() => load(file)), Promise.resolve());
})();
