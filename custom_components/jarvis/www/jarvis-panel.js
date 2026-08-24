(() => {
  "use strict";

  const HUD_URL = "/jarvis_static/v5-original.html?v=9.6.2";
  const HA_ORIGIN = window.location.origin;

  const BRIDGE_SOURCE = `
(() => {
  "use strict";
  if (window.parent === window) return;
  const pending = new Map(); let seq = 0; let nativeReady = false;
  const send = payload => window.parent.postMessage({ source: "jarvis-v9", ...payload }, "*");
  const announce = () => { nativeReady = true; window.JARVIS_HA_NATIVE = true; window.dispatchEvent(new CustomEvent("jarvis:ha-native-ready")); };
  window.addEventListener("message", ev => {
    const m = ev.data; if (!m || m.source !== "jarvis-ha") return;
    if (m.type === "ready") { announce(); return; }
    if (m.type === "result" && m.id != null) {
      const p = pending.get(m.id); if (!p) return; pending.delete(m.id);
      m.success === false || m.error ? p.reject(new Error(m.error?.message || m.error || "Home Assistant error")) : p.resolve(m.result);
    }
  });
  class NativeWebSocket {
    constructor(){ this.readyState=0; this.onopen=null; this.onmessage=null; this.onerror=null; this.onclose=null; this.url="ws://home-assistant-native"; send({type:"hello"}); if(nativeReady) queueMicrotask(()=>this._open()); else window.addEventListener("jarvis:ha-native-ready",()=>this._open(),{once:true}); }
    _open(){ if(this.readyState!==0)return; this.readyState=1; this.onopen?.(); this._message({type:"auth_required"}); }
    _message(data){ this.onmessage?.({data:JSON.stringify(data)}); }
    send(raw){ let m; try{m=JSON.parse(raw)}catch(_){return;} if(m.type==="auth"){this._message({type:"auth_ok",ha_native:true});return;} const id=m.id??(++seq); const promise=new Promise((resolve,reject)=>pending.set(id,{resolve,reject})); send({type:"request",id,message:m}); promise.then(result=>this._message({type:"result",id,success:true,result})).catch(e=>this._message({type:"result",id,success:false,error:{message:e.message}})); }
    close(){this.readyState=3;this.onclose?.();}
    addEventListener(type,fn){if(type==="message")this.onmessage=ev=>fn(ev);if(type==="open")this.onopen=fn;if(type==="error")this.onerror=fn;if(type==="close")this.onclose=fn;}
    removeEventListener(){}
  }
  window.WebSocket=NativeWebSocket;
  const nativeFetch=window.fetch?.bind(window);
  if(nativeFetch) window.fetch=async(input,init={})=>{
    const url=typeof input==="string"?input:(input?.url||""); let parsed;
    try{parsed=new URL(url,window.location.href)}catch(_){return nativeFetch(input,init)}
    if(!parsed.pathname.startsWith("/api/"))return nativeFetch(input,init);
    if(!nativeReady)await new Promise(resolve=>window.addEventListener("jarvis:ha-native-ready",resolve,{once:true}));
    const method=String(init?.method||input?.method||"GET").toUpperCase(); let body=init?.body;
    if(body instanceof URLSearchParams)body=body.toString(); if(body instanceof Blob)body=await body.text();
    const id=++seq; const promise=new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));
    send({type:"request",id,message:{type:"http_request",path:parsed.pathname+parsed.search,method,body:body??null}});
    const result=await promise; const responseBody=result?.body; const status=result?.status??200;
    return new Response(typeof responseBody==="string"?responseBody:JSON.stringify(responseBody),{status,headers:{"Content-Type":"application/json"}});
  };
})();
`;

  class JarvisPanel extends HTMLElement {
    set hass(hass){this._hass=hass;this._sync();}
    set narrow(value){this._narrow=value;}
    set panel(value){this._panel=value;}

    connectedCallback(){
      if(this._frame)return;
      this.style.cssText="display:block;width:100%;height:100%;margin:0;padding:0;overflow:hidden;position:relative";
      this._onMessage=event=>this._handleMessage(event); window.addEventListener("message",this._onMessage);
      this._frame=document.createElement("iframe"); this._frame.title="JARVIS V5"; this._frame.allow="microphone; camera; autoplay"; this._frame.setAttribute("frameborder","0");
      this._frame.style.cssText="position:absolute;inset:0;width:100%;height:100%;min-width:100%;min-height:100%;border:0;display:block;background:#01050c"; this._frame.src=HUD_URL; this.appendChild(this._frame);
      this._frame.addEventListener("load",()=>{try{const doc=this._frame.contentDocument;const script=doc.createElement("script");script.textContent=BRIDGE_SOURCE;doc.head.appendChild(script);}catch(err){console.error("JARVIS bridge",err)}this._installMenu();this._sync();});
    }

    _installMenu(){
      if(this._menu)return;
      const doc=this._frame?.contentDocument;
      if(doc?.body){
        const style=doc.createElement("style"); style.textContent=`.jarvis-menu-btn{position:fixed!important;top:14px!important;left:14px!important;z-index:99999!important;width:46px!important;height:46px!important;border:1px solid rgba(0,234,255,.65)!important;border-radius:50%!important;background:rgba(1,5,12,.9)!important;color:#00eaff!important;font-size:22px!important;box-shadow:0 0 18px rgba(0,234,255,.25)!important;cursor:pointer!important}.jarvis-menu{position:fixed!important;top:68px!important;left:14px!important;z-index:99998!important;width:min(340px,calc(100% - 28px));padding:14px;border:1px solid rgba(0,234,255,.4);border-radius:16px;background:rgba(1,5,12,.96);backdrop-filter:blur(14px);box-shadow:0 12px 40px rgba(0,0,0,.55);display:none;color:#d9faff;font-family:Arial,sans-serif}.jarvis-menu.open{display:block}.jarvis-menu h3{margin:0 0 12px;color:#00eaff}.jarvis-menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.jarvis-card{padding:13px;border:1px solid rgba(0,234,255,.22);border-radius:12px;background:rgba(0,80,130,.14);color:#d9faff;cursor:pointer}.jarvis-card small{display:block;opacity:.65;margin-top:4px}`; doc.head.appendChild(style);
        const btn=doc.createElement("button"); btn.className="jarvis-menu-btn"; btn.type="button"; btn.title="Menu JARVIS"; btn.textContent="☰";
        const menu=doc.createElement("div"); menu.className="jarvis-menu"; menu.innerHTML=`<h3>JARVIS</h3><div class="jarvis-menu-grid"><div class="jarvis-card" data-action="states">🏠 Maison<small>États des appareils</small></div><div class="jarvis-card" data-action="energy">⚡ Énergie<small>Production / export</small></div><div class="jarvis-card" data-action="lights">💡 Lumières<small>Contrôles disponibles</small></div><div class="jarvis-card" data-action="cameras">📷 Caméras<small>Surveillance</small></div></div>`;
        btn.addEventListener("click",()=>menu.classList.toggle("open")); menu.addEventListener("click",e=>{const card=e.target.closest(".jarvis-card");if(!card)return;this._runMenuAction(card.dataset.action);menu.classList.remove("open")}); doc.body.append(btn,menu); this._menu={btn,menu}; return;
      }
    }

    async _runMenuAction(action){
      if(action==="states"){const count=this._states().length;this._notify(`🏠 ${count} entités Home Assistant disponibles`);}
      else if(action==="energy"){const states=this._states().filter(s=>/power|energy|production|export|solar/i.test(s.entity_id+" "+(s.attributes?.friendly_name||"")));this._notify(`⚡ ${states.length} entités énergie trouvées`);}
      else if(action==="lights"){const states=this._states().filter(s=>s.entity_id.startsWith("light."));this._notify(`💡 ${states.length} lumières disponibles`);}
      else if(action==="cameras"){const states=this._states().filter(s=>s.entity_id.startsWith("camera."));this._notify(`📷 ${states.length} caméras disponibles`);}
    }
    _notify(text){const doc=this._frame?.contentDocument||document;const n=doc.createElement("div");n.style.cssText="position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:100000;padding:10px 16px;border:1px solid rgba(0,234,255,.35);border-radius:12px;background:rgba(1,5,12,.9);color:#d9faff;font:600 15px Arial;box-shadow:0 0 20px rgba(0,234,255,.16)";n.textContent=text;(doc.body||document.body).appendChild(n);setTimeout(()=>n.remove(),2200);}
    _states(){return Object.values(this._hass?.states||{});}
    _sync(){if(!this._hass||!this._frame?.contentWindow)return;this._frame.contentWindow.postMessage({source:"jarvis-ha",type:"ready",entity_count:this._states().length,states:this._states(),config:this._hass.config||{}},HA_ORIGIN);}

    async _handleMessage(event){
      if(event.source!==this._frame?.contentWindow)return; const message=event.data; if(!message||message.source!=="jarvis-v9")return; if(message.type==="hello"){this._sync();return;} if(message.type!=="request"||!this._hass)return;
      try{const request=message.message||{};let result;
        if(request.type==="get_states")result=this._states();
        else if(request.type==="get_config")result=await this._hass.callWS({type:"get_config"});
        else if(request.type==="get_services")result=await this._hass.callWS({type:"get_services"});
        else if(request.type==="call_service")result=await this._hass.callService(request.domain,request.service,request.service_data||{});
        else if(request.type==="http_request")result=await this._httpRequest(request);
        else throw new Error("Commande HA non supportée: "+request.type);
        this._reply(message.id,{result,success:true});
      }catch(error){this._reply(message.id,{error:error?.message||String(error),success:false});}
    }

    async _httpRequest(request){
      const path=String(request.path||""); const method=String(request.method||"GET").toUpperCase();
      if(method==="GET"&&(path==="/api"||path==="/api/"))return{status:200,body:{message:"API running."}};
      if(method==="GET"&&path==="/api/states")return{status:200,body:this._states()};
      if(method==="GET"&&path.startsWith("/api/states/")){const entityId=decodeURIComponent(path.slice("/api/states/".length));const state=this._hass.states?.[entityId];return state?{status:200,body:state}:{status:404,body:{message:"Entity not found",entity_id:entityId}};}
      if(method==="GET"&&path==="/api/services")return{status:200,body:await this._hass.callWS({type:"get_services"})};
      if(path==="/api/conversation/process"&&method==="POST"){
        let data={};try{data=request.body?JSON.parse(request.body):{};}catch(_){throw new Error("Corps Assist invalide");}
        if(typeof this._hass.callApi==="function"){const body=await this._hass.callApi("POST","conversation/process",data);return{status:200,body};}
        const result=await this._hass.callWS({type:"conversation/process",...data});return{status:200,body:result};
      }
      const match=path.match(/^\/api\/services\/([^/]+)\/([^/?]+)/);
      if(match&&method==="POST"){let data={};try{data=request.body?JSON.parse(request.body):{};}catch(_){}const serviceData=data.service_data||data.data||data;const result=await this._hass.callService(decodeURIComponent(match[1]),decodeURIComponent(match[2]),serviceData);return{status:200,body:result||{}};}
      return{status:404,body:{message:"API Home Assistant non supportée",path,method}};
    }
    _reply(id,payload){if(id==null)return;this._frame?.contentWindow?.postMessage({source:"jarvis-ha",type:"result",id,...payload},HA_ORIGIN);}
    disconnectedCallback(){if(this._onMessage)window.removeEventListener("message",this._onMessage);this._frame?.remove();this._frame=null;}
  }
  if(!customElements.get("jarvis-panel"))customElements.define("jarvis-panel",JarvisPanel);
})();