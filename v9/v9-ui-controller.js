/** JARVIS V9 UI controller — additive renderer, no dependency on the V5 DOM. */
(() => {
  'use strict';
  const CATEGORIES = () => window.JARVIS_V9?.categories || [];
  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  let root = null;
  let panel = null;

  function ensureStyle() {
    if (document.getElementById('jarvis-v9-ui-style')) return;
    const style = document.createElement('style');
    style.id = 'jarvis-v9-ui-style';
    style.textContent = `.jv9-menu{position:fixed;left:12px;top:12px;z-index:99990}.jv9-menu>button{width:42px;height:42px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:rgba(5,10,18,.82);color:#fff;font-size:20px}.jv9-panel{position:fixed;left:12px;top:62px;width:min(340px,calc(100vw - 24px));max-height:calc(100vh - 78px);overflow:auto;z-index:99989;padding:12px;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:rgba(5,10,18,.96);backdrop-filter:blur(18px);box-shadow:0 20px 60px rgba(0,0,0,.4);color:#fff;font:14px system-ui}.jv9-panel[hidden]{display:none}.jv9-cats{display:grid;grid-template-columns:1fr 1fr;gap:8px}.jv9-cat{padding:11px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#fff;text-align:left}.jv9-cat small{display:block;opacity:.55;margin-top:3px}.jv9-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.jv9-close{border:0;background:none;color:#fff;font-size:20px}.jv9-list{display:grid;gap:7px;margin-top:10px}.jv9-card{padding:10px;border-radius:10px;background:rgba(255,255,255,.055)}.jv9-card b{display:block}.jv9-card small{opacity:.65}`;
    document.head.appendChild(style);
  }

  function renderCategories() {
    const categories = CATEGORIES();
    panel.innerHTML = `<div class="jv9-head"><b>JARVIS V9</b><button class="jv9-close" aria-label="Fermer">×</button></div><div class="jv9-cats">${categories.map(c => `<button class="jv9-cat" data-category="${esc(c.id)}">${esc(c.label || c.name || c.id)}<small>0 élément</small></button>`).join('')}</div>`;
    panel.querySelector('.jv9-close').onclick = () => window.JARVIS_V9_MENU?.close?.();
    panel.querySelectorAll('[data-category]').forEach(button => button.onclick = () => showCategory(button.dataset.category));
    syncCounts();
  }

  function syncCounts() {
    const runtime = window.JARVIS_V9_RUNTIME;
    if (!runtime) return;
    panel?.querySelectorAll('[data-category]').forEach(button => {
      const count = runtime.getCategory(button.dataset.category).length;
      const small = button.querySelector('small');
      if (small) small.textContent = `${count} élément${count > 1 ? 's' : ''}`;
    });
  }

  function showCategory(id) {
    const category = CATEGORIES().find(c => c.id === id);
    const entities = window.JARVIS_V9_RUNTIME?.getCategory(id) || [];
    panel.innerHTML = `<div class="jv9-head"><button class="jv9-close" aria-label="Retour">‹</button><b>${esc(category?.label || id)}</b><button class="jv9-close" aria-label="Fermer">×</button></div><div class="jv9-list">${entities.length ? entities.map(e => `<div class="jv9-card"><b>${esc(e.attributes?.friendly_name || e.entity_id)}</b><small>${esc(e.state || 'unknown')}</small></div>`).join('') : '<div class="jv9-card">Aucune entité détectée</div>'}</div>`;
    const buttons = panel.querySelectorAll('.jv9-close');
    buttons[0].onclick = renderCategories;
    buttons[1].onclick = () => window.JARVIS_V9_MENU?.close?.();
  }

  function mount(target = document.body) {
    if (root) return root;
    ensureStyle();
    root = document.createElement('div');
    root.className = 'jv9-menu';
    root.innerHTML = `<button type="button" aria-label="Ouvrir le menu JARVIS V9">☰</button>`;
    panel = document.createElement('div');
    panel.className = 'jv9-panel';
    panel.hidden = true;
    target.append(root, panel);
    root.querySelector('button').onclick = () => { panel.hidden = !panel.hidden; if (!panel.hidden) { renderCategories(); window.JARVIS_V9_MENU?.open?.(); } else window.JARVIS_V9_MENU?.close?.(); };
    window.addEventListener('jarvis:v9:entities', syncCounts);
    return root;
  }

  window.JARVIS_V9_UI = Object.freeze({ mount, renderCategories, showCategory, syncCounts });
})();
