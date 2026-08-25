/** JARVIS V9 native HA bridge. */
(()=>{'use strict';
  if(window.parent===window)return;
  const pending=new Map();let seq=0;let nativeReady=false;
  const send=payload=>window.parent.postMessage({source:'jarvis-v9',...payload},'*');
  const announce=()=>{nativeReady=true;window.JARVIS_HA_NATIVE=true;window.dispatchEvent(new CustomEvent('jarvis:ha-native-ready'));};
  window.addEventListener('message',ev=>{
    const m=ev.data;if(!m||m.source!=='jarvis-ha')return;
    if(m.type==='ready'){announce();return;}
    if(m.type==='result'&&m.id!=null){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(new Error(m.error)):p.resolve(m.result);}
  });
  class NativeWebSocket{
    constructor(){this.readyState=0;this.onopen=null;this.onmessage=null;this.onerror=null;this.onclose=null;this.url='ws://home-assistant-native';send({type:'hello'});if(nativeReady)queueMicrotask(()=>this._open());else window.addEventListener('jarvis:ha-native-ready',()=>this._open(),{once:true});}
    _open(){if(this.readyState!==0)return;this.readyState=1;this.onopen?.();this._message({type:'auth_required'});}
    _message(data){this.onmessage?.({data:JSON.stringify(data)});}
    send(raw){let m;try{m=JSON.parse(raw)}catch{return}if(m.type==='auth'){this._message({type:'auth_ok',ha_native:true});return}const id=m.id??(++seq);const promise=new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));send({type:'request',id,message:m});promise.then(result=>this._message({type:'result',id,success:true,result})).catch(e=>this._message({type:'result',id,success:false,error:{message:e.message}}));}
    close(){this.readyState=3;this.onclose?.();}
    addEventListener(type,fn){if(type==='message')this.onmessage=ev=>fn(ev);if(type==='open')this.onopen=fn;if(type==='error')this.onerror=fn;if(type==='close')this.onclose=fn;}
    removeEventListener(){}
  }
  window.WebSocket=NativeWebSocket;
  const nativeFetch=window.fetch?.bind(window);
  if(nativeFetch){
    window.fetch=async(input,init={})=>{
      const url=typeof input==='string'?input:(input?.url||'');
      let parsed;
      try{parsed=new URL(url,window.location.href)}catch{return nativeFetch(input,init)}
      if(!parsed.pathname.startsWith('/api/'))return nativeFetch(input,init);
      if(!nativeReady)await new Promise(resolve=>window.addEventListener('jarvis:ha-native-ready',resolve,{once:true}));
      const method=String(init?.method||input?.method||'GET').toUpperCase();
      let body=init?.body;
      if(body instanceof URLSearchParams)body=body.toString();
      if(body instanceof Blob)body=await body.text();
      const id=++seq;
      const promise=new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));
      send({type:'request',id,message:{type:'http_request',path:parsed.pathname+parsed.search,method,body:body??null}});
      const result=await promise;
      const responseBody=result?.body;
      const status=result?.status??200;
      return new Response(typeof responseBody==='string'?responseBody:JSON.stringify(responseBody),{status,headers:{'Content-Type':'application/json'}});
    };
  }
})();
