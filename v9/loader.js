/** V9 loader: append-only, loaded by the existing HUD when wired. */
(() => {
  const base = 'v9/';
  const files = [
    'v9-config.js',
    'ha-state-store.js',
    'state-presenter.js',
    'entity-adapter.js',
    'entity-selection.js',
    'settings-model.js',
    'card-layout.js',
    'card-model.js',
    'category-actions.js',
    'action-policy.js',
    'entity-discovery.js',
    'dashboard-model.js',
    'v9-bridge.js',
    'manual-menu.js',
    'hud-bootstrap.js'
  ];

  const load = (file) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-jarvis-v9="${file}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = base + file;
    script.async = false;
    script.dataset.jarvisV9 = file;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`JARVIS V9: failed to load ${file}`));
    document.head.appendChild(script);
  });

  window.JARVIS_V9_LOAD = load;
  window.JARVIS_V9_LOAD_ALL = () => files.reduce((p, file) => p.then(() => load(file)), Promise.resolve());
})();
