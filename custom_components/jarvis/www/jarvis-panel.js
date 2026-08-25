(() => {
  "use strict";

  const HUD_URL = "/jarvis_static/v5-original.html?v=9.6.0";
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
    if (m.type === "result" && m.id != null) { const p=pending.get(m.id); if(!p)return; pending.delete(m.id); m.success===false||m.error?p.reject(new Error(m.error?.message||m.error||"Home Assistant error")):p.resolve(m.result); }
  });
  class NativeWebSocket {
    constructor(){this.readyState=0;this.onopen=null;this.onmessage=null;this.onerror=null;this.onclose=null;this.url="ws://home-assistant-native";send({type:"hello"});if(nativeReady)queueMicrotask(()=>this._open());else window.addEventListener("jarvis:ha-native-ready",()=>this._open(),{once:true});}
    _open(){if(this.readyState!==0)return;this.readyState=1;this.onopen?.();this._message({type:"auth_required"});}
    _message(data){this.onmessage?.({data:JSON.stringify(data)});}
    send(raw){let m;try{m=JSON.parse(raw)}catch{return}if(m.type==="auth"){this._message({type:"auth_ok",ha_native:true});return}const id=m.id??(++seq);const promise=new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));send({type:"request",id,message:m});promise.then(result=>this._message({type:"result",id,success:true,result})).catch(e=>this._message({type:"result",id,success:false,error:{message:e.message}}));}
    close(){this.readyState=3;this.onclose?.();} addEventListener(type,fn){if(type==="message")this.onmessage=fn;if(type==="open")this.onopen=fn;if(type==="error")this.onerror=fn;if(type==="close")this.onclose=fn;} removeEventListener(){}
  }
  window.WebSocket=NativeWebSocket;
  const nativeFetch=window.fetch?.bind(window);
  if(nativeFetch) window.fetch=async(input,init={})=>{const url=typeof input==="string"?input:(input?.url||"");let parsed;try{parsed=new URL(url,window.location.href)}catch{return nativeFetch(input,init)}if(!parsed.pathname.startsWith("/api/"))return nativeFetch(input,init);if(!nativeReady)await new Promise(r=>window.addEventListener("jarvis:ha-native-ready",r,{once:true}));let body=init?.body;if(body instanceof URLSearchParams)body=body.toString();if(body instanceof Blob)body=await body.text();const id=++seq;const promise=new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));send({type:"request",id,message:{type:"http_request",path:parsed.pathname+parsed.search,method:String(init?.method||input?.method||"GET").toUpperCase(),body:body??null}});const result=await promise;return new Response(typeof result?.body==="string"?result.body:JSON.stringify(result?.body),{status:result?.status??200,headers:{"Content-Type":"application/json"}});};
})();`;

  class JarvisPanel extends HTMLElement {
    set hass(hass){this._hass=hass;this._sync();} set narrow(v){this._narrow=v;} set panel(v){this._panel=v;}
    connectedCallback(){
      if(this._frame)return; this.style.cssText="display:block;width:100%;height:100%;margin:0;padding:0;overflow:hidden";
      this._onMessage=e=>this._handleMessage(e); window.addEventListener("message",this._onMessage);
      this._frame=document.createElement("iframe"); this._frame.title="JARVIS V5"; this._frame.allow="microphone; camera; autoplay"; this._frame.setAttribute("frameborder","0"); this._frame.style.cssText="position:absolute;inset:0;width:100%;height:100%;min-width:100%;min-height:100%;border:0;display:block;background:#01050c"; this._frame.src=HUD_URL; this.appendChild(this._frame);
      this._frame.addEventListener("load",()=>{try{const doc=this._frame.contentDocument;const s=doc.createElement("script");s.textContent=BRIDGE_SOURCE;doc.head.appendChild(s);const v9=doc.createElement("script");v9.src="/jarvis_static/v5-integration-layer.js?v=9.6.1";v9.async=false;doc.head.appendChild(v9);}catch(err){console.error("JARVIS injection",err)}this._sync();});
    }
    _states(){return Object.values(this._hass?.states||{});} _sync(){if(!this._hass||!this._frame?.contentWindow)return;this._frame.contentWindow.postMessage({source:"jarvis-ha",type:"ready",entity_count:this._states().length,states:this._states(),config:this._hass.config||{}},HA_ORIGIN);}
    async _handleMessage(event){if(event.source!==this._frame?.contentWindow)return;const m=event.data;if(!m||m.source!=="jarvis-v9")return;if(m.type==="hello"){this._sync();return}if(m.type!=="request"||!this._hass)return;try{const r=m.message||{};let result;if(r.type==="get_states")result=this._states();else if(r.type==="get_config")result=await this._hass.callWS({type:"get_config"});else if(r.type==="get_services")result=await this._hass.callWS({type:"get_services"});else if(r.type==="call_service")result=await this._hass.callService(r.domain,r.service,r.service_data||{});else if(r.type==="http_request")result=await this._httpRequest(r);else throw new Error("Commande HA non supportée: "+r.type);this._reply(m.id,{result,success:true});}catch(error){this._reply(m.id,{error:error?.message||String(error),success:false});}}
    async _httpRequest(r){const p=String(r.path||""),method=String(r.method||"GET").toUpperCase();if(method==="GET"&&(p==="/api"||p==="/api/"))return{status:200,body:{message:"API running."}};if(method==="GET"&&p==="/api/states")return{status:200,body:this._states()};if(method==="GET"&&p.startsWith("/api/states/")){const id=decodeURIComponent(p.slice(12)),s=this._hass.states?.[id];return s?{status:200,body:s}:{status:404,body:{message:"Entity not found",entity_id:id}}}if(method==="GET"&&p==="/api/services")return{status:200,body:await this._hass.callWS({type:"get_services"})};const match=p.match(/^\/api\/services\/([^/]+)\/([^/?]+)/);if(match&&method==="POST"){let d={};try{d=r.body?JSON.parse(r.body):{}}catch{}const sd=d.service_data||d.data||d;const result=await this._hass.callService(decodeURIComponent(match[1]),decodeURIComponent(match[2]),sd);return{status:200,body:result||{}}}return{status:404,body:{message:"API Home Assistant non supportée",path:p,method}};}
    _reply(id,p){if(id==null)return;this._frame?.contentWindow?.postMessage({source:"jarvis-ha",type:"result",id,...p},HA_ORIGIN);} disconnectedCallback(){if(this._onMessage)window.removeEventListener("message",this._onMessage);this._frame?.remove();this._frame=null;}
  }
  if(!customElements.get("jarvis-panel"))customElements.define("jarvis-panel",JarvisPanel);
})();
