(() => {
  "use strict";

  const CATEGORIES = [
    ["light", "💡", "Lumières"], ["climate", "🌡️", "Climat"],
    ["media_player", "🎵", "Médias"], ["lock", "🔐", "Sécurité"],
    ["cover", "🪟", "Volets"], ["switch", "🔌", "Interrupteurs"],
    ["sensor", "📊", "Capteurs"], ["fan", "🌀", "Ventilation"],
    ["scene", "🎬", "Scènes"], ["automation", "⚙️", "Automations"]
  ];

  const SOLAR = [
    ["jarvis_solar_production", "☀️", "Production solaire"],
    ["jarvis_house_consumption", "🏠", "Consommation maison"],
    ["jarvis_grid_import", "⬇️", "Import réseau"],
    ["jarvis_grid_export", "⬆️", "Export réseau"],
    ["jarvis_net_power", "⚡", "Puissance réseau"],
    ["jarvis_self_consumption", "♻️", "Autoconsommation"]
  ];

  class JarvisPanel extends HTMLElement {
    set hass(value) {
      this._hass = value;
      this.render();
    }
    set narrow(value) { this._narrow = value; }
    set panel(value) { this._panel = value; }

    connectedCallback() { this.render(); }

    esc(v) { return String(v ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

    statesFor(domain) {
      const states = this._hass?.states || {};
      return Object.values(states).filter(s => s.entity_id.startsWith(domain + "."));
    }

    fmt(s) {
      if (s === undefined || s === null || s === "unknown" || s === "unavailable") return "—";
      const n = Number(s);
      if (!Number.isFinite(n)) return this.esc(s);
      return Math.abs(n) >= 1000 ? `${(n / 1000).toFixed(2)} kW` : `${n.toFixed(0)} W`;
    }

    solarState(suffix) {
      const states = this._hass?.states || {};
      const id = Object.keys(states).find(k => k === `sensor.${suffix}` || k.endsWith(`_${suffix}`));
      return id ? states[id] : null;
    }

    async toggle(entityId) {
      const domain = entityId.split(".")[0];
      if (!this._hass) return;
      if (domain === "light" || domain === "switch" || domain === "fan") {
        await this._hass.callService(domain, "toggle", { entity_id: entityId });
      } else if (domain === "cover") {
        await this._hass.callService(domain, "toggle", { entity_id: entityId });
      }
    }

    openCategory(domain, icon, label) {
      const items = this.statesFor(domain);
      const body = items.length ? items.slice(0, 80).map(s => `
        <button class="entity" data-entity="${this.esc(s.entity_id)}">
          <span>${this.esc(s.attributes?.friendly_name || s.entity_id)}</span><b>${this.esc(s.state)}</b>
        </button>`).join("") : `<div class="empty">Aucune entité</div>`;
      this.shadowRoot.querySelector(".modalBody").innerHTML = `<h2>${icon} ${label}</h2><div class="entities">${body}</div>`;
      this.shadowRoot.querySelector(".modal").classList.add("open");
      this.shadowRoot.querySelectorAll(".entity").forEach(b => b.onclick = () => this.toggle(b.dataset.entity));
    }

    render() {
      if (!this._hass || !this.shadowRoot) return;
      const connected = !!this._hass.connection;
      const cats = CATEGORIES.map(([domain, icon, label]) => {
        const n = this.statesFor(domain).length;
        return `<button class="cat" data-domain="${domain}"><span>${icon} ${label}</span><b>${n}</b></button>`;
      }).join("");
      const solar = SOLAR.map(([suffix, icon, label]) => {
        const s = this.solarState(suffix);
        return `<div class="solar"><span>${icon} ${label}</span><b>${this.fmt(s?.state)}</b><small>${this.esc(s?.attributes?.source_entity || "auto")}</small></div>`;
      }).join("");
      this.shadowRoot.innerHTML = `<style>
        :host{display:block;height:100%;background:#01060d;color:#d9faff;font-family:Arial,sans-serif;overflow:auto}
        *{box-sizing:border-box}main{min-height:100%;padding:20px;max-width:1200px;margin:auto;background:radial-gradient(circle at 50% 35%,#06324b 0,transparent 45%),#01060d}
        header{display:flex;justify-content:space-between;align-items:center;gap:12px}.logo{font-size:28px;letter-spacing:7px;font-weight:900;text-shadow:0 0 18px #00eaff}.status{padding:8px 13px;border:1px solid #185d70;border-radius:20px;color:${connected?'#39ff88':'#ff536f'};font-size:12px}
        h2{font-size:13px;letter-spacing:3px;color:#76dfff;margin:24px 0 10px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}.cat,.solar,.action{border:1px solid #155066;background:#04131fdd;color:#d9faff;border-radius:10px;padding:14px;min-height:55px}.cat{display:flex;justify-content:space-between;align-items:center;text-align:left;font-weight:700}.cat:hover,.action:hover,.entity:hover{border-color:#00eaff;background:#06263a}.solar{display:grid;grid-template-columns:1fr auto;gap:4px}.solar b{font-size:18px;color:#39ff88}.solar small{grid-column:1/-1;opacity:.5;font-size:9px;overflow:hidden;text-overflow:ellipsis}.actions{display:flex;gap:10px;flex-wrap:wrap}.action{cursor:pointer}.modal{position:fixed;inset:0;background:#000b;display:none;padding:20px;z-index:10}.modal.open{display:flex;align-items:center;justify-content:center}.modalCard{width:min(700px,100%);max-height:90vh;overflow:auto;background:#061521;border:1px solid #1685a3;border-radius:14px;padding:18px}.modalBody{margin-top:8px}.entities{display:grid;gap:7px}.entity{display:flex;justify-content:space-between;gap:10px;width:100%;padding:10px;border:1px solid #123c4b;background:#03101a;color:#d9faff;border-radius:8px;text-align:left}.empty{opacity:.6;padding:20px}.close{float:right;border:1px solid #276073;background:#071c29;color:white;border-radius:50%;width:34px;height:34px}
      </style><main><header><div class="logo">JARVIS</div><div class="status">● HOME ASSISTANT — ${connected?'CONNECTÉ':'NON CONNECTÉ'}</div></header>
      <h2>ÉNERGIE / SOLAIRE</h2><div class="grid">${solar}</div>
      <h2>CATÉGORIES</h2><div class="grid">${cats}</div>
      <h2>ACTIONS</h2><div class="actions"><button class="action" id="settings">⚙️ RÉGLAGES JARVIS</button><button class="action" id="refresh">↻ ACTUALISER</button></div>
      <div class="modal"><div class="modalCard"><button class="close">×</button><div class="modalBody"></div></div></div></main>`;
      this.shadowRoot.querySelectorAll(".cat").forEach(b => { const c=CATEGORIES.find(x=>x[0]===b.dataset.domain); b.onclick=()=>this.openCategory(...c); });
      this.shadowRoot.querySelector(".close").onclick=()=>this.shadowRoot.querySelector(".modal").classList.remove("open");
      this.shadowRoot.querySelector("#refresh").onclick=()=>this.render();
      this.shadowRoot.querySelector("#settings").onclick=()=>{ this._hass.navigate?.("/config/integrations/integration/jarvis"); };
    }
  }
  customElements.define("jarvis-panel", JarvisPanel);
})();
