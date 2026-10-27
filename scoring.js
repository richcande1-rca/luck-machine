/* LUCK MACHINE 5D-20 / BUILD 1.10.0
   Pure, deterministic face-aware payout math.
   Scoring does not change the random rolls or hand ranking. */
(()=>{
 'use strict';
 const bases=Object.freeze({five:5000,four:2000,full:1000,large:1500,small:600,three:400,twoPair:200,pair:100,none:0});
 const ranges=Object.freeze({five:[5100,5600],four:[2050,2300],full:[1040,1170],large:[1500,1500],small:[600,600],three:[420,520],twoPair:[230,310],pair:[110,160],none:[0,0]});
 const count=ds=>{const c=[0,0,0,0,0,0,0];ds.forEach(v=>{if(Number.isInteger(v)&&v>=1&&v<=6)c[v]++});return c};
 const fmt=n=>Number(n).toLocaleString('en-US');
 function evaluate(key,ds){
  if(!Array.isArray(ds)||ds.length!==5||ds.some(n=>!Number.isInteger(n)||n<1||n>6))return null;
  const c=count(ds),groups=[1,2,3,4,5,6].map(value=>({value,count:c[value]}));
  const faces=groups.filter(x=>x.count>=2).sort((a,b)=>b.value-a.value).map(x=>x.value);
  const top=k=>groups.filter(x=>x.count>=k).sort((a,b)=>b.value-a.value)[0]?.value||0;
  const unique=groups.filter(x=>x.count>0).map(x=>x.value);
  const runs=n=>{for(let first=1;first<=7-n;first++){if(Array.from({length:n},(_,i)=>first+i).every(v=>c[v]>0))return true}return false};
  const triple=groups.find(x=>x.count===3)?.value||0;
  const pair=groups.find(x=>x.count===2)?.value||0;
  let bonus=0,detail='',valid=false;
  switch(key){
   case 'five':valid=top(5)>0;bonus=top(5)*100;detail='FIVE '+top(5)+'s';break;
   case 'four':valid=top(4)>0;bonus=top(4)*50;detail='FOUR '+top(4)+'s';break;
   case 'full':valid=Boolean(triple&&pair);bonus=triple*20+pair*10;detail=triple+'s ×3 + '+pair+'s ×2';break;
   case 'large':valid=unique.length===5&&runs(5);detail='FIXED PAYOUT';break;
   case 'small':valid=runs(4);detail='FIXED PAYOUT';break;
   case 'three':valid=top(3)>0;bonus=top(3)*20;detail='THREE '+top(3)+'s';break;
   case 'twoPair':valid=faces.length>=2;bonus=(faces[0]+(faces[1]||0))*10;detail=faces.slice(0,2).join('s + ')+'s PAIRS';break;
   case 'pair':valid=top(2)>0;bonus=top(2)*10;detail='PAIR OF '+top(2)+'s';break;
   case 'none':valid=true;detail='NO COMBINATION';break;
   default:return null;
  }
  if(!valid)return null;
  return {key,base:bases[key],bonus,total:bases[key]+bonus,detail};
 }
 function rangeText(key,multiplier=1){const v=ranges[key]||ranges.none;const a=fmt(v[0]*multiplier),b=fmt(v[1]*multiplier);return a===b?a:a+'–'+b}
 window.LMScoring=Object.freeze({evaluate,rangeText,ranges,bases});
})();
