/* LUCK MACHINE 1.11.0 — only the active twelve-turn worldwide board is accessible from the game. Historical records remain in Cloudflare. */
(()=>{
 'use strict';
 const ENDPOINT='https://luck-machine-board.rich-gothic.workers.dev/api/board';
 const RULESET='face-v3-12',LIMIT=10,BUILD='1.11.0';
 let entries=[],online=false,lastError='',busy=null;
 function cleanInitials(value){return String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,5)}
 function scoreQualifies(n,board=entries){
  if(!Number.isSafeInteger(n)||n<=0)return false;
  if(!Array.isArray(board)||board.length<LIMIT)return true;
  return n>Number(board[LIMIT-1]?.score||0);
 }
 async function request(method,body){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),7000);
  try{
   const res=await fetch(ENDPOINT,{method,cache:'no-store',headers:{Accept:'application/json',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});
   const result=await res.json().catch(()=>({}));
   const expected=RULESET;
   if(res.ok&&result.ok&&result.game==='luck-machine'&&Array.isArray(result.entries)&&result.ruleset!==expected){
    throw new Error('Cloudflare Worker update required: expected '+expected+', received '+String(result.ruleset));
   }
   if(!res.ok||!result.ok||!Array.isArray(result.entries)||result.game!=='luck-machine'||result.ruleset!==expected){
    throw new Error(result.error||('World scoreboard HTTP '+res.status));
   }
   const board=result.entries.filter(e=>e&&typeof e.initials==='string'&&Number.isSafeInteger(e.score)&&e.score>0).sort((a,b)=>b.score-a.score).slice(0,LIMIT);
   entries=board;online=true;lastError='';
   window.dispatchEvent(new Event('lm-world-board-updated'));
   return board;
  }finally{clearTimeout(timeout)}
 }
 const api={
  refresh(){
   if(busy)return busy;
   busy=request('GET').catch(e=>{online=false;lastError=e.message||'Network unavailable';window.dispatchEvent(new Event('lm-world-board-updated'));throw e}).finally(()=>{busy=null});
   return busy;
  },
  async submit(initials,score){
   const name=cleanInitials(initials);
   if(!name)throw new Error('Enter 1–5 letters or digits.');
   if(!Number.isSafeInteger(score)||score<=0||score>504000)throw new Error('Invalid twelve-turn final score.');
   return request('POST',{initials:name,score,build:BUILD,ruleset:RULESET});
  },
  qualifies:scoreQualifies,cleanInitials,
  get entries(){return entries.slice()},
  get online(){return online},
  get lastError(){return lastError},
  endpoint:ENDPOINT,
  build:BUILD
 };
 window.LMWorldBoard=api;
})();
