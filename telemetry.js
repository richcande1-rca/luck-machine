/* LUCK MACHINE 5D-20 / v1.11.2 — mobile-throttled signal instrumentation.
   Pure presentation. Never feeds back into scoring, RNG or dice controls. */
(()=>{'use strict';
  const $=id=>document.getElementById(id);
  const knob=$('radioDial');
  const needle=$('meterNeedle');
  const channelText=$('radioChannel');
  const linkText=$('radioLinkStatus');
  const screenText=$('telemetryLink');
  const bars=[...document.querySelectorAll('.scope-path .path-footer i')];
  if(!knob||!needle||!channelText||!linkText||!screenText||bars.length!==5)return;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const pad=n=>String(n).padStart(2,'0');
  const levels=[0,38,62,47,78,56,85,93,72,49];
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||false;
  const mobile=window.matchMedia?.('(max-width:700px)');
  let channel=7,rolling=false,stops=0,pulse=0,pulseUntil=0,event='idle',frame=0;
  let previousPower=-1,tuneTimer=0,drag=null,skipClick=false,channelVersion=0;
  const alive=()=>!document.hidden;
  function base(){return 19+levels[channel]*.54}
  function setChannel(next,notify=true){
    const value=clamp(next,1,9);
    if(channel===value)return;
    channel=value;
    channelVersion++;
    channelText.textContent='КАНАЛ '+pad(channel);
    linkText.textContent='НАСТРОЙКА';
    screenText.textContent='CH '+pad(channel)+' · TUNING';
    knob.setAttribute('aria-label','Radio channel '+pad(channel)+'. Click or drag sideways to tune, or use left and right arrow keys.');
    knob.style.transform='rotate('+(-96+(channel-1)*24)+'deg)';
    if(notify)try{window.LMAudio?.tune?.(channel)}catch{}
    const version=channelVersion;
    clearTimeout(tuneTimer);
    tuneTimer=setTimeout(()=>{
      if(version!==channelVersion)return;
      linkText.textContent='СВЯЗЬ ЕСТЬ';
      screenText.textContent='LINK ESTABLISHED';
    },440);
    pulse=Math.min(95,base()+12);pulseUntil=performance.now()+370;event='tune';
    paint(performance.now());
  }
  function initChannel(){
    channelText.textContent='КАНАЛ 07';
    knob.style.transform='rotate('+(-96+6*24)+'deg)';
    knob.setAttribute('aria-label','Radio channel 07. Click or drag sideways to tune, or use left and right arrow keys.');
    linkText.textContent='СВЯЗЬ ЕСТЬ';
    screenText.textContent='LINK ESTABLISHED';
  }
  function paint(now){
    // Phone compact mode hides the radio; never repaint invisible instrumentation.
    if(mobile?.matches||!alive())return;
    const t=now/1000;
    let strength=base();
    const active=now<pulseUntil;
    if(rolling){
      const oscillation=reduced?7:22*Math.sin(t*13)+10*Math.sin(t*5.2);
      strength=clamp(base()+8+oscillation+stops*2,8,100);
    }else if(active){
      const progress=clamp((pulseUntil-now)/1200,0,1);
      const target=event==='success'?98:event==='failure'?9:event==='call'?86:event==='bank'?81:event==='tune'?pulse:base();
      strength=base()+(target-base())*Math.min(1,progress*2);
      if(!reduced)strength+=Math.sin(t*11)*Math.min(6,progress*6);
    }else if(!reduced){
      strength+=1.5*Math.sin(t*1.8)+1.1*Math.sin(t*3.3);
    }
    strength=clamp(strength,0,100);
    const rounded=Math.round(strength);
    if(Math.abs(rounded-previousPower)<1 && !rolling && !active)return;
    previousPower=rounded;
    needle.style.transform='rotate('+(-63+strength*1.26)+'deg)';
    needle.dataset.alert=String(event==='success'&&active);
    const barCount=clamp(Math.round(strength/20),0,5);
    bars.forEach((el,i)=>{
      el.dataset.active=String(i<barCount);
      el.style.height=(5+Math.round(strength*(.05+(i%3)*.028)))+'px';
      el.style.opacity=i<barCount?'1':'.36';
    });
    screenText.dataset.alert=String(event==='failure'&&active);
  }
  function signal(kind,duration=1300){
    event=kind;pulseUntil=performance.now()+duration;
    paint(performance.now());
  }
  // The only exposed hooks are visual notifications from the game.
  window.LMTelemetry={
    rollStart(){rolling=true;stops=0;event='rolling';paint(performance.now())},
    dieStop(){stops=Math.min(5,stops+1);pulseUntil=performance.now()+210;paint(performance.now())},
    rollEnd(){rolling=false;signal('bank',550)},
    hold(){signal('tune',340)},
    call(){signal('call',1100)},
    bank(points,called){rolling=false;signal(called?(points>0?'success':'failure'):(points>0?'bank':'failure'),called?2000:1100)},
    reset(){rolling=false;stops=0;event='idle';pulseUntil=0;paint(performance.now())},
    getChannel(){return channel}
  };
  knob.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    drag={id:e.pointerId,x:e.clientX,origin:channel,moved:false,last:channel};
    skipClick=false;
    try{knob.setPointerCapture(e.pointerId)}catch{}
  });
  knob.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    const delta=e.clientX-drag.x;
    if(Math.abs(delta)>=13)drag.moved=true;
    if(!drag.moved)return;
    const next=clamp(drag.origin+Math.round(delta/18),1,9);
    if(next!==drag.last){drag.last=next;setChannel(next)}
  });
  knob.addEventListener('pointerup',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    skipClick=drag.moved;drag=null;
    // A drag should not consume the next tap if a browser omits the synthetic click.
    if(skipClick)setTimeout(()=>{skipClick=false},0);
    try{knob.releasePointerCapture(e.pointerId)}catch{}
  });
  knob.addEventListener('pointercancel',()=>{drag=null;skipClick=false});
  knob.addEventListener('click',()=>{
    if(skipClick){skipClick=false;return}
    setChannel(channel===9?1:channel+1);
  });
  knob.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();setChannel(channel===9?1:channel+1)}
    if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();setChannel(channel===1?9:channel-1)}
    if(e.key==='Home'){e.preventDefault();setChannel(1)}
    if(e.key==='End'){e.preventDefault();setChannel(9)}
  });
  initChannel();paint(performance.now());
  // Avoid a constant seven-frame-per-second radio repaint when a phone is idle.
  // Interactive tuning and roll events still repaint immediately via paint/signal.
  function schedulePaint(){
    const now=performance.now();
    if(alive())paint(now);
    const delay=!alive()?1000:mobile?.matches?2500:(reduced?500:140);
    setTimeout(schedulePaint,delay);
  }
  schedulePaint();
})();
