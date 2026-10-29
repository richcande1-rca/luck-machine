/* LUCK MACHINE / 5D-20 / v1.11.6: fictional field-console sound system. Web Audio only. */
(()=>{'use strict';
  let context=null,master=null,mix=null,noiseBuffer=null,enabled=true,used=false,lastAction=0;
  let lastError='',resumePending=null,scheduled=0;
  const mobileAudio=window.matchMedia?.('(max-width:700px)')?.matches||false;
  // v1.8.2: boost quiet individual voices BEFORE dynamics protection.
  // On small Chromebook speakers, emphasize audible midrange over sub-bass.
  const volume=.80,preamp=mobileAudio?1.55:5.2;
  function status(){
    return {
      supported:Boolean(window.AudioContext||window.webkitAudioContext),
      enabled,state:context?.state||'not-started',
      lastError,scheduled,boostDb:Math.round(20*Math.log10(preamp)),
      protectedOutput:!mobileAudio
    };
  }
  function resumeAudio(){
    if(!context||context.state!=='suspended'||resumePending)return resumePending||Promise.resolve();
    try{
      resumePending=Promise.resolve(context.resume()).then(()=>{
        lastError=context.state==='running'?'':'The browser has not unlocked audio playback.';
      }).catch(error=>{lastError=error?.message||'Audio playback was blocked.';})
        .finally(()=>{resumePending=null});
      return resumePending;
    }catch(error){
      lastError=error?.message||'Audio playback was blocked.';
      return Promise.resolve();
    }
  }
  function ensure(){
    if(!enabled)return null;
    try{
      if(!context){
        const Audio=window.AudioContext||window.webkitAudioContext;
        if(!Audio){lastError='Web Audio is not supported in this browser.';return null}
        context=new Audio();
        mix=context.createGain();mix.gain.value=preamp;
        if(!mobileAudio){
        const bass=context.createBiquadFilter();
        bass.type='lowshelf';bass.frequency.value=210;bass.gain.value=-3;
        const presence=context.createBiquadFilter();
        presence.type='peaking';presence.frequency.value=1150;presence.Q.value=.8;presence.gain.value=4;
        const compressor=context.createDynamicsCompressor();
        compressor.threshold.value=-18;
        compressor.knee.value=12;
        compressor.ratio.value=10;
        compressor.attack.value=.003;
        compressor.release.value=.12;
        // Final soft limiter catches transients that the compressor may pass.
        const limiter=context.createWaveShaper();
        const curve=new Float32Array(2049);
        for(let i=0;i<curve.length;i++){
          const x=i/1024-1;
          curve[i]=Math.tanh(1.7*x)/Math.tanh(1.7);
        }
        limiter.curve=curve;limiter.oversample='2x';
        master=context.createGain();master.gain.value=volume;
        mix.connect(bass);bass.connect(presence);presence.connect(compressor);
        compressor.connect(limiter);limiter.connect(master);master.connect(context.destination);
        }else{
          // Phone audio: a simple two-gain path avoids compressor, filters and
          // oversampled limiter processing while retaining the console's timbre.
          master=context.createGain();master.gain.value=volume;
          mix.connect(master);master.connect(context.destination);
        }
      }
      if(context.state==='suspended')resumeAudio();
      used=true;lastAction=Date.now();lastError=context.state==='running'?'':lastError;
      return context;
    }catch(error){
      lastError=error?.message||'Audio engine initialization failed.';
      return null;
    }
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
    osc.connect(envelope);envelope.connect(mix);scheduled++;
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
    src.connect(filter);filter.connect(envelope);envelope.connect(mix);scheduled++;
    src.start(t);src.stop(t+length+.005);
  }
  function relay(delay=0,strength=1){
    staticBurst(delay,.042,.031*strength,1400);
    tone(95,.043,.034*strength,'square',delay,62);
    tone(190,.021,.016*strength,'triangle',delay+.015,125);
    // Added a crisp mechanical overtone that survives small speakers.
    tone(840,.037,.020*strength,'square',delay+.006,620);
  }
  function rollTestPattern(){
    // Bright, distinct test signal: click + three rising beeps.
    relay(0,1.1);
    [660,880,1100].forEach((hz,i)=>tone(hz,.21,.086,'sine',.11+i*.27));
    staticBurst(.96,.08,.032,2150);
  }
  async function test(){
    if(!enabled)return {...status(),lastError:'SOUND is OFF. Enable it using SOUND: ON.'};
    const a=ensure();
    if(!a)return status();
    if(a.state!=='running')await resumeAudio();
    if(context!==a||a.state!=='running'){
      lastError=lastError||'Chrome blocked the audio context. Click PLAY AGAIN.';
      return status();
    }
    lastError='';
    rollTestPattern();
    return status();
  }
  const api={
    setEnabled(on){
      enabled=Boolean(on);
      if(master&&context){
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setTargetAtTime(enabled?volume:0,context.currentTime,.008);
      }
      if(enabled){tone(440,.055,.032,'triangle');tone(620,.075,.032,'triangle',.075)}
    },
    status,test,
    tune(channel){relay(0,.43);staticBurst(.028,.075,.015,1600);tone(240+channel*46,.11,.023,'sine',.035,330+channel*33);tone(510+channel*34,.045,.013,'triangle',.14)},
    rollStart(){if(mobileAudio){tone(155,.13,.05,'triangle',0,220);tone(560,.035,.018,'square');return}relay(0,.9);relay(.12,.55);tone(104,.29,.030,'sawtooth',.025,155);tone(360,.095,.021,'square',.13,285);tone(720,.055,.021,'square',.08,490)},
    rollTick(){if(mobileAudio)return;staticBurst(0,.025,.012,2300);tone(820,.023,.016,'square',0,590)},
    dieStop(position){if(mobileAudio){tone(390+position*65,.055,.042,'triangle',0,335+position*48);return}relay(0,.73);tone(350+position*75,.105,.026,'triangle',.022,275+position*45)},
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
      if(!enabled||!used||!context||context.state!=='running'||document.hidden||Date.now()-lastAction<18000)return;
      if(document.getElementById('overlay')?.hidden===false)return;
      staticBurst(0,.095,.008,1800);
      tone(720,.045,.013,'sine',.11);
      tone(580,.045,.012,'sine',.22);
    }
  };
  window.LMAudio=api;
  // Ambient radio activity remains subtle and silent until first user action.
  setInterval(()=>api.idle(),48000);
})();
