/** JARVIS V9 native HA bridge. Loaded before v9-core when the HUD is embedded in the HA panel. */
(()=>{'use strict';
  if (window.parent===window) return;
  const pending=new Map(); let seq=0;
  const send=(payload)=>window.parent.postMessage({source:'jarvis-v9',...payload},'*');
  window.addEventListener('message',ev=>{
    const m=ev.data;
    if(!m||m.source!=='jarvis-ha') return;
    if(m.type==='ready'){
      window.JARVIS_HA_NATIVE=true;
      window.dispatchEvent(new CustomEvent('jarvis:ha-native-ready'));
      return;
    }
    if(m.type==='result'&&m.id!=null){
      const p=pending.get(m.id); if(!p)return; pending.delete(m.id);
      m.error?p.reject(new Error(m.error)):p.resolve(m.result);
    }
  });
  class NativeWebSocket {
    constructor(){this.readyState=0;this.onopen=null;this.onmessage=null;this.onerror=null;this.onclose=null;this.url='ws://home-assistant-native';
      window.addEventListener('jarvis:ha-native-ready',()=>{if(this.readyState===0){this.readyState=1;this.onopen?.();this._message({type:'auth_required'});}} ,{once:true});
      send({type:'hello'});
    }
    _message(data){this.onmessage?.({data:JSON.stringify(data)});}
    send(raw){let m;try{m=JSON.parse(raw)}catch{return}
      if(m.type==='auth'){this._message({type:'auth_ok',ha_native:true});return;}
      const id=m.id??(++seq);
      const promise=new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));
      send({type:'request',id,message:m});
      promise.then(result=>this._message({type:'result',id,success:true,result})).catch(e=>this._message({type:'result',id,success:false,error:{message:e.message}}));
    }
    close(){this.readyState=3;this.onclose?.();}
    addEventListener(type,fn){if(type==='message')this.onmessage=ev=>fn(ev);}
    removeEventListener(){}
  }
  window.WebSocket=NativeWebSocket;
})();
