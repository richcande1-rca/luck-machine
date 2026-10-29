/* LUCK MACHINE / BUILD 1.11.7 — 12-turn repeat-hand Top 10 with read-only prior rulesets.
 * Uses the EXISTING luck_machine_entries table; no D1 migration or score deletion.
 * Independent of Miami Nights and all other arcade scores.
 * Public anonymous scores are browser-reported, not cryptographically attested.
 */
const LIMIT=10,MAX_SCORE=873600,RULESET='face-v3-12',ARCHIVE_RULESET_12='face-v2-12',ARCHIVE_RULESET_10='face-v1-10',ARCHIVE_RULESET_20='face-v1';
const ORIGINS=new Set(['https://richcande1-rca.github.io','http://localhost:8787','http://127.0.0.1:8787','http://localhost:8000','http://127.0.0.1:8000']);
function headers(request){
 const origin=request.headers.get('Origin')||'';
 return {
   ...(ORIGINS.has(origin)?{'Access-Control-Allow-Origin':origin}:{}),
   'Access-Control-Allow-Methods':'GET, POST, OPTIONS',
   'Access-Control-Allow-Headers':'Content-Type',
   'Access-Control-Max-Age':'86400',
   'Vary':'Origin','Cache-Control':'no-store',
   'Content-Type':'application/json; charset=utf-8'
 };
}
function respond(request,data,status=200){return new Response(JSON.stringify(data),{status,headers:headers(request)})}
function normalized(payload){
 if(!payload||typeof payload!=='object'||Array.isArray(payload))return {error:'Invalid score entry.'};
 const initials=typeof payload.initials==='string'?payload.initials.trim().toUpperCase():'';
 const score=payload.score;
 const build=typeof payload.build==='string'?payload.build.trim():'';
 const ruleset=payload.ruleset;
 if(!/^[A-Z0-9]{1,5}$/.test(initials))return {error:'Initials must contain 1–5 letters or digits.'};
 if(!Number.isSafeInteger(score)||score<=0||score>MAX_SCORE)return {error:'Score is outside the valid twelve-turn range.'};
 if(ruleset!==RULESET)return {error:'Unsupported scoring ruleset.'};
 if(!/^(\d+)\.(\d+)(?:\.\d+)?$/.test(build)||build.length>24)return {error:'Invalid build identifier.'};
 return {initials,score,build,ruleset};
}
async function rows(env,ruleset=RULESET){
 const r=await env.DB.prepare('SELECT initials, score, build, created_at AS createdAt FROM luck_machine_entries WHERE ruleset = ? ORDER BY score DESC, created_at ASC, id ASC LIMIT ?')
  .bind(ruleset,LIMIT).all();
 return r.results||[];
}
async function getBoard(req,env,ruleset=RULESET){return respond(req,{ok:true,game:'luck-machine',ruleset,limit:LIMIT,entries:await rows(env,ruleset)})}
async function submit(req,env){
 let raw;
 try{
   const txt=await req.text();
   if(txt.length>1024)return respond(req,{ok:false,error:'Request too large.'},413);
   raw=JSON.parse(txt);
 }catch{return respond(req,{ok:false,error:'Invalid JSON.'},400)}
 const p=normalized(raw);
 if(p.error)return respond(req,{ok:false,error:p.error},400);
 const existing=await rows(env);
 if(existing.length>=LIMIT&&p.score<=Number(existing[LIMIT-1].score))return respond(req,{ok:false,error:'Score does not qualify for the world Top 10.',entries:existing},409);
 // Avoid accidental retries creating duplicate entries.
 const dupe=await env.DB.prepare("SELECT id FROM luck_machine_entries WHERE ruleset=? AND initials=? AND score=? AND created_at >= datetime('now','-5 minutes') LIMIT 1")
   .bind(RULESET,p.initials,p.score).first();
 if(!dupe){
  await env.DB.prepare("INSERT INTO luck_machine_entries (initials,score,build,ruleset) VALUES (?,?,?,?)")
   .bind(p.initials,p.score,p.build,RULESET).run();
  // Keep only the best ten within this *game-specific* table.
  await env.DB.prepare("DELETE FROM luck_machine_entries WHERE id IN (SELECT id FROM luck_machine_entries WHERE ruleset=? ORDER BY score DESC,created_at ASC,id ASC LIMIT -1 OFFSET ?)")
   .bind(RULESET,LIMIT).run();
 }
 return respond(req,{ok:true,game:'luck-machine',ruleset:RULESET,entries:await rows(env),duplicate:Boolean(dupe)});
}
export default {async fetch(req,env){
 const url=new URL(req.url);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:headers(req)});
 if(url.pathname==='/'&&req.method==='GET')return respond(req,{ok:true,service:'LUCK MACHINE World Scores',endpoint:'/api/board',deployed:true});
 if(url.pathname!=='/api/board')return respond(req,{ok:false,error:'Not found.'},404);
 if(!env.DB)return respond(req,{ok:false,error:'D1 binding not configured.'},503);
 try{
  if(req.method==='GET'){
    const selected=url.searchParams.get('ruleset')||RULESET;
    if(selected!==RULESET&&selected!==ARCHIVE_RULESET_12&&selected!==ARCHIVE_RULESET_10&&selected!==ARCHIVE_RULESET_20)
      return respond(req,{ok:false,error:'Unknown scoring ruleset.'},400);
    return await getBoard(req,env,selected);
  }
  if(req.method==='POST')return await submit(req,env);
  return respond(req,{ok:false,error:'Method not allowed.'},405);
 }catch(e){return respond(req,{ok:false,error:'Leaderboard storage unavailable.'},503)}
}};
