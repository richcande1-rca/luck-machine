/* LUCK MACHINE / 5D-20: fictional field-console sound system. Web Audio only. */
(()=>{'use strict';
  let context=null,master=null,noiseBuffer=null,enabled=true,used=false,lastAction=0;
  const volume=.64;
  function ensure(){
    if(!enabled)return null;
    try{
      if(!context){
        const Audio=window.AudioContext||window.webkitAudioContext;
        if(!Audio)return null;
        context=new Audio();
        master=context.createGain();master.gain.value=volume;master.connect(context.destination);
      }
      if(context.state==='suspended')context.resume().catch(()=>{});
      used=true;lastAction=Date.now();
      return context;
    }catch{return null}
  }
  function tone(hz,seconds=.08,gain=.035,wave='triangle',delay=0,endHz=hz){
    const a=ensure();if(!a)return;
    const at=a.currentTime+Math.max(0,delay),length=Math.max(.015,seconds);
    const osc=a.createOscillator(),envelope=a.createGain();
    osc.type=wave;
    osc.frequency.setValueAtTime(Math.max(35,hz),at);
    if(endHz!==hz)osc.frequency.exponentialRampToValueAtTime(Math.max(35,endHz),at+length);
    envelope.gain.setValueAtTime(.0001,at);
    envelope.gain.linearRampToValueAtTime(gain,at+Math.min(.009,length*.18));
    envelope.gain.exponentialRampToValueAtTime(.0001,at+length);
    osc.connect(envelope);envelope.connect(master);
    osc.start(at);osc.stop(at+length+.008);
  }
  function staticBurst(delay=0,seconds=.045,gain=.022,frequency=1400){
    const a=ensure();if(!a)return;
    if(!noiseBuffer){
      noiseBuffer=a.createBuffer(1,Math.ceil(a.sampleRate*.45),a.sampleRate);
      const arr=noiseBuffer.getChannelData(0);
      for(let i=0;i<arr.length;i++)arr[i]=Math.random()*2-1;
    }
    const t=a.currentTime+Math.max(0,delay),length=Math.min(.39,Math.max(.015,seconds));
    const src=a.createBufferSource(),filter=a.createBiquadFilter(),envelope=a.createGain();
    src.buffer=noiseBuffer;
    filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.75;
    envelope.gain.setValueAtTime(.0001,t);
    envelope.gain.linearRampToValueAtTime(gain,t+.004);
    envelope.gain.exponentialRampToValueAtTime(.0001,t+length);
    src.connect(filter);filter.connect(envelope);envelope.connect(master);
    src.start(t);src.stop(t+length+.005);
  }
  function relay(delay=0,strength=1){
    staticBurst(delay,.035,.031*strength,950);
    tone(95,.043,.034*strength,'square',delay,62);
    tone(190,.021,.016*strength,'triangle',delay+.015,125);
  }
  const api={
    setEnabled(on){
      enabled=Boolean(on);
      if(master&&context){
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setTargetAtTime(enabled?volume:0,context.currentTime,.008);
      }
      if(enabled){tone(440,.055,.025,'triangle');tone(620,.075,.024,'triangle',.075)}
    },
    rollStart(){relay(0,.9);relay(.12,.55);tone(104,.29,.030,'sawtooth',.025,155);tone(360,.095,.021,'square',.13,285)},
    rollTick(){staticBurst(0,.016,.009,2100);tone(200,.016,.012,'square')},
    dieStop(position){relay(0,.73);tone(350+position*75,.105,.026,'triangle',.022,275+position*45)},
    noDice(){tone(170,.12,.035,'square',0,95);relay(.09,.5)},
    hold(isHeld){relay(0,.85);tone(isHeld?570:300,.095,.024,'triangle',.032,isHeld?730:180)},
    openCall(){tone(290,.065,.025,'square');tone(260,.085,.024,'square',.105)},
    call(){relay(0,1.1);tone(174,.26,.055,'sawtooth',.035,95);tone(660,.10,.028,'square',.30);tone(660,.11,.028,'square',.47)},
    bank(points,called){
      if(called){
        if(points>0){
          relay(0,.9);
          [392,523,659,784].forEach((f,i)=>tone(f,.19,.039,'triangle',.08+i*.125));
          tone(1047,.46,.036,'sine',.59);
        }else{
          staticBurst(0,.11,.044,550);
          tone(270,.28,.051,'sawtooth',.03,115);
          tone(172,.36,.044,'square',.29,68);
        }
        return;
      }
      relay(0,.6);
      if(points<=0){tone(205,.19,.028,'square',.08,115);return}
      const count=points>=2000?4:points>=600?3:2;
      for(let i=0;i<count;i++)tone(380+i*110,.105,.026,'triangle',.08+i*.10);
      tone(690+count*80,.23,.032,'sine',.12+count*.1);
    },
    five(){
      // Short, distinctly electronic victory fanfare, not an actual military signal.
      relay(0,.85);
      [330,440,554,659,880].forEach((f,i)=>tone(f,.20,.04,'square',.09+i*.14));
      tone(1109,.58,.033,'triangle',.83);
      staticBurst(.85,.15,.016,3200);
    },
    newGame(){relay(0,.75);tone(390,.095,.026,'square',.05);tone(510,.11,.025,'triangle',.17)},
    gameOver(){staticBurst(0,.14,.020,1200);tone(640,.13,.025,'sine',.06);tone(450,.15,.025,'sine',.24);tone(290,.3,.021,'triangle',.42,190)},
    idle(){
      if(!enabled||!used||!context||document.hidden||Date.now()-lastAction<18000)return;
      if(document.getElementById('overlay')?.hidden===false)return;
      staticBurst(0,.095,.008,1800);
      tone(720,.045,.013,'sine',.11);
      tone(580,.045,.012,'sine',.22);
    }
  };
  window.LMAudio=api;
  // Ambient radio activity is infrequent, subtle, and silent until first user action.
  setInterval(()=>api.idle(),48000);
})();
