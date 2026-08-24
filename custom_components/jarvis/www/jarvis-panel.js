(() => {
  "use strict";
  const HUD = "https://nord1g691.github.io/jarvis-core-assistant/?native=1&v=9.2.1";
  class JarvisPanel extends HTMLElement {
    set hass(value) { this._hass=value; this._sync(); }
    set narrow(value) { this._narrow=value; }
    set panel(value) { this._panel=value; }
    connectedCallback() {
      this.style.display="block";
      this.style.width="100%";
      this.style.height="calc(100vh - var(--header-height, 56px))";
      this.style.minHeight="calc(100vh - var(--header-height, 56px))";
      this.style.margin="0";
      this.style.padding="0";
      this.style.overflow="hidden";
      this.style.position="relative";
      this.render();
    }
    render() {
      if (this._frame) return;
      this.innerHTML = `<iframe title="JARVIS" style="position:absolute;inset:0;width:100%;height:100%;min-height:100%;border:0;display:block;background:#01050c" allow="microphone;camera;autoplay" referrerpolicy="no-referrer"></iframe>`;
      this._frame=this.querySelector("iframe");
      this._onMessage=async ev=>{
        if(ev.source!==this._frame.contentWindow || ev.data?.source!=="jarvis-v9") return;
        const m=ev.data;
        if(m.type==="hello"){this._sync();return;}
        if(m.type!=="request" || !this._hass) return;
        try{
          const msg=m.message||{}; let result;
          if(msg.type==="get_states") result=Object.values(this._hass.states||{});
          else if(msg.type==="get_config") result=await this._hass.callWS({type:"get_config"});
          else if(msg.type==="get_services") result=await this._hass.callWS({type:"get_services"});
          else if(msg.type==="call_service") result=await this._hass.callService(msg.domain,msg.service,msg.service_data||{});
          else throw new Error(`Commande HA non supportée: ${msg.type}`);
          this._reply(m.id,{result});
        }catch(e){this._reply(m.id,{error:e?.message||String(e)})}
      };
      window.addEventListener("message",this._onMessage); this._frame.src=HUD;
    }
    _reply(id,payload){this._frame?.contentWindow?.postMessage({source:"jarvis-ha",type:"result",id,...payload},"*")}
    _sync(){if(this._frame?.contentWindow&&this._hass)this._frame.contentWindow.postMessage({source:"jarvis-ha",type:"ready"},"*")}
    disconnectedCallback(){if(this._onMessage)window.removeEventListener("message",this._onMessage)}
  }
  customElements.define("jarvis-panel",JarvisPanel);
})();
