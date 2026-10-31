/* LUCK MACHINE 1.13.0 — only the active twelve-turn worldwide board is accessible from the game. Historical records remain in Cloudflare. */
(()=>{
 'use strict';
 const ENDPOINT='https://luck-machine-board.rich-gothic.workers.dev/api/board';
 const RULESET='face-v3-12',BACKWARDS_RULESET='face-v3-12-backwards',LIMIT=10,BUILD='1.13.0';
 const sessions={normal:{entries:[],online:false,lastError:'',busy:null},backwards:{entries:[],online:false,lastError:'',busy:null}};
 const modeKey=mode=>mode==='backwards'?'backwards':'normal';
 const activeRuleset=mode=>modeKey(mode)==='backwards'?BACKWARDS_RULESET:RULESET;
 function cleanInitials(value){return String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,5)}
 function scoreQualifies(n,board=[],mode='normal'){
  const backwards=modeKey(mode)==='backwards';
  if(!Number.isSafeInteger(n)||n<0||(!backwards&&n===0))return false;
  if(!Array.isArray(board)||board.length<LIMIT)return true;
  return backwards?n<Number(board[LIMIT-1]?.score):n>Number(board[LIMIT-1]?.score);
 }
 async function request(method,body,mode='normal'){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),7000);
  try{
   const ruleset=activeRuleset(mode);
   const url=method==='GET'&&modeKey(mode)==='backwards'?ENDPOINT+'?ruleset='+encodeURIComponent(ruleset):ENDPOINT;
   const res=await fetch(url,{method,cache:'no-store',headers:{Accept:'application/json',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});
   const result=await res.json().catch(()=>({}));
   const expected=ruleset;
   if(res.ok&&result.ok&&result.game==='luck-machine'&&Array.isArray(result.entries)&&result.ruleset!==expected){
    throw new Error('Cloudflare Worker update required: expected '+expected+', received '+String(result.ruleset));
   }
   if(!res.ok||!result.ok||!Array.isArray(result.entries)||result.game!=='luck-machine'||result.ruleset!==expected){
    throw new Error(result.error||('World scoreboard HTTP '+res.status));
   }
   const backwards=modeKey(mode)==='backwards';
   const board=result.entries.filter(e=>e&&typeof e.initials==='string'&&Number.isSafeInteger(e.score)&&(backwards?e.score>=0:e.score>0)).sort((a,b)=>backwards?a.score-b.score:b.score-a.score).slice(0,LIMIT);
   const state=sessions[modeKey(mode)];state.entries=board;state.online=true;state.lastError='';
   window.dispatchEvent(new Event('lm-world-board-updated'));
   return board;
  }finally{clearTimeout(timeout)}
 }
 const api={
  refresh(mode='normal'){
   const m=modeKey(mode),state=sessions[m];
   if(state.busy)return state.busy;
   state.busy=request('GET',null,m).catch(e=>{state.online=false;state.lastError=e.message||'Network unavailable';window.dispatchEvent(new Event('lm-world-board-updated'));throw e}).finally(()=>{state.busy=null});
   return state.busy;
  },
  async submit(initials,score,mode='normal'){
   const m=modeKey(mode),name=cleanInitials(initials);
   if(!name)throw new Error('Enter 1–5 letters or digits.');
   if(!Number.isSafeInteger(score)||score<0||(m==='normal'&&score===0)||score>1612800)throw new Error('Invalid twelve-turn final score.');
   return request('POST',{initials:name,score,build:BUILD,ruleset:activeRuleset(m)},m);
  },
  qualifies:scoreQualifies,cleanInitials,
  forMode(mode='normal'){const state=sessions[modeKey(mode)];return {entries:state.entries.slice(),online:state.online,lastError:state.lastError}},
  get entries(){return sessions.normal.entries.slice()},
  get online(){return sessions.normal.online},
  get lastError(){return sessions.normal.lastError},
  endpoint:ENDPOINT,
  build:BUILD
 };
  window.LMWorldBoard=api;
})();
