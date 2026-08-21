/**
 * JARVIS V9 — dynamic dashboard contract
 *
 * Non-invasive module: it does not alter the existing V8/V8.9 visual layer.
 * Home Assistant remains the source of truth for entities and live state.
 */
(() => {
  const CATEGORIES = Object.freeze([
    { id: 'light', label: 'Lumière', domains: ['light'] },
    { id: 'climate', label: 'Climatisation / Chauffage', domains: ['climate'] },
    { id: 'access', label: 'Accès', domains: ['lock', 'binary_sensor', 'sensor'] },
    { id: 'pool', label: 'Piscine', domains: ['switch', 'climate', 'sensor', 'binary_sensor'] },
    { id: 'car', label: 'Voiture', domains: ['device_tracker', 'sensor', 'binary_sensor'] },
    { id: 'energy', label: 'Énergie', domains: ['sensor'] },
    { id: 'media', label: 'Média', domains: ['media_player'] },
    { id: 'camera', label: 'Caméra', domains: ['camera'] },
    { id: 'cover', label: 'Volets', domains: ['cover'] },
    { id: 'inside-outside', label: 'Intérieur / Extérieur', domains: ['sensor', 'binary_sensor', 'weather'] },
    { id: 'news', label: 'News / Actualité', domains: ['sensor', 'feedreader'] },
    { id: 'sport', label: 'Sport', domains: ['sensor'] }
  ]);

  const SETTINGS = Object.freeze([
    { id: 'account', label: 'Connexion / Compte' },
    { id: 'voice', label: 'JARVIS / Voix' },
    { id: 'system', label: 'Système' },
    { id: 'general', label: 'Paramètres généraux' }
  ]);

  const DASHBOARD = Object.freeze({
    navigation: Object.freeze(['categories', 'settings']),
    updateControl: Object.freeze({
      id: 'update',
      label: 'Mise à jour',
      position: 'fixed-bottom-right'
    }),
    preserveVisualLayer: true,
    contextualCards: true,
    orbitalCards: false
  });

  // State fields are intentionally capability-based: only attributes actually
  // supplied by Home Assistant should be rendered by the UI.
  const STATE_HINTS = Object.freeze({
    light: ['state', 'brightness', 'rgb_color', 'color_temp'],
    climate: ['state', 'temperature', 'current_temperature', 'hvac_action', 'hvac_mode'],
    access: ['state', 'locked', 'contact', 'battery'],
    pool: ['state', 'temperature', 'current_temperature', 'power'],
    car: ['state', 'battery', 'charging', 'range', 'location', 'temperature'],
    energy: ['state', 'power', 'energy', 'production', 'consumption', 'import', 'export', 'battery'],
    media: ['state', 'media_title', 'media_artist', 'volume_level', 'source'],
    camera: ['state', 'entity_picture'],
    cover: ['state', 'current_position'],
    'inside-outside': ['state', 'temperature', 'humidity', 'pressure', 'wind_speed'],
    news: ['state', 'title', 'summary', 'timestamp'],
    sport: ['state', 'title', 'score', 'timestamp']
  });

  function classifyEntity(entity) {
    const domain = String(entity?.entity_id || '').split('.')[0];
    return CATEGORIES.find(category => category.domains.includes(domain))?.id || null;
  }

  function normalizeEntity(entity) {
    const category = classifyEntity(entity);
    if (!category) return null;
    return {
      entity_id: entity.entity_id,
      category,
      state: entity.state,
      attributes: entity.attributes || {}
    };
  }

  function buildEntityIndex(states = []) {
    const index = Object.fromEntries(CATEGORIES.map(c => [c.id, []]));
    for (const entity of states) {
      const normalized = normalizeEntity(entity);
      if (normalized) index[normalized.category].push(normalized);
    }
    return index;
  }

  window.JARVIS_V9 = Object.freeze({
    version: '9.0',
    categories: CATEGORIES,
    settings: SETTINGS,
    dashboard: DASHBOARD,
    stateHints: STATE_HINTS,
    classifyEntity,
    normalizeEntity,
    buildEntityIndex
  });
})();
