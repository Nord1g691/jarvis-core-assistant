(() => {
  "use strict";
  const HUD_URL = "/jarvis_static/v5-original.html?v=9.6.0";
  const HA_ORIGIN = window.location.origin;
  const BRIDGE_SOURCE = `(() => {
    "use strict";
    if (window.parent === window) return;
    let seq = 0;
    const pending = new Map();
    const send = payload => window.parent.postMessage({ source: "jarvis-v9", ...payload }, "*");
    window.addEventListener("message", ev => {
      const m = ev.data;
      if (!m || m.source !== "jarvis-ha") return;
      if (m.type === "ready") {
        window.JARVIS_HA_NATIVE = true;
        window.dispatchEvent(new CustomEvent("jarvis:ha-native-ready"));
      }
      if (m.type === "result" && m.id != null) {
        const p = pending.get(m.id);
        if (!p) return;
        pending.delete(m.id);
        m.success === false || m.error ? p.reject(new Error(m.error?.message || m.error || "Home Assistant error")) : p.resolve(m.result);
      }
    });
    class NativeWebSocket {
      constructor(){this.readyState=0;this.url="ws://home-assistant-native";send({type:"hello"});window.addEventListener("jarvis:ha-native-ready",()=>this._open(),{once:true});}
      _open(){if(this.readyState!==0)return;this.readyState=1;this.onopen?.();this.onmessage?.({data:JSON.stringify({type:"auth_required"})});}
      send(raw){let m;try{m=JSON.parse(raw)}catch{return}if(m.type==="auth"){this.onmessage?.({data:JSON.stringify({type:"auth_ok",ha_native:true})});return}const id=m.id??(++seq);pending.set(id,{resolve:r=>this.onmessage?.({data:JSON.stringify({type:"result",id,success:true,result:r})}),reject:e=>this.onmessage?.({data:JSON.stringify({type:"result",id,success:false,error:{message:e.message}})})});send({type:"request",id,message:m});}
      close(){this.readyState=3;this.onclose?.();}
      addEventListener(t,f){this["on"+t]=f;}
      removeEventListener(){}
    }
    window.WebSocket = NativeWebSocket;
  })();`;

  class JarvisPanel extends HTMLElement {
    set hass(hass){this._hass=hass;this._sync();this._renderEntities();}
    set narrow(v){this._narrow=v;}
    set panel(v){this._panel=v;}
    connectedCallback(){
      if(this._frame)return;
      this.style.cssText="display:block;width:100%;height:100%;margin:0;padding:0;overflow:hidden;position:relative";
      this._onMessage=e=>this._handleMessage(e);
      window.addEventListener("message",this._onMessage);
      this._frame=document.createElement("iframe");
      this._frame.title="JARVIS V5";
      this._frame.allow="microphone; camera; autoplay";
      this._frame.setAttribute("frameborder","0");
      this._frame.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#01050c";
      this._frame.src=HUD_URL;
      this.appendChild(this._frame);
      this._buildSamLayer();
      this._frame.addEventListener("load",()=>{try{const doc=this._frame.contentDocument;const s=doc.createElement("script");s.textContent=BRIDGE_SOURCE;doc.head.appendChild(s);}catch(e){console.error("JARVIS bridge",e)}this._sync();});
    }
    _states(){return Object.values(this._hass?.states||{});}
    _sync(){if(!this._hass||!this._frame?.contentWindow)return;this._frame.contentWindow.postMessage({source:"jarvis-ha",type:"ready",entity_count:this._states().length,states:this._states(),config:this._hass.config||{}},HA_ORIGIN);}
    _buildSamLayer(){
      const style=document.createElement("style");
      style.textContent=`#jarvis-sam-menu{position:absolute;top:14px;right:14px;z-index:2147483647;width:44px;height:44px;border-radius:50%;border:1px solid rgba(0,234,255,.55);background:rgba(2,14,27,.92);color:#d9faff;font-size:20px;box-shadow:0 0 16px rgba(0,220,255,.2);cursor:pointer}#jarvis-sam-drawer{position:absolute;z-index:2147483646;top:14px;right:14px;width:min(390px,calc(100% - 28px));max-height:calc(100% - 28px);overflow:auto;display:none;padding:14px;background:rgba(2,12,23,.985);border:1px solid rgba(0,220,255,.4);border-radius:14px;color:#d9faff;font:12px system-ui,sans-serif;box-shadow:0 20px 70px #000}#jarvis-sam-drawer.open{display:block}#jarvis-sam-drawer h3{margin:0 0 10px;color:#76dfff;letter-spacing:2px}#jarvis-sam-drawer .sam-cat{padding:9px 0;border-top:1px solid rgba(0,220,255,.13)}#jarvis-sam-drawer button.sam-entity{width:100%;margin:4px 0;padding:8px;text-align:left;border:1px solid rgba(0,220,255,.2);border-radius:7px;background:rgba(0,120,180,.08);color:#d9faff}#jarvis-sam-close{float:right;border:0;background:none;color:#d9faff;font-size:20px}`;
      this.appendChild(style);
      const btn=document.createElement("button");btn.id="jarvis-sam-menu";btn.type="button";btn.textContent="☰";btn.setAttribute("aria-label","Menu JARVIS");
      const drawer=document.createElement("div");drawer.id="jarvis-sam-drawer";drawer.innerHTML='<button id="jarvis-sam-close">×</button><h3>JARVIS — HOME ASSISTANT</h3><div id="jarvis-sam-count">Entités : 0</div><div id="jarvis-sam-cats"></div>';
      this.append(btn,drawer);
      btn.onclick=()=>{drawer.classList.add("open");btn.style.display="none";this._renderEntities();};
      drawer.querySelector("#jarvis-sam-close").onclick=()=>{drawer.classList.remove("open");btn.style.display="block";};
      this._samBtn=btn;this._samDrawer=drawer;
    }
    _renderEntities(){
      const root=this._samDrawer?.querySelector("#jarvis-sam-cats");
      const count=this._samDrawer?.querySelector("#jarvis-sam-count");
      if(!root||!count)return;
      const states=this._states().filter(s=>s.entity_id&&!s.entity_id.startsWith("group."));
      count.textContent=`Entités : ${states.length}`;
      const groups={};
      states.forEach(s=>{const d=s.entity_id.split(".")[0];(groups[d]??=[]).push(s);});
      const order=["light","switch","climate","media_player","sensor","binary_sensor","cover","lock","fan","camera"];
      root.innerHTML="";
      [...order,...Object.keys(groups).filter(d=>!order.includes(d))].forEach(domain=>{
        const list=groups[domain];if(!list?.length)return;
        const section=document.createElement("div");section.className="sam-cat";
        const title=document.createElement("b");title.textContent=`${domain.toUpperCase()} · ${list.length}`;section.appendChild(title);
        list.slice(0,40).forEach(s=>{const b=document.createElement("button");b.className="sam-entity";b.textContent=`${s.attributes?.friendly_name||s.entity_id} — ${s.state}`;b.onclick=()=>this._toggleEntity(s);section.appendChild(b);});
        root.appendChild(section);
      });
    }
    async _toggleEntity(s){try{const [domain]=s.entity_id.split(".");const services={light:"toggle",switch:"toggle",fan:"toggle",cover:"toggle",lock:s.state==="locked"?"unlock":"lock",media_player:s.state==="playing"?"media_pause":"media_play"};const service=services[domain];if(!service)return;await this._hass.callService(domain,service,{entity_id:s.entity_id});}catch(e){console.error("JARVIS HA action",e);}}
    async _handleMessage(event){
      if(event.source!==this._frame?.contentWindow)return;
      const m=event.data;if(!m||m.source!=="jarvis-v9")return;
      if(m.type==="hello"){this._sync();return}
      if(m.type!=="request"||!this._hass)return;
      try{const r=m.message||{};let result;if(r.type==="get_states")result=this._states();else if(r.type==="get_config")result=await this._hass.callWS({type:"get_config"});else if(r.type==="get_services")result=await this._hass.callWS({type:"get_services"});else if(r.type==="call_service")result=await this._hass.callService(r.domain,r.service,r.service_data||{});else if(r.type==="http_request")result=await this._httpRequest(r);else throw new Error("Commande HA non supportée: "+r.type);this._reply(m.id,{result,success:true});}catch(error){this._reply(m.id,{error:error?.message||String(error),success:false});}
    }
    async _httpRequest(r){const p=String(r.path||""),method=String(r.method||"GET").toUpperCase();if(method==="GET"&&(p==="/api"||p==="/api/"))return{status:200,body:{message:"API running."}};if(method==="GET"&&p==="/api/states")return{status:200,body:this._states()};if(method==="GET"&&p.startsWith("/api/states/")){const id=decodeURIComponent(p.slice(12)),s=this._hass.states?.[id];return s?{status:200,body:s}:{status:404,body:{message:"Entity not found",entity_id:id}}}if(method==="GET"&&p==="/api/services")return{status:200,body:await this._hass.callWS({type:"get_services"})};return{status:404,body:{message:"API Home Assistant non supportée",path:p,method}};}
    _reply(id,p){if(id==null)return;this._frame?.contentWindow?.postMessage({source:"jarvis-ha",type:"result",id,...p},HA_ORIGIN);}
    disconnectedCallback(){if(this._onMessage)window.removeEventListener("message",this._onMessage);this._frame?.remove();this._samBtn?.remove();this._samDrawer?.remove();this._frame=null;}
  }
  if(!customElements.get("jarvis-panel"))customElements.define("jarvis-panel",JarvisPanel);
})();
