/** JARVIS V9 self-test: run after v9-load-all.js. No network calls are made. */
(() => {
  const tests=[];
  const check=(name,fn)=>{try{const value=fn();tests.push({name,ok:value!==false})}catch(error){tests.push({name,ok:false,error:String(error?.message||error)})}};
  const run=()=>{tests.length=0;
    check('config loaded',()=>window.JARVIS_V9?.version==='9.0');
    check('all categories declared',()=>window.JARVIS_V9?.categories?.length>=12);
    check('core loaded',()=>typeof window.JARVIS_V9_CORE?.connect==='function'&&typeof window.JARVIS_V9_CORE?.copyLog==='function');
    check('action policy accepts light',()=>window.JARVIS_V9_ACTION_POLICY?.validate({entity_id:['light.test'],action:'turn_on',data:{}})?.ok===true);
    check('policy rejects domain mismatch',()=>window.JARVIS_V9_ACTION_POLICY?.validate({entity_id:['light.test'],action:'lock',data:{}})?.reason==='action-domain-mismatch');
    check('policy rejects invalid temperature',()=>window.JARVIS_V9_ACTION_POLICY?.validate({entity_id:['climate.test'],action:'set_temperature',data:{temperature:999}})?.ok===false);
    check('policy preserves multi-target',()=>window.JARVIS_V9_ACTION_POLICY?.validate({entity_id:['light.a','light.b'],action:'turn_off',data:{}})?.descriptor?.entity_id?.length===2);
    check('state store exists',()=>typeof window.JARVIS_V9_HA?.replace==='function'&&typeof window.JARVIS_V9_HA?.subscribe==='function');
    check('dashboard builds',()=>{const model=window.JARVIS_V9_DASHBOARD?.build?.([{entity_id:'light.test',state:'on',attributes:{friendly_name:'Test'}}],{});return model?.meta?.totalCards>=1});
    check('bridge exposes runtime',()=>typeof window.JARVIS_V9_BRIDGE?.refresh==='function'&&typeof window.JARVIS_V9_BRIDGE?.executeAction==='function');
    check('HUD bootstrap exposes state',()=>typeof window.JARVIS_V9_HUD?.getState==='function');
    check('loader has self-test hook',()=>typeof window.JARVIS_V9_LOAD_ALL==='function');
    const passed=tests.filter(t=>t.ok).length,result={ok:passed===tests.length,passed,total:tests.length,tests,generatedAt:Date.now()};
    window.JARVIS_V9_SELF_TEST_RESULT=result;window.dispatchEvent(new CustomEvent('jarvis:v9-self-test',{detail:result}));return result;
  };
  window.JARVIS_V9_SELF_TEST=Object.freeze({run});
})();
