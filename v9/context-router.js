/** V9 context router: prepares explicit requests for later contextual surfaces without changing the renderer. */
(() => {
  const normalize = value => String(value || '').trim().toLowerCase();
  const route = request => {
    const text = normalize(request);
    if (!text) return { type: 'none', query: '' };
    if (/\b(news|actualit|nouvelles?)\b/.test(text)) return { type: 'news', query: request };
    if (/\b(cam(é|e)ra|caméras?|camera|cameras|surveillance)\b/.test(text)) return { type: 'cameras', query: request };
    if (/\b(musique|music|clip|chanson|vidéo|video)\b/.test(text)) return { type: 'media', query: request };
    if (/\b(solaire|solaire|panneaux|énergie|energie)\b/.test(text)) return { type: 'energy', query: request };
    return { type: 'general', query: request };
  };
  window.JARVIS_V9_CONTEXT = Object.freeze({ route });
})();
