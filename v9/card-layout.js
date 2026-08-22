/** JARVIS V9 card layout preferences: bottom / none now, orbital reserved. */
(() => {
  const KEY = 'jarvis-v9-card-layout';
  const VALID = new Set(['none', 'bottom', 'orbital']);
  const read = () => {
    const value = localStorage.getItem(KEY) || 'none';
    return VALID.has(value) ? value : 'none';
  };
  const set = (layout) => {
    if (!VALID.has(layout)) throw new Error(`Unsupported layout: ${layout}`);
    localStorage.setItem(KEY, layout);
    window.dispatchEvent(new CustomEvent('jarvis:v9-layout-changed', { detail: layout }));
    return layout;
  };
  window.JARVIS_V9_LAYOUT = Object.freeze({ read, set, modes: [...VALID] });
})();
