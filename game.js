'use strict';
// ===== data =====
const P=[{n:'Soviet Union',c:'#b8312f',cap:15},{n:'Germany',c:'#6f7680',cap:8},{n:'United Kingdom',c:'#c7a565',cap:6},{n:'Japan',c:'#e58a2a',cap:26},{n:'United States',c:'#4f7d3a',cap:1}];
const TEAM=[0,1,0,1,0],TN=['Allies','Axis'];
// name, sea, owner, ipc, ic, vc, x, y
const LOC=[["Western US",0,4,10,1,"San Francisco",120,250],["Eastern US",0,4,12,1,"Washington",215,240],["Canada",0,2,3,0,"",175,160],["Alaska",0,4,2,0,"",75,120],["Mexico",0,4,2,0,"",150,330],["Brazil",0,4,3,0,"",275,440],
["United Kingdom",0,2,8,1,"London",395,165],["France",0,1,6,0,"Paris",420,250],["Germany",0,1,10,1,"Berlin",490,215],["Italy",0,1,3,1,"Rome",485,300],["Poland",0,1,3,0,"Warsaw",545,180],["Balkans",0,1,3,0,"",550,265],["Norway",0,1,3,0,"",480,110],
["Karelia",0,0,2,0,"Leningrad",575,95],["Ukraine",0,0,2,0,"",610,220],["Russia",0,0,8,1,"Moscow",650,140],["Caucasus",0,0,4,1,"Stalingrad",665,255],["Kazakh",0,0,2,0,"",720,215],["Siberia",0,0,1,0,"",740,105],
["Libya",0,1,1,0,"",475,370],["Egypt",0,2,2,0,"Cairo",560,365],["Persia",0,2,2,0,"",640,330],["India",0,2,3,1,"Calcutta",715,350],["Africa",0,2,3,0,"",520,470],["China",0,4,2,0,"Chongqing",790,250],["Manchuria",0,3,3,0,"Shanghai",825,165],
["Japan",0,3,8,1,"Tokyo",880,205],["Indochina",0,3,2,0,"",790,345],["East Indies",0,3,4,0,"",790,440],["Philippines",0,3,3,0,"Manila",865,330],["Australia",0,2,2,0,"Sydney",845,510],["Hawaii",0,4,1,0,"Honolulu",50,400],
["East Pacific",1],["Central Pacific",1],["Caribbean",1],["West Atlantic",1],["North Atlantic",1],["South Atlantic",1],["North Sea",1],["Bay of Biscay",1],["Mediterranean",1],["Baltic Sea",1],["Arctic Sea",1],["W. Indian Ocean",1],["E. Indian Ocean",1],["South China Sea",1],["Sea of Japan",1],["West Pacific",1],["Coral Sea",1]]
 .map(a=>({n:a[0],sea:!!a[1],own:a[2]??-1,v:a[3]||0,ic:!!a[4],vc:a[5]||'',x:a[6],y:a[7]}));
[[55,260],[100,470],[215,355],[285,250],[320,105],[380,420],[450,165],[345,240],[430,330],[530,135],[530,40],[630,430],[720,470],[840,265],[860,90],[890,400],[890,470]].forEach(([x,y],i)=>{LOC[32+i].x=x;LOC[32+i].y=y});
LOC.forEach(L=>{L.x=Math.round(L.x*1.22)});
const EDG="0-1,0-2,0-3,0-4,1-2,1-4,2-3,4-5,7-8,7-9,8-9,8-10,8-12,9-11,10-11,10-13,10-14,11-14,12-13,13-15,14-15,14-16,15-16,15-18,15-17,16-17,16-21,17-18,17-22,17-24,18-24,18-25,19-20,19-23,20-21,20-23,21-22,22-24,22-27,24-25,24-27";
const SEAADJ={32:[[0,3],[33,34,46,47]],33:[[31,4],[32,48,34,47]],34:[[1,4,5],[32,33,35,37]],35:[[1,2],[34,36,37,39]],36:[[2,6],[35,38,39,42]],37:[[5,23],[34,35,39,43]],38:[[6,7,8,12],[36,39,41,42]],39:[[6,7],[35,36,37,38,40]],40:[[7,9,11,19,20],[39,43]],41:[[8,10,12,13],[38]],42:[[12,13,15],[36,38]],43:[[20,21,23,22],[37,40,44]],44:[[22,27,28,30],[43,45,48]],45:[[24,25,27,28,29],[44,46,47,48]],46:[[25,26,18],[45,47,32]],47:[[26,29],[45,46,48,32,33]],48:[[30,28,29],[44,45,47,33]]};
const ADJ=LOC.map(()=>new Set());const link=(a,b)=>{ADJ[a].add(b);ADJ[b].add(a)};
EDG.split(',').forEach(s=>{const[a,b]=s.split('-').map(Number);link(a,b)});
for(const k in SEAADJ){SEAADJ[k][0].forEach(l=>link(+k,l));SEAADJ[k][1].forEach(s=>link(+k,s))}
const WRAP=new Set(['46-32','47-32','47-33','48-33']);
const U={inf:{n:'Infantry',a:1,d:2,m:1,c:3,t:'L'},art:{n:'Artillery',a:2,d:2,m:1,c:4,t:'L'},tank:{n:'Tank',a:3,d:3,m:2,c:6,t:'L'},aa:{n:'AA Gun',a:0,d:0,m:1,c:5,t:'L'},
ftr:{n:'Fighter',a:3,d:4,m:4,c:10,t:'A'},bmb:{n:'Bomber',a:4,d:1,m:6,c:12,t:'A'},bb:{n:'Battleship',a:4,d:4,m:2,c:20,t:'S',hp:2},cv:{n:'Carrier',a:0,d:2,m:2,c:14,t:'S'},
tr:{n:'Transport',a:0,d:0,m:2,c:7,t:'S'},sub:{n:'Submarine',a:2,d:1,m:2,c:6,t:'S'},dd:{n:'Destroyer',a:2,d:2,m:2,c:8,t:'S'},ca:{n:'Cruiser',a:3,d:3,m:2,c:12,t:'S'},ic:{n:'Industrial Complex',a:0,d:0,m:0,c:15,t:'X'}};
const BUY=['inf','art','tank','aa','ftr','bmb','tr','sub','dd','ca','cv','bb','ic'];
const START={0:"15:inf*3,art,tank*2,aa,ftr;13:inf*3,art;14:inf*2,tank;16:inf*3,art;17:inf;18:inf*2;42:sub",
1:"8:inf*6,art*2,tank*3,aa,ftr*2,bmb;7:inf*5,art,tank*2,ftr,aa;10:inf*4,art,tank*2;11:inf*3,tank;9:inf*4,art,tank;12:inf*3,ftr;19:inf*3,art,tank;41:tr,dd;40:bb,tr,dd;39:sub;38:sub",
2:"6:inf*2,art,tank,aa,ftr*2,bmb;20:inf*2,art,tank;22:inf*3,aa,ftr;30:inf*2;23:inf;21:inf;2:inf;36:bb,tr,dd;43:ca,tr;44:cv,ftr,dd",
3:"26:inf*5,art,tank,aa,ftr*2,bmb;25:inf*6,art*2,tank,ftr;27:inf*3,art,ftr;29:inf*3,art;28:inf*3;46:bb,tr;47:cv,ftr*2,dd,ca;45:tr,dd,sub",
4:"1:inf*3,art,tank,aa,ftr,bmb;0:inf*2,art,ftr,aa;31:inf,ftr;3:inf;24:inf*3,ftr;5:inf;4:inf;32:cv,dd,tr;35:tr,dd;33:bb,sub"};
const $=id=>document.getElementById(id);const rnd=n=>Math.floor(Math.random()*n);const d6=()=>1+rnd(6);
let S=null,net={role:'local',me:'local',conns:[]},aiTimer=null,ui={sel:-1,pick:{},bat:-1};
// ===== helpers =====
const at=l=>S.u.filter(u=>u.l===l);
const enemyOf=(o,p)=>TEAM[o]!==TEAM[p];
const fighting=u=>u.c==null&&u.k!=='aa';
const enemyUnits=(l,p)=>S.u.filter(u=>u.l===l&&u.c==null&&enemyOf(u.o,p));
const hostile=(l,p)=>enemyUnits(l,p).length>0||(!LOC[l].sea&&enemyOf(S.own[l],p));
function log(m){S.log.unshift(m);if(S.log.length>40)S.log.length=40}
function income(p){if(S.own[P[p].cap]!==p)return 0;let s=0;LOC.forEach((L,i)=>{if(!L.sea&&S.own[i]===p)s+=L.v});return s}
function addU(k,o,l){const u={i:S.nid++,k,o,l,mv:U[k].m,h:0,c:null,cm:0,am:-1,ul:0};S.u.push(u);return u}
// ===== setup =====
function newGame(ctrl,opt={}){S={limit:opt.limit||0,lvl:opt.lvl||[1,1,1,1,1],bonus:!!opt.bonus,names:opt.names||P.map(x=>x.n),paused:false,turn:1,cur:0,phase:'purchase',own:LOC.map(L=>L.own),ic:LOC.map(L=>L.ic),u:[],nid:1,ipc:[0,0,0,0,0],bought:{},placed:{},battles:[],captured:[],seaFought:[],log:[],fx:null,winner:-1,ctrl};
  for(const p in START)START[p].split(';').forEach(seg=>{const[l,list]=seg.split(':');list.split(',').forEach(it=>{const[k,n]=it.split('*');for(let i=0;i<(+n||1);i++)addU(k,+p,+l)})});
  // fighters starting on carriers stay there
  for(let p=0;p<5;p++)S.ipc[p]=income(p);log('World War begins. Soviet Union moves first.');startTurn()}
function startTurn(){const p=S.cur;S.phase='purchase';S.bought={};S.placed={};S.battles=[];S.captured=[];S.seaFought=[];
  S.u.forEach(u=>{if(u.o===p){u.mv=U[u.k].m;u.cm=0;u.am=-1;u.ul=0}});log(`— ${P[p].n} (turn ${S.turn}) has ${S.ipc[p]} IPC.`)}
function alive(p){return S.own.some(o=>o===p)||S.u.some(u=>u.o===p)}
// ===== movement =====
function bfs(u,to){const p=u.o,t=U[u.k].t,from=u.l;if(from===to)return -1;const dist=new Map([[from,0]]),q=[from];
  while(q.length){const x=q.shift(),d=dist.get(x);if(d>=u.mv)continue;for(const y of ADJ[x]){if(dist.has(y))continue;const L=LOC[y];
    if(t==='L'&&L.sea)continue;if(t==='S'&&!L.sea)continue;if(y===to)return d+1;let pass=true;
    if(t==='L')pass=!enemyOf(S.own[y],p)&&!enemyUnits(y,p).length;
    if(t==='S')pass=!enemyUnits(y,p).some(e=>u.k==='sub'?e.k==='dd':!['sub','tr'].includes(e.k));
    if(pass){dist.set(y,d+1);q.push(y)}}}return -1}
function carrierRoom(l,p){const cv=S.u.filter(u=>u.l===l&&u.k==='cv'&&!enemyOf(u.o,p)).length*2,f=S.u.filter(u=>u.l===l&&u.k==='ftr'&&!enemyOf(u.o,p)).length;return cv-f}
function cargoOf(tr){return S.u.filter(u=>u.c===tr.i)}
function trRoom(tr,k){const cg=cargoOf(tr);if(cg.length>=2)return false;if(cg.length===1&&k!=='inf'&&cg[0].k!=='inf')return false;return true}
function canMove(u,to){const p=S.cur,ph=S.phase,L=LOC[to],t=U[u.k].t;if(u.o!==p||t==='X')return null;const H=hostile(to,p);
  if(ph!=='combat'&&ph!=='noncombat')return null;if(ph==='noncombat'&&u.cm&&t!=='A')return null;
  if(u.c!=null){const tr=S.u.find(x=>x.i===u.c);if(!tr)return null;if(L.sea||!ADJ[u.l].has(to))return null;
    if(H){if(ph!=='combat'||u.k==='aa'||enemyUnits(u.l,p).some(e=>e.k!=='sub'))return null;return{kind:'unload',tr,amph:true}}
    if(ph!=='noncombat')return null;return{kind:'unload',tr}}
  if(t==='L'&&L.sea){if(!ADJ[u.l].has(to)||u.mv<1||u.cm)return null;const tr=S.u.find(x=>x.l===to&&x.k==='tr'&&x.o===p&&!x.ul&&trRoom(x,u.k));return tr?{kind:'load',tr}:null}
  if(t==='L'&&u.k==='aa'&&H)return null;
  if(ph==='noncombat'&&H)return null;
  const d=bfs(u,to);if(d<0||d>u.mv)return null;
  if(t==='A'&&ph==='noncombat'){if(L.sea){if(u.k!=='ftr'||carrierRoom(to,p)<1)return null}else if(enemyOf(S.own[to],p)||S.captured.includes(to))return null}
  if(t==='S'&&u.k==='tr'&&H&&!enemyUnits(to,p).length)return null;
  return{kind:'move',d,H}}
function doMove(u,to,r){const from=u.l;
  if(r.kind==='load'){u.l=to;u.c=r.tr.i;u.mv=0;return}
  if(r.kind==='unload'){u.l=to;u.c=null;u.mv=0;r.tr.ul=1;r.tr.mv=0;if(r.amph){u.cm=1;u.am=from}return}
  u.mv-=r.d;u.l=to;if(r.H&&S.phase==='combat')u.cm=1;if(u.k==='tr')cargoOf(u).forEach(c=>c.l=to)}
function moveSel(from,to,pick){let n=0;const kinds=[];
  for(const key in pick){let want=pick[key];const cargo=key.endsWith('*'),k=key.replace('*','');
    const cand=S.u.filter(u=>u.l===from&&u.o===S.cur&&u.k===k&&(cargo?u.c!=null:u.c==null)).sort((a,b)=>b.mv-a.mv);
    for(const u of cand){if(want<=0)break;const r=canMove(u,to);if(r){doMove(u,to,r);want--;n++;kinds.push(k)}}}
  if(n){S.fx={k:Math.random(),type:'move',from,to,kinds:[...new Set(kinds)],o:S.cur};log(`${P[S.cur].n} moved ${n} unit(s) ${LOC[from].n} → ${LOC[to].n}.`)}return n}
// ===== combat =====
function findBattles(){const p=S.cur,B=[];LOC.forEach((L,l)=>{const mine=S.u.filter(u=>u.l===l&&u.o===p&&u.c==null);if(!mine.length)return;
  if(enemyUnits(l,p).length)B.push(l);else if(!L.sea&&enemyOf(S.own[l],p)){if(mine.some(u=>U[u.k].t==='L'))capture(l,p)}});
  S.battles=B.sort((a,b)=>LOC[b].sea-LOC[a].sea);S.seaFought=B.filter(l=>LOC[l].sea);S.round={}}
function capture(l,p){const prev=S.own[l],orig=LOC[l].own;let nw=p;if(orig!==p&&!enemyOf(orig,p)&&S.own[P[orig].cap]===orig)nw=orig;
  S.own[l]=nw;S.captured.push(l);S.u.forEach(u=>{if(u.l===l&&u.k==='aa')u.o=nw});
  if(P[prev]&&P[prev].cap===l){S.ipc[p]+=S.ipc[prev];log(`${P[p].n} captured ${P[prev].n}'s capital and seized ${S.ipc[prev]} IPC!`);S.ipc[prev]=0}
  log(`${P[nw].n} controls ${LOC[l].n}.`);checkWin()}
function casualty(list,hits,filter){list=list.filter(u=>u.alive!==false);
  for(let h=0;h<hits;h++){const pool=list.filter(u=>u.alive!==false&&(!filter||filter(u)));if(!pool.length)break;
    const bb=pool.find(u=>U[u.k].hp===2&&u.h===0);if(bb){bb.h=1;continue}
    pool.sort((a,b)=>(a.k==='tr'?99:U[a.k].c)-(b.k==='tr'?99:U[b.k].c));pool[0].alive=false}}
function fightRound(l){const p=S.cur,first=!S.round[l];S.round[l]=(S.round[l]||0)+1;const sea=LOC[l].sea;
  const A=S.u.filter(u=>u.l===l&&u.o===p&&fighting(u)),D=S.u.filter(u=>u.l===l&&enemyOf(u.o,p)&&fighting(u));const ad=[],dd=[];
  if(first&&!sea){const aa=S.u.filter(u=>u.l===l&&u.k==='aa'&&enemyOf(u.o,p)).length;if(aa){let shots=aa*3;A.filter(u=>U[u.k].t==='A').forEach(u=>{if(shots-->0){const r=d6();dd.push(r);if(r===1){u.alive=false;log(`AA fire downs a ${U[u.k].n}.`)}}})}
    const amph=[...new Set(A.filter(u=>u.am>=0).map(u=>u.am))];let bh=0;amph.forEach(z=>{if(S.seaFought.includes(z))return;S.u.filter(u=>u.l===z&&u.o===p&&(u.k==='bb'||u.k==='ca')).forEach(s=>{const r=d6();ad.push(r);if(r<=U[s.k].a)bh++})});
    if(bh)log(`Shore bombardment scores ${bh} hit(s).`);casualty(D,bh)}
  const hasDD=side=>side.some(u=>u.k==='dd'&&u.alive!==false);
  // submarine surprise strikes
  let sa=0,sd=0;const aSubFirst=!hasDD(D),dSubFirst=!hasDD(A);
  A.filter(u=>u.k==='sub'&&u.alive!==false&&aSubFirst).forEach(u=>{const r=d6();ad.push(r);if(r<=2)sa++});
  D.filter(u=>u.k==='sub'&&u.alive!==false&&dSubFirst).forEach(u=>{const r=d6();dd.push(r);if(r<=1)sd++});
  casualty(D,sa,u=>U[u.k].t!=='A');casualty(A,sd,u=>U[u.k].t!=='A');
  let ah=0,dh=0;const arts=A.filter(u=>u.k==='art'&&u.alive!==false).length;let sup=arts;
  A.forEach(u=>{if(u.alive===false||(u.k==='sub'&&aSubFirst))return;let v=U[u.k].a;if(u.k==='inf'&&sup>0){v=2;sup--}if(!v)return;const r=d6();ad.push(r);if(r<=v)ah++});
  D.forEach(u=>{if(u.alive===false||(u.k==='sub'&&dSubFirst))return;const v=U[u.k].d;if(!v)return;const r=d6();dd.push(r);if(r<=v)dh++});
  const ddA=hasDD(A),ddD=hasDD(D);
  casualty(D,ah,u=>u.k!=='sub'||ddA||true);casualty(A,dh);
  const dead=S.u.filter(u=>u.alive===false);S.u.forEach(u=>{if(u.alive===false&&u.k==='tr')cargoOf(u).forEach(c=>c.alive=false)});
  const lostA=S.u.filter(u=>u.alive===false&&u.o===p).length,lostD=S.u.filter(u=>u.alive===false&&u.o!==p).length;S.u=S.u.filter(u=>u.alive!==false);
  S.fx={k:Math.random(),type:'battle',l,o:p,ad,dd,ak:[...new Set(A.map(u=>u.k))],dk:[...new Set(D.map(u=>u.k))],dOwn:D[0]?D[0].o:S.own[l],lostA,lostD};
  log(`Battle of ${LOC[l].n}, round ${S.round[l]}: attacker lost ${lostA}, defender lost ${lostD}.`);
  const A2=S.u.filter(u=>u.l===l&&u.o===p&&fighting(u)),D2=S.u.filter(u=>u.l===l&&enemyOf(u.o,p)&&fighting(u));
  const aPow=A2.some(u=>U[u.k].a>0),dPow=D2.some(u=>U[u.k].d>0);
  if(!D2.length&&A2.length){endBattle(l);if(!sea&&A2.some(u=>U[u.k].t==='L'))capture(l,p);else if(sea)log(`${P[p].n} wins at ${LOC[l].n}.`)}
  else if(!A2.length){endBattle(l);log(`Defenders hold ${LOC[l].n}.`)}
  else if(!aPow&&!dPow){endBattle(l)}
  else if(!aPow){A2.forEach(u=>u.alive=false);S.u=S.u.filter(u=>u.alive!==false);endBattle(l)}
  else if(!dPow&&D2.every(u=>u.k==='tr'||u.k==='aa')){{const dead=new Set(S.u.filter(u=>u.l===l&&enemyOf(u.o,p)&&u.k==='tr').map(u=>u.i));S.u=S.u.filter(u=>!dead.has(u.i)&&!(u.c!=null&&dead.has(u.c)))}endBattle(l);if(!sea&&A2.some(u=>U[u.k].t==='L'))capture(l,p)}}
function endBattle(l){S.battles=S.battles.filter(x=>x!==l);if(!S.battles.length&&S.phase==='battle'){S.phase='noncombat';log('All battles resolved. Noncombat move.')}}
function autoBattle(l){let g=0;while(S.battles.includes(l)&&g++<200)fightRound(l)}
function retreatTo(l){const p=S.cur;const A=S.u.filter(u=>u.l===l&&u.o===p&&u.c==null);if(A.some(u=>u.am>=0))return -1;
  const sea=LOC[l].sea;return[...ADJ[l]].find(n=>LOC[n].sea===sea&&!hostile(n,p))??-1}
function retreat(l){const to=retreatTo(l);if(to<0)return false;const p=S.cur;S.u.forEach(u=>{if(u.l===l&&u.o===p){u.l=to}});endBattle(l);log(`${P[p].n} retreats from ${LOC[l].n}.`);return true}
// ===== phases =====
function airLanding(){const p=S.cur;let lost=0;S.u.filter(u=>u.o===p&&U[u.k].t==='A').forEach(u=>{const L=LOC[u.l];let ok;
    if(L.sea)ok=u.k==='ftr'&&carrierRoom(u.l,p)>=0;else ok=!enemyOf(S.own[u.l],p)&&!S.captured.includes(u.l)||(S.captured.includes(u.l)&&!enemyOf(S.own[u.l],p)&&u.cm===0);
    if(!ok){u.alive=false;lost++}});
  // carriers overloaded: remove extra fighters
  S.u=S.u.filter(u=>u.alive!==false);if(lost)log(`${lost} aircraft could not land and were lost.`)}
function placeOK(l,k){const p=S.cur,L=LOC[l];if(!(S.bought[k]>0))return false;
  if(k==='ic')return !L.sea&&S.own[l]===p&&!S.ic[l]&&L.v>0;
  const ics=L.sea?[...ADJ[l]].filter(x=>!LOC[x].sea&&S.ic[x]&&S.own[x]===p):(S.ic[l]&&S.own[l]===p?[l]:[]);
  if(U[k].t==='S'!==L.sea)return false;return ics.some(x=>(S.placed[x]||0)<LOC[x].v)}
function place(l,k){if(!placeOK(l,k))return false;const p=S.cur,L=LOC[l];S.bought[k]--;
  if(k==='ic'){S.ic[l]=true;log(`${P[p].n} builds an Industrial Complex in ${L.n}.`);return true}
  const ics=L.sea?[...ADJ[l]].filter(x=>!LOC[x].sea&&S.ic[x]&&S.own[x]===p):[l];const x=ics.find(x=>(S.placed[x]||0)<LOC[x].v);S.placed[x]=(S.placed[x]||0)+1;
  const u=addU(k,p,l);u.mv=0;return true}
function autoPlace(){const p=S.cur;const caps=[P[p].cap,...LOC.map((_,i)=>i)];
  for(const k of BUY)while(S.bought[k]>0){let done=false;for(const l of caps){const cands=U[k].t==='S'?[...ADJ[l]].filter(z=>LOC[z].sea):[l];
      for(const z of cands)if(placeOK(z,k)){place(z,k);done=true;break}if(done)break}if(!done){S.ipc[p]+=U[k].c*S.bought[k];S.bought[k]=0}}}
function spent(){return Object.entries(S.bought).reduce((s,[k,n])=>s+U[k].c*n,0)}
function nextPhase(){const p=S.cur;
  if(S.phase==='purchase'){S.ipc[p]-=spent();S.phase='combat';S.bank=S.ipc[p]}
  else if(S.phase==='combat'){findBattles();S.phase=S.battles.length?'battle':'noncombat'}
  else if(S.phase==='battle'){S.battles.slice().forEach(autoBattle);S.phase='noncombat'}
  else if(S.phase==='noncombat'){airLanding();S.phase='mobilize'}
  else if(S.phase==='mobilize'){autoPlace();let inc=income(p);if(isAI(p)){const lv=S.lvl[p];if(lv===3)inc=Math.round(inc*1.3);else if(lv===2&&S.bonus)inc=Math.round(inc*1.15)}S.ipc[p]+=inc;log(`${P[p].n} collects ${inc} IPC.`);checkWin();if(S.phase==='over')return;
    const pc=S.cur;do{S.cur=(S.cur+1)%5}while(!alive(S.cur));if(S.cur<=pc){S.turn++;if(S.limit&&S.turn>S.limit){limitWin();return}}startTurn()}}
function limitWin(){const a=vcCount(0),x=vcCount(1);let t=a>x?0:x>a?1:-1;if(t<0){const inc=tt=>P.reduce((s,_,i)=>s+(TEAM[i]===tt?income(i):0),0);t=inc(0)>=inc(1)?0:1}S.phase='over';S.winner=t;log(`⏱ Turn limit reached: the ${TN[t]} win on victory cities (${a}–${x}).`)}
function vcCount(t){return LOC.reduce((s,L,i)=>s+(L.vc&&TEAM[S.own[i]]===t?1:0),0)}
function checkWin(){for(const t of[0,1]){const caps=P.map((x,i)=>i).filter(i=>TEAM[i]!==t).map(i=>P[i].cap);
  if(vcCount(t)>=15||caps.every(c=>TEAM[S.own[c]]===t)){S.phase='over';S.winner=t;log(`🏆 The ${TN[t]} win the war!`)}}}
// ===== actions (host-authoritative) =====
function apply(a){if(!S||S.phase==='over'||S.paused)return;const p=S.cur;
  switch(a.t){
  case'buy':if(S.phase!=='purchase')return;{const n=(S.bought[a.k]||0)+a.d;if(n<0)return;if(a.d>0&&spent()+U[a.k].c>S.ipc[p])return;S.bought[a.k]=n}break;
  case'move':if(S.phase==='combat'||S.phase==='noncombat')moveSel(a.from,a.to,a.pick);break;
  case'round':if(S.phase==='battle'&&S.battles.includes(a.l))fightRound(a.l);break;
  case'auto':if(S.phase==='battle'&&S.battles.includes(a.l))autoBattle(a.l);break;
  case'retreat':if(S.phase==='battle'&&S.battles.includes(a.l)&&S.round[a.l])retreat(a.l);break;
  case'place':if(S.phase==='mobilize')place(a.l,a.k);break;
  case'next':if(S.phase==='battle'&&S.battles.length)return;nextPhase();break}}
// ===== AI =====
const pow=(us,att)=>us.reduce((s,u)=>s+(att?U[u.k].a:U[u.k].d)*(U[u.k].hp||1),0)+(att?0:us.length*.5);
function frontier(l,p){return[...ADJ[l]].some(n=>!LOC[n].sea&&enemyOf(S.own[n],p))}
function threat(l,p){let s=0;ADJ[l].forEach(n=>{s+=pow(S.u.filter(u=>u.l===n&&enemyOf(u.o,p)&&U[u.k].t==='L'),true)});return s}
function distTo(from,pred,dom){const seen=new Set([from]),q=[[from,0]];while(q.length){const[x,d]=q.shift();if(pred(x)&&x!==from)return d;for(const y of ADJ[x]){if(seen.has(y))continue;if(dom==='S'&&!LOC[y].sea&&!pred(y))continue;if(dom==='L'&&LOC[y].sea)continue;seen.add(y);q.push([y,d+1])}}return 99}
function aiStep(){const p=S.cur;
  if(S.phase==='purchase'){const LV=S.lvl[p];let m=S.ipc[p];buyFerries(p);if(LV>=2){aiBuyHard(p);nextPhase();return}if(LV===0){while(spent()+3<=S.ipc[p])S.bought.inf=(S.bought.inf||0)+1;nextPhase();return}const coastal=[22,6,26,0,1].includes(P[p].cap)||p!==0&&p!==1;const nTr=S.u.filter(u=>u.o===p&&u.k==='tr').length;
    const buy=k=>{if(spent()+U[k].c<=S.ipc[p]){S.bought[k]=(S.bought[k]||0)+1;return true}return false};
    if((p===2||p===3||p===4)&&nTr<3)buy('tr');if(p===4&&S.turn%2===0)buy('dd');if(S.turn%3===0)buy('ftr');
    let g=0;while(g++<40){const r=Math.random();if(!(r<.55?buy('inf'):r<.8?buy('art'):buy('tank'))&&!buy('inf'))break}nextPhase();return}
  if(S.phase==='combat'){aiCombat(p);nextPhase();return}
  if(S.phase==='battle'){const l=S.battles[0];let g=0;while(S.battles.includes(l)&&g++<100){fightRound(l);if(!S.battles.includes(l))break;
      const A=S.u.filter(u=>u.l===l&&u.o===p&&fighting(u)),D=S.u.filter(u=>u.l===l&&enemyOf(u.o,p)&&fighting(u));if(pow(A,true)<pow(D,false)*(S.lvl[p]>=2?0.65:0.45)&&retreat(l))break}
    if(!S.battles.length)S.phase='noncombat';return}
  if(S.phase==='noncombat'){aiNonCombat(p);nextPhase();return}
  if(S.phase==='mobilize'){autoPlace();nextPhase();return}}
function aiCombat(p){const lands=LOC.map((_,i)=>i).filter(i=>!LOC[i].sea);
  // 1. naval: attack weak enemy fleets
  S.u.filter(u=>u.o===p&&U[u.k].t==='S'&&u.k!=='tr').forEach(u=>{if(u.cm)return;const tg=[...LOC.keys()].filter(l=>LOC[l].sea&&enemyUnits(l,p).length&&canMove(u,l));
    tg.forEach(l=>{if(u.l===l)return;const mine=S.u.filter(x=>x.l===u.l&&x.o===p&&U[x.k].t==='S'&&x.k!=='tr'&&!x.cm);if(pow(mine,true)>pow(enemyUnits(l,p),false)*1.2){const pk={};mine.forEach(x=>pk[x.k]=(pk[x.k]||0)+1);moveSel(u.l,l,pk)}})});
  // 2. land attacks
  const isCap=l=>P.some(x=>x.cap===l),late=S.turn>12;const targets=lands.filter(l=>enemyOf(S.own[l],p)).map(l=>({l,def:pow(enemyUnits(l,p),false),v:LOC[l].v+(LOC[l].vc?(late?12:5):0)+(isCap(l)?(late?20:6):0)})).sort((a,b)=>(a.def+1)/b.v-(b.def+1)/a.v||0).sort((a,b)=>(a.def+1)/a.v-(b.def+1)/b.v);
  for(const T of targets){const src=[...ADJ[T.l]].filter(n=>!LOC[n].sea&&S.own[n]!==undefined&&!enemyOf(S.own[n],p));
    const avail=[];src.forEach(n=>{const us=S.u.filter(u=>u.l===n&&u.o===p&&U[u.k].t==='L'&&u.k!=='aa'&&!u.cm&&u.c==null&&u.mv>0);const keep=n===P[p].cap?Math.ceil(us.length/2):(frontier(n,p)&&us.length>1?1:0);us.sort((a,b)=>U[b.k].a-U[a.k].a).slice(0,us.length-keep).forEach(u=>avail.push(u))});
    // tanks from 2 away
    S.u.filter(u=>u.o===p&&u.k==='tank'&&!u.cm&&u.c==null&&!avail.includes(u)&&canMove(u,T.l)).forEach(u=>{if(!frontier(u.l,p)||S.u.filter(x=>x.l===u.l&&x.o===p).length>3)avail.push(u)});
    const air=S.u.filter(u=>u.o===p&&U[u.k].t==='A'&&!u.cm&&bfs(u,T.l)>0&&bfs(u,T.l)*(S.lvl[p]>=2?1.5:2)<=u.mv);
    if(!avail.length)continue;const ap=pow(avail,true)+pow(air,true);
    const LV=S.lvl[p];let ratio=[1.9,S.turn>15?0.95:1.25,S.turn>8?0.9:1.08,S.turn>8?0.9:1.08][LV];if(LV>0){if(S.turn>20)ratio*=0.85;if(S.turn>30)ratio*=0.85;if(late&&(LOC[T.l].vc||isCap(T.l)))ratio*=0.9}if(LV===0&&Math.random()<.5)continue;if(ap>=T.def*ratio+(LV>=2?0.5:1)||(T.def===0)){avail.forEach(u=>{const r=canMove(u,T.l);if(r){doMove(u,T.l,r)}});if(T.def>0)air.forEach(u=>{const r=canMove(u,T.l);if(r)doMove(u,T.l,r)});
      S.fx={k:Math.random(),type:'move',from:avail[0].l===T.l?src[0]:avail[0].l,to:T.l,kinds:['inf','tank'],o:p}}}
  // 3. amphibious: transports with cargo or loadable
  S.u.filter(u=>u.o===p&&u.k==='tr'&&!u.ul).forEach(tr=>{
    if(!cargoOf(tr).length){const land=[...ADJ[tr.l]].find(n=>!LOC[n].sea&&S.own[n]===p&&S.u.some(x=>x.l===n&&x.o===p&&x.k==='inf'&&!x.cm&&x.mv>0));
      if(land!=null){const inf=S.u.filter(x=>x.l===land&&x.o===p&&(x.k==='inf'||x.k==='art'||x.k==='tank')&&!x.cm&&x.mv>0&&x.c==null);
        for(const x of inf){const r=canMove(x,tr.l);if(r&&r.tr===tr)doMove(x,tr.l,r);else if(r&&r.kind==='load'){x.l=tr.l;x.c=tr.i;x.mv=0}if(cargoOf(tr).length>=2)break}}}
    if(!cargoOf(tr).length)return;
    // find sea zone within reach adjacent to weak enemy land
    let best=null;[...LOC.keys()].filter(z=>LOC[z].sea&&(z===tr.l||canMove(tr,z))&&!enemyUnits(z,p).some(e=>e.k!=='sub')).forEach(z=>{ADJ[z].forEach(l=>{if(!LOC[l].sea&&enemyOf(S.own[l],p)){const d=pow(enemyUnits(l,p),false);const sc=LOC[l].v+3-d;if(!best||sc>best.sc)best={z,l,sc,d}}})});
    if(best&&best.d<=pow(cargoOf(tr),true)+3+(S.turn>15?3:0)){if(best.z!==tr.l){const r=canMove(tr,best.z);if(!r)return;doMove(tr,best.z,r)}
      cargoOf(tr).forEach(c=>{const r=canMove(c,best.l);if(r)doMove(c,best.l,r)});S.fx={k:Math.random(),type:'move',from:best.z,to:best.l,kinds:['tr','inf'],o:p}}});}
function aiNonCombat(p){if(S.lvl[p]>=2)guardCapitals(p);ferry(p);// air lands at nearest friendly land
  S.u.filter(u=>u.o===p&&U[u.k].t==='A').forEach(u=>{if(!LOC[u.l].sea&&!enemyOf(S.own[u.l],p)&&!S.captured.includes(u.l))return;if(LOC[u.l].sea&&u.k==='ftr'&&carrierRoom(u.l,p)>=0)return;
    let best=null,bd=99;LOC.forEach((L,l)=>{const r=canMove(u,l);if(r&&r.d<bd){bd=r.d;best=l}});if(best!=null)doMove(u,best,canMove(u,best))});
  // unload cargo onto friendly land
  S.u.filter(u=>u.o===p&&u.c!=null).forEach(c=>{const l=[...ADJ[c.l]].find(n=>!LOC[n].sea&&!enemyOf(S.own[n],p)&&!S.captured.includes(n));if(l!=null){const r=canMove(c,l);if(r)doMove(c,l,r)}});
  // move land units toward front
  S.u.filter(u=>u.o===p&&U[u.k].t==='L'&&u.k!=='aa'&&!u.cm&&u.c==null&&u.mv>0&&!LOC[u.l].sea).forEach(u=>{if(frontier(u.l,p))return;if(u.l===P[p].cap&&threat(u.l,p)>0)return;
    const goal=S.turn>8?(l=>!LOC[l].sea&&enemyOf(S.own[l],p)&&!!LOC[l].vc):(l=>!LOC[l].sea&&enemyOf(S.own[l],p));const g2=distTo(u.l,goal,'L')<99?goal:(l=>!LOC[l].sea&&enemyOf(S.own[l],p));const d0=distTo(u.l,g2,'L');let best=null;ADJ[u.l].forEach(n=>{if(LOC[n].sea)return;const r=canMove(u,n);if(!r)return;const d=distTo(n,g2,'L');if(d<d0&&(!best||d<best.d))best={n,d,r}});if(best)doMove(u,best.n,best.r)});
  // transports return toward home IC coast
  S.u.filter(u=>u.o===p&&u.k==='tr'&&!u.ul&&!cargoOf(u).length&&u.mv>0).forEach(tr=>{const home=[...ADJ[P[p].cap]].concat(...LOC.map((L,i)=>S.ic[i]&&S.own[i]===p?[...ADJ[i]]:[])).filter(z=>LOC[z].sea);
    for(const z of home){if(z===tr.l)break;const r=canMove(tr,z);if(r){doMove(tr,z,r);break}}})}
// ===== control / net glue =====
function isAI(p){return S.ctrl[p]==='ai'}
function canAct(){if(!S||S.phase==='over'||isAI(S.cur))return false;if(net.role==='local')return true;return S.ctrl[S.cur]===net.me}
function doAct(a){if(net.role==='client'){net.host&&net.host.open&&net.host.send({act:a});return}apply(a);commit()}
function commit(){save();broadcast();render();schedule()}
function schedule(){clearTimeout(aiTimer);if(net.role!=='client'&&S&&S.phase!=='over'&&!S.paused&&isAI(S.cur))aiTimer=setTimeout(()=>{aiStep();commit()},window.AI_DELAY??500)}
function save(){if(net.role!=='client'&&S){const d=JSON.stringify({S,online:net.role==='host',code:net.code,me:net.me,lobby:net.lobby});localStorage.setItem('it-save',d);if(net.role==='host')localStorage.setItem('it-online',d)}}
// ===== art: plastic army men =====
const SYMS={inf:'<circle cx="10" cy="3.4" r="2.4"/><path d="M6.2 2.6h7.6v1.3H6.2zM7.4 6.3h5.2l1.1 6.2h-1.6l-.5 7H9.9l-.2-5-.2 5H7.7l-.5-7H5.6z"/><path d="M13.3 7.2l4.4-4.4.9.9-4.4 4.4z"/>',
art:'<path d="M2 11.5l14-6.5 1.3 2.6-14 6z"/><circle cx="7" cy="14.5" r="4"/><path d="M8 13.5l10 4-1 1.6-10-3.6z"/>',
tank:'<path d="M1 13h18l-2 4.5H3z"/><rect x="3" y="9" width="14" height="4.2" rx="1"/><rect x="6.5" y="5.8" width="6.5" height="3.8" rx="1.8"/><rect x="12" y="6.9" width="7.8" height="1.5"/>',
aa:'<path d="M3 17h14v2H3z"/><path d="M6 17l4-7 4 7z"/><path d="M9.3 11l6-9 1.3.8-6 9zM8 11.5l-3-9 1.4-.4 3 9z"/>',
ftr:'<path d="M9 1h2l.8 6.2 7.2 3v2.2l-7.2-1-.5 5 2.6 1.6V20l-3.9-1-3.9 1v-2l2.6-1.6-.5-5-7.2 1v-2.2l7.2-3z"/>',
bmb:'<path d="M8.6 0h2.8l.6 6 8 2.6v2.6l-8-.8-.4 5.6 3 1.6V20L10 19l-4.6 1v-2.4l3-1.6-.4-5.6-8 .8V8.6l8-2.6z"/><rect x="3" y="8" width="2" height="3"/><rect x="15" y="8" width="2" height="3"/>',
bb:'<path d="M0 12h20l-2.6 5H2.6z"/><rect x="5" y="8" width="10" height="4"/><rect x="8" y="4.5" width="4" height="3.5"/><rect x="1.5" y="9.5" width="4" height="1.2"/><rect x="14.5" y="9.5" width="4.5" height="1.2"/>',
cv:'<path d="M0 11h20l-2 5H2z"/><rect x="0" y="9.4" width="20" height="1.8"/><rect x="13" y="5.5" width="3" height="4"/>',
tr:'<path d="M1 12h18l-2.4 5H3.4z"/><rect x="3" y="7.5" width="10" height="4.5" rx=".6"/><rect x="14" y="8.5" width="3" height="3.5"/>',
sub:'<path d="M1 13c0-2 3-3 9-3s9 1 9 3-3 3-9 3-9-1-9-3z"/><rect x="8" y="7" width="4" height="3.4" rx=".8"/><rect x="10.6" y="4.5" width=".9" height="3"/>',
dd:'<path d="M1 12.5h18l-3 4.5H4z"/><rect x="6" y="9" width="7" height="3.5"/><rect x="9" y="6.5" width="2" height="2.6"/><rect x="12.5" y="10" width="5" height="1"/>',
ca:'<path d="M0.5 12h19l-2.8 5H3.3z"/><rect x="5" y="8.5" width="9" height="3.5"/><rect x="8" y="5.5" width="3" height="3"/><rect x="13.5" y="9.6" width="5" height="1.1"/><rect x="1.2" y="9.6" width="4" height="1.1"/>',
ic:'<path d="M1 19V9l5 3V9l5 3V9l5 3V3h3v16z"/>',boom:'<path d="M10 0l2 6 6-3-3 6 5 2-6 2 3 6-6-3-1 4-2-5-6 3 3-6-5-1 5-3L4 1l5 4z" fill="#ffb300"/>'};
const DEFS='<defs><linearGradient id="sheen" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset=".3" stop-color="#fff" stop-opacity=".18"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>'+Object.entries(SYMS).map(([k,v])=>`<symbol id="s-${k}" viewBox="0 0 20 20">${v}</symbol>`).join('')+'</defs>';
const SPR=new Set(['inf','art','tank','aa','ftr','bmb','bb','cv','tr','sub','dd','ca','ic','kneel','bazooka','radio','grenade']);
const ownerOfColor=c=>{const i=P.findIndex(x=>x.c===c);return i<0?'g':i};
function piece(k,c,x,y,w,extra=''){if(SPR.has(k))return `<image href="sprites/${k}-${ownerOfColor(c)}.webp" x="${x}" y="${y}" width="${w}" height="${w}" ${extra} preserveAspectRatio="xMidYMax meet"/>`;return `<g ${extra}><use href="#s-${k}" x="${x}" y="${y}" width="${w}" height="${w}" fill="${c}" stroke="#000a" stroke-width=".7"/><use href="#s-${k}" x="${x}" y="${y}" width="${w}" height="${w}" fill="url(#sheen)"/></g>`}
const pieceSvg=(k,c)=>`<img src="sprites/${k}-${ownerOfColor(c)}.webp" width="40" height="40" style="flex:none;object-fit:contain" loading="lazy">`;
// ===== render =====
let zoom=+localStorage.getItem('it-zoom')||1800,fxOn=localStorage.getItem('it-fx')!=='off',fxRaf=0,fxTimer=0;
function render(){if(!S)return;const M=$('map');M.style.width=zoom+'px';let h=DEFS+'<rect width="1100" height="560" fill="#235078"/>';
  for(let a=0;a<LOC.length;a++)for(const b of ADJ[a]){if(b<a)continue;const A=LOC[a],B=LOC[b];
    if(WRAP.has(a+'-'+b)||WRAP.has(b+'-'+a)){const[e,w]=A.x>B.x?[A,B]:[B,A];h+=`<line x1="${e.x}" y1="${e.y}" x2="1100" y2="${e.y}" stroke="#9cd" stroke-width="2" stroke-dasharray="6 4"/><line x1="${w.x}" y1="${w.y}" x2="0" y2="${w.y}" stroke="#9cd" stroke-width="2" stroke-dasharray="6 4"/>`;continue}
    const both=!A.sea&&!B.sea;h+=`<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="${both?'#d8c49a':'#9cd'}" stroke-width="${both?3:1.6}" ${both?'':'stroke-dasharray="5 4"'} opacity=".8"/>`}
  LOC.forEach((L,l)=>{const cls='loc'+(l===ui.sel?' sel':'')+(S.battles.includes(l)?' bat':'');const r=L.sea?27:32;
    const fill=L.sea?'#2d6c9e':P[S.own[l]].c;h+=`<g class="${cls}" data-l="${l}"><circle class="ring" cx="${L.x}" cy="${L.y}" r="${r}" fill="${fill}" fill-opacity="${L.sea?.9:.55}" stroke="${L.sea?'#bfe3ff':'#2a1d0e'}" stroke-width="${L.sea?1.5:2.5}" ${L.sea?'stroke-dasharray="4 3"':''}/>`;
    h+=L.sea?`<text x="${L.x}" y="${L.y+r-5}" text-anchor="middle" font-size="8.5" font-style="italic" fill="#d6efff" stroke="#0a2a44" stroke-width="2" paint-order="stroke">${L.n}</text>`:`<text x="${L.x}" y="${L.y-r-3}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#fff" stroke="#000" stroke-width="2.4" paint-order="stroke">${L.n}${L.vc?' ★':''}</text>`;
    if(!L.sea)h+=`<text x="${L.x}" y="${L.y+r+10}" text-anchor="middle" font-size="9" fill="#ffe9a8" stroke="#000" stroke-width="2" paint-order="stroke">${L.v} IPC${L.vc?' · '+L.vc:''}</text>`;
    if(S.ic[l])h+=piece('ic',P[S.own[l]].c,L.x+r-16,L.y-r-4,20);
    const g={};at(l).forEach(u=>{const key=u.o+':'+u.k+(u.c!=null?'*':'');g[key]=(g[key]||0)+1});
    const keys=Object.keys(g).sort((a,b)=>BUY.indexOf(a.split(':')[1].replace('*',''))-BUY.indexOf(b.split(':')[1].replace('*','')));
    const pos=[[-28,-17],[-8,-17],[12,-17],[-28,5],[-8,5],[12,5]];
    const here=at(l);if(here.length){const rank=u=>{const t=U[u.k].t;if(L.sea)return t==='S'?100+U[u.k].c:t==='A'?50+U[u.k].c:U[u.k].c;return t==='L'&&u.k!=='aa'?100+U[u.k].a*10+U[u.k].d:t==='A'?60+U[u.k].a:u.k==='aa'?40:0};
      const top=here.slice().sort((a,b)=>rank(b)-rank(a))[0];const w=L.sea?40:36,x=L.x-w/2,y=L.y-w/2-2;h+=piece(top.k,P[top.o].c,x,y,w);
      const owners=[...new Set(here.map(u=>u.o))];const bx=L.x+15,by=L.y-14;
      h+=`<circle cx="${bx}" cy="${by}" r="9" fill="${P[top.o].c}" stroke="#fff" stroke-width="1.6"/><text x="${bx}" y="${by+3.5}" font-size="${here.length>99?7.5:here.length>9?9:10.5}" font-weight="800" fill="#fff" stroke="#000" stroke-width="1.8" paint-order="stroke" text-anchor="middle">${here.length}</text>`;
      owners.filter(o=>o!==top.o).slice(0,3).forEach((o,i)=>{h+=`<circle cx="${bx-1-i*7}" cy="${by+13}" r="3.6" fill="${P[o].c}" stroke="#fff" stroke-width="1"/>`});
      if(here.some(u=>u.c!=null))h+=`<text x="${L.x-22}" y="${L.y+18}" font-size="10">⚓</text>`}
    h+='</g>'});
  M.innerHTML=h+'<g id="fx" pointer-events="none"></g>';
  const p=S.cur;$('who').innerHTML=`<span style="color:${P[p].c}">■</span> ${P[p].n} · ${S.ipc[p]} IPC · T${S.turn} · ${S.phase}`+(net.code?` · ${net.code}`:'');
  $('fxt').textContent='🎬'+(fxOn?'':'✕');
  pauseUI();panel();if(S.fx&&S.fx.k!==render.fk){const first=render.fk===undefined;render.fk=S.fx.k;if(!first)cutscene(S.fx)}}
function row(k,c,txt,btns){return `<div class="row">${pieceSvg(k,c)}<span class="nm">${txt}</span>${btns}</div>`}
function panel(){const p=S.cur,me=canAct();let m='',list='',bar=[];
  if(S.phase==='over'){m=`🏆 The ${TN[S.winner]} win the war${S.limit&&S.turn>S.limit?' on the turn limit':''}! (Allies ${vcCount(0)} · Axis ${vcCount(1)} victory cities)`;bar=[['Main menu',()=>location.href=location.pathname]]}
  else if(!me)m=isAI(p)?`🤖 ${P[p].n} is planning (${S.phase})…`:`⏳ Waiting for ${P[p].n}…`;
  else if(S.phase==='purchase'){m=`Purchase units: ${S.ipc[p]-spent()} of ${S.ipc[p]} IPC left. Income ${income(p)}.`;
    list=BUY.map(k=>row(k,P[p].c,`<b>${U[k].n}</b> ${U[k].t==='X'?'':`A${U[k].a}/D${U[k].d}/M${U[k].m}`} · ${U[k].c} IPC ${S.bought[k]?`<b style="color:#ffde59">×${S.bought[k]}</b>`:''}`,`<span class="st"><button data-b="${k}" data-d="-1">−</button> <button data-b="${k}" data-d="1">+</button></span>`)).join('');
    bar=[['Done → Combat move',()=>doAct({t:'next'})]]}
  else if(S.phase==='combat'||S.phase==='noncombat'){const nc=S.phase==='noncombat';
    m=nc?'Noncombat: reposition, land aircraft (fighters on carriers), unload in friendly land. ':'Combat move: tap a source, choose units, tap an enemy/target. Load: tap your land, then a sea zone with your transport. Unload ⚓ cargo onto a coast = amphibious assault. ';
    if(ui.sel>=0){const g={};at(ui.sel).filter(u=>u.o===p).forEach(u=>{const key=u.k+(u.c!=null?'*':'');g[key]=g[key]||{n:0,mv:0};g[key].n++;g[key].mv=Math.max(g[key].mv,u.mv)});
      m+=`<br><b>${LOC[ui.sel].n}</b> selected – now tap a destination.`;
      list=Object.keys(g).map(key=>{if(ui.pick[key]==null)ui.pick[key]=g[key].n;const k=key.replace('*','');return row(k,P[p].c,`${U[k].n}${key.endsWith('*')?' (on transport)':''} · moves ${g[key].mv} · <b>${ui.pick[key]}/${g[key].n}</b>`,`<span class="st"><button data-p="${key}" data-d="-1">−</button> <button data-p="${key}" data-d="1" data-max="${g[key].n}">+</button></span>`)}).join('')||'<i>None of your units here.</i>'}
    bar=[['Clear',()=>{ui.sel=-1;ui.pick={};render()}],[nc?'Done → Mobilize':'Done → Combat',()=>{ui.sel=-1;doAct({t:'next'})}]]}
  else if(S.phase==='battle'){if(!S.battles.includes(ui.bat))ui.bat=S.battles[0];const l=ui.bat;
    if(l!=null){const A=S.u.filter(u=>u.l===l&&u.o===p&&fighting(u)),D=S.u.filter(u=>u.l===l&&enemyOf(u.o,p)&&fighting(u));const sum=us=>{const g={};us.forEach(u=>g[u.k]=(g[u.k]||0)+1);return Object.entries(g).map(([k,n])=>`${n} ${U[k].n}`).join(', ')||'none'};
      m=`⚔ Battle ${S.battles.indexOf(l)+1}/${S.battles.length}: <b>${LOC[l].n}</b> ${S.round[l]?`(round ${S.round[l]})`:''}<br>Attack: ${sum(A)}<br>Defend: ${sum(D)}`+(S.battles.length>1?`<br>Other battles: ${S.battles.filter(x=>x!==l).map(x=>LOC[x].n).join(', ')}`:'');
      bar=[['Roll round',()=>doAct({t:'round',l})],['Auto-resolve',()=>doAct({t:'auto',l})],['Retreat',S.round[l]&&retreatTo(l)>=0?()=>doAct({t:'retreat',l}):null]]}}
  else if(S.phase==='mobilize'){const left=BUY.filter(k=>S.bought[k]>0);m=left.length?'Mobilize: tap a territory with your factory (or an adjacent sea zone for ships), then place.':'All units placed. End your turn to collect income.';
    if(ui.sel>=0)list=left.map(k=>row(k,P[p].c,`${U[k].n} ×${S.bought[k]}`,`<button class="sm" data-pl="${k}" ${placeOK(ui.sel,k)?'':'disabled'}>Place in ${LOC[ui.sel].n}</button>`)).join('');
    else list=left.map(k=>row(k,P[p].c,`${U[k].n} ×${S.bought[k]}`,'')).join('');
    bar=[['Auto-place & end turn',()=>{ui.sel=-1;doAct({t:'next'})}]]}
  if(ui.sel>=0&&!(S.phase==='mobilize'&&me)){const g={};at(ui.sel).forEach(u=>{const key=u.o+':'+u.k+(u.c!=null?'*':'');g[key]=(g[key]||0)+1});const ks=Object.keys(g);
    if(ks.length)m+=`<div style="margin-top:4px;padding:4px;background:#0003;border-radius:8px"><b>All units in ${LOC[ui.sel].n}:</b><div style="display:flex;flex-wrap:wrap;gap:4px">${ks.map(key=>{const[o,k]=key.split(':');return `<span style="display:inline-flex;align-items:center;gap:2px;background:${P[o].c}44;border-radius:6px;padding:1px 4px">${pieceSvg(k.replace('*',''),P[o].c).replace('width="40" height="40"','width="26" height="26"')}×${g[key]}${k.endsWith('*')?'⚓':''}</span>`}).join('')}</div></div>`}
  $('msg').innerHTML=m;$('list').innerHTML=list;const B=$('bar');B.innerHTML='';bar.forEach(([t,f])=>{const b=document.createElement('button');b.textContent=t;b.disabled=!f;b.onclick=f;B.appendChild(b)});
  $('log').innerHTML=S.log.slice(0,5).join('<br>')}
$('list').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.b)doAct({t:'buy',k:b.dataset.b,d:+b.dataset.d});
  if(b.dataset.p){const k=b.dataset.p;ui.pick[k]=Math.max(0,Math.min(+(b.dataset.max||99),(ui.pick[k]||0)+(+b.dataset.d)));render()}
  if(b.dataset.pl)doAct({t:'place',l:ui.sel,k:b.dataset.pl})});
$('map').addEventListener('click',e=>{const g=e.target.closest('.loc');if(!g||!S)return;const l=+g.dataset.l;
  if(S.phase==='battle'&&S.battles.includes(l)){ui.bat=l;render();return}
  if(!canAct()){ui.sel=l===ui.sel?-1:l;render();return}
  if(S.phase==='combat'||S.phase==='noncombat'){if(ui.sel>=0&&l!==ui.sel){const pick={};for(const k in ui.pick)if(ui.pick[k]>0)pick[k]=ui.pick[k];const from=ui.sel;
      const before=JSON.stringify(S.u.map(u=>[u.l,u.c]));if(net.role==='client'){doAct({t:'move',from,to:l,pick});ui.sel=-1;ui.pick={};return}
      apply({t:'move',from,to:l,pick});if(JSON.stringify(S.u.map(u=>[u.l,u.c]))!==before){ui.sel=-1;ui.pick={};commit();return}
      flash(`Can't move those units to ${LOC[l].n}.`)}
    ui.sel=l===ui.sel?-1:l;ui.pick={};render();return}
  ui.sel=l===ui.sel?-1:l;render()});
function flash(t){$('msg').innerHTML=`<b style="color:#ff8a7a">${t}</b>`;setTimeout(()=>render(),1400)}
$('zi').onclick=()=>{zoom=Math.min(2600,zoom+300);localStorage.setItem('it-zoom',zoom);render()};$('zo').onclick=()=>{zoom=Math.max(380,zoom-300);localStorage.setItem('it-zoom',zoom);render()};
$('fxt').onclick=()=>{fxOn=!fxOn;localStorage.setItem('it-fx',fxOn?'on':'off');if(!fxOn)endFx();render()};
$('mnu').onclick=()=>{if(confirm('Open the main menu? (game is saved)'))location.href=location.pathname};
// ===== cutscenes =====
function cutscene(fx){if(!fxOn)return;endFx();
  if(fx.type==='move'){const A=LOC[fx.from],B=LOC[fx.to];if(!A||!B)return;const t0=performance.now(),D=1000,c=P[fx.o].c;
    const step=now=>{const q=Math.min(1,(now-t0)/D),g=$('fx');if(!g)return;let h='';
      fx.kinds.slice(0,3).forEach((k,i)=>{const air=U[k].t==='A',x=A.x+(B.x-A.x)*q+i*8,y=A.y+(B.y-A.y)*q-(air?40*Math.sin(Math.PI*q):0)+i*6;const ang=Math.atan2(B.y-A.y,B.x-A.x)*180/Math.PI+90;
        h+=piece(k,c,x-20,y-22,air?44:40,(B.x<A.x)?`transform="translate(${2*x},0) scale(-1,1)"`:'')});
      g.innerHTML=h;if(q<1)fxRaf=requestAnimationFrame(step);else g.innerHTML=''};fxRaf=requestAnimationFrame(step);return}
  if(fx.type==='battle'){const L=LOC[fx.l],cv=$('cutsvg'),ac=P[fx.o].c,dc=P[fx.dOwn]?P[fx.dOwn].c:'#888';$('cut').style.display='flex';const t0=performance.now(),D=2600;
    const POSES=['inf','kneel','bazooka','grenade','radio'];
    const lineup=(ks,side)=>{const out=[];const land=ks.filter(k=>U[k].t==='L'),sea=ks.filter(k=>U[k].t==='S'),air=ks.filter(k=>U[k].t==='A');
      (land.length?land:[]).forEach(k=>{const n=k==='inf'?4:k==='art'||k==='tank'?2:1;for(let i=0;i<n;i++)out.push({k:k==='inf'?POSES[(i+(side?2:0))%5]:k,row:'g'})});
      sea.forEach(k=>out.push({k,row:'s'}));air.forEach(k=>out.push({k,row:'a'}));return out.slice(0,9)};
    const A=lineup(fx.ak.length?fx.ak:['inf'],0),Dd=lineup(fx.dk.length?fx.dk:['inf'],1);
    const place=(list,left,c,q)=>{let h='',gi=0,si=0,ai=0;list.forEach(u=>{let x,y,w;
      if(u.row==='a'){w=86;x=(left?10+ai*60:300-ai*60)+(left?1:-1)*q*70;y=18+ai*14;ai++}
      else if(u.row==='s'){w=110;x=left?-6+si*40:300-si*40;y=110+si*22;si++}
      else{w=70;const col=gi%4,rw=Math.floor(gi/4);x=left?8+col*38+rw*14:322-col*38-rw*14;y=118+rw*36-(col%2)*6;gi++}
      const adv=u.row==='g'?Math.min(q*2.2,1)*28*(left?1:-1):0;x+=adv;
      h+=left?piece(u.k,c,x,y,w):piece(u.k,c,x,y,w,`transform="translate(${2*x+w},0) scale(-1,1)"`)});return h};
    const step=now=>{const q=Math.min(1,(now-t0)/D);const sea=L.sea;
      let h=DEFS+`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sea?'#7fb3d9':'#a7c4d8'}"/><stop offset="1" stop-color="${sea?'#3a78a8':'#d8cfae'}"/></linearGradient></defs><rect width="400" height="260" fill="url(#sky)"/>`+
        (sea?`<rect y="150" width="400" height="110" fill="#245f8f"/><path d="M0 150 Q50 144 100 150 T200 150 T300 150 T400 150" stroke="#cfe8ff" fill="none" opacity=".6"/>`:`<path d="M0 170 Q100 150 200 168 T400 160 V260 H0z" fill="#7d6a43"/><path d="M0 205 Q120 190 240 204 T400 198 V260 H0z" fill="#6a5936"/>`);
      h+=`<text x="200" y="20" text-anchor="middle" font-size="16" font-weight="800" fill="#fff" stroke="#0008" stroke-width="3" paint-order="stroke">Battle of ${L.n}</text>`;
      h+=place(A,true,ac,q)+place(Dd,false,dc,q);
      if(q>.35){const n=Math.min(8,fx.lostA+fx.lostD);for(let i=0;i<n;i++){const onD=i<fx.lostD,ph=((q-.35)*6+i*.37)%1,s=18+40*ph;h+=`<use href="#s-boom" x="${(onD?280+(i%3)*30:40+(i%3)*30)-s/2+20}" y="${150-(i%2)*40-s/2}" width="${s}" height="${s}" opacity="${1-ph*.6}"/>`}
        for(let i=0;i<6;i++){const tx=(q*7+i/6)%1;h+=`<line x1="${80+tx*240}" y1="${150-i*8}" x2="${92+tx*240}" y2="${150-i*8}" stroke="#ffe27a" stroke-width="2"/>`}}
      const dice=(arr,x,c)=>arr.slice(0,10).map((v,i)=>`<rect x="${x+i*19}" y="224" width="17" height="17" rx="3" fill="${c}" stroke="#0006"/><text x="${x+i*19+8.5}" y="237" text-anchor="middle" font-size="12" font-weight="800" fill="${c==='#eee'?'#222':'#fff'}">${q>.3?v:1+((now/80+i)|0)%6}</text>`).join('');
      h+=`<rect y="219" width="400" height="41" fill="#000a"/>`+dice(fx.ad,6,'#c0392b')+dice(fx.dd,206,'#eee');
      h+=`<text x="200" y="256" text-anchor="middle" font-size="11" fill="#fff">${P[fx.o].n} lost ${fx.lostA} · ${P[fx.dOwn]?P[fx.dOwn].n:'Defender'} lost ${fx.lostD}</text>`;
      cv.innerHTML=h;if(q<1)fxRaf=requestAnimationFrame(step);else fxTimer=setTimeout(endFx,350)};fxRaf=requestAnimationFrame(step)}}
function endFx(){cancelAnimationFrame(fxRaf);clearTimeout(fxTimer);$('cut').style.display='none';const g=$('fx');if(g)g.innerHTML=''}
$('skip').onclick=endFx;$('cut').addEventListener('click',e=>{if(e.target.id!=='skip')endFx()});
// ===== networking: PeerJS, host authoritative =====
function loadPeer(){return new Promise((res,rej)=>{if(window.Peer)return res();const s=document.createElement('script');s.src='https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
function broadcast(){if(net.role!=='host')return;const lob={claims:net.claims,lobby:net.lobby,code:net.code,lv:getLvl()};net.conns.forEach(c=>{if(c.open)c.send(S?{state:S}:{lob})})}
function lobbyClaim(id,p,take){if(take){if(net.claims[p]==null)net.claims[p]=id}else if(net.claims[p]===id)net.claims[p]=null;lobbyUI();broadcast()}
function myId(){let id=localStorage.getItem('it-id');if(!id){id=Math.random().toString(36).slice(2,10);localStorage.setItem('it-id',id)}return id}
async function hostRoom(name,seats,pw,code){await loadPeer();net.role='host';net.me=myId();net.code=code||Math.random().toString(36).slice(2,7).toUpperCase();
  net.lobby=net.lobby&&net.lobby.length?net.lobby:[{name,id:net.me}];net.seats=seats;net.pw=pw;if(!net.claims)net.claims=[null,null,null,null,null];
  const open=()=>{net.peer=new Peer('itheater-'+net.code);net.peer.on('open',()=>lobbyUI());net.peer.on('error',e=>{$('lobby').textContent='Network: '+e.type;if(e.type==='unavailable-id')setTimeout(()=>{net.peer.destroy();open()},4000)});
    net.peer.on('disconnected',()=>{try{net.peer.reconnect()}catch(e){}});
    net.peer.on('connection',c=>{c.on('data',d=>{
      if(d.take!=null||d.drop!=null){if(!S){lobbyClaim(c.pid,d.take??d.drop,d.take!=null)}return}
      if(d.join){c.pid=d.join;c.pname=d.name;if(!S&&!net.lobby.some(x=>x.id===d.join))net.lobby.push({name:d.name,id:d.join});net.conns=net.conns.filter(x=>x.pid!==d.join);net.conns.push(c);lobbyUI();
        if(S){claimSeat(c,d)}else broadcast();return}
      if(d.claim!=null&&S){const p=d.claim;if(S.ctrl[p]!=='ai'&&S.ctrl[p]!==net.me&&S.paused){const old=S.ctrl[p];net.conns.filter(x=>x.pid===old&&x!==c).forEach(x=>{try{x.close()}catch(e){}});S.ctrl[p]=c.pid;S.names[p]=c.pname||S.names[p];log(`${c.pname} took over ${P[p].n}.`);commit()}return}
      if(d.act&&S&&S.ctrl[S.cur]===c.pid){apply(d.act);commit()}});c.on('close',()=>{net.conns=net.conns.filter(x=>x!==c)})})};open()}
function lobbyUI(){if(S)return;const el=$('lobby');const L=net.role==='host'?{claims:net.claims||[],lobby:net.lobby||[],lv:getLvl()}:net.lob;
  if(!L){el.innerHTML=`Connected to room ${net.code}…`;return}const nameOf=id=>(L.lobby.find(x=>x.id===id)||{}).name||'?';
  el.innerHTML=`Room code <b style="font-size:24px;letter-spacing:2px">${net.code}</b><br><small>${location.href.split('?')[0]}?room=${net.code}</small><br>Players: ${L.lobby.map(x=>x.name).join(', ')}<div style="margin-top:6px">`+
   P.map((x,i)=>{const cl=L.claims[i],mine=cl===net.me;return `<div class="row" style="width:260px"><span class="nm" style="color:${x.c};font-weight:700">${x.n} <small style="color:#ccc">${TN[TEAM[i]]}</small><br><small style="color:#eee">${cl?'👤 '+nameOf(cl)+(mine?' (you)':''):'🤖 AI '+LVN[L.lv[i]]}</small></span>${cl&&!mine?'':`<button class="sm" style="width:96px" data-claim="${i}" data-take="${mine?0:1}">${mine?'Release':'Take'}</button>`}</div>`}).join('')+
   `</div><small>${net.role==='host'?'Tap Start when everyone has chosen. Open powers are AI.':'Waiting for the host to start…'}</small>`;
  if(!lobbyUI.seen){lobbyUI.seen=1;el.scrollIntoView({block:'center'})}
  if(net.role==='host')$('start').style.display='block'}
$('lobby').addEventListener('click',e=>{const b=e.target.closest('[data-claim]');if(!b)return;const p=+b.dataset.claim,take=b.dataset.take==='1';
  if(net.role==='host')lobbyClaim(net.me,p,take);else if(net.host&&net.host.open)net.host.send(take?{take:p}:{drop:p})});
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.pc!=null&&net.role==='host'&&!S){lobbyUI();broadcast()}});
async function joinRoom(code,name){await loadPeer();net.role='client';net.code=code.toUpperCase();net.me=myId();
  const connect=()=>{const c=net.peer.connect('itheater-'+net.code,{reliable:true});net.host=c;
    c.on('open',()=>{c.send({join:net.me,name});lobbyUI()});
    c.on('data',d=>{if(d.state){S=d.state;$('menu').style.display='none';render()}else if(d.lob){net.lob=d.lob;lobbyUI()}if(d.pick){net.pick=d.pick;pauseUI()}});
    c.on('close',()=>{$('msg').textContent='Connection lost – reconnecting…';setTimeout(connect,2500)})};
  net.peer=new Peer();net.peer.on('open',connect);net.peer.on('error',e=>{$('lobby').textContent='Network: '+e.type+' – retrying';if(e.type==='peer-unavailable')setTimeout(connect,3000)})}
// ===== menu =====
$('pw').innerHTML=P.map((x,i)=>`<option value="${i}">${x.n} (${TN[TEAM[i]]})</option>`).join('');
const qp=new URLSearchParams(location.search).get('room');if(qp)$('code').value=qp;
const startLocal=ctrl=>{net.role='local';newGame(ctrl,{lvl:getLvl(),bonus:$('bonus').checked,limit:+$('limit').value});$('menu').style.display='none';commit()};
$('new').onclick=()=>{startLocal(pcs().map(s=>s.value==='h'?'local':'ai'))};
$('cont').onclick=()=>{const d=JSON.parse(localStorage.getItem('it-save')||'null');if(!d)return alert('No saved game');S=d.S;$('menu').style.display='none';
  if(d.online){hostRoom('Host',5,0,d.code).then(()=>{net.me=d.me;render()})}render.fk=S.fx&&S.fx.k;render();schedule()};
$('host').onclick=()=>hostRoom($('nm').value.trim()||'Host',5,0);
$('join').onclick=()=>joinRoom($('code').value.trim(),$('nm').value.trim()||'Player');
$('start').onclick=()=>{const ctrl=P.map((_,i)=>net.claims[i]||'ai');const names=P.map((x,i)=>net.claims[i]?(net.lobby.find(l=>l.id===net.claims[i])||{}).name||x.n:x.n);newGame(ctrl,{lvl:getLvl(),bonus:$('bonus').checked,names,limit:+$('limit').value});$('menu').style.display='none';commit()};
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js');
window.__G={get S(){return S},set S(v){S=v},apply,aiStep,nextPhase,newGame,canMove,net,ui,LOC,ADJ,U,cargoOf,get fxOn(){return fxOn},endFx,income,vcCount};

// ===== Hard/Brutal AI helpers =====
function aiBuyHard(p){const cap=P[p].cap,def=pow(S.u.filter(u=>u.l===cap&&u.o===p),false),th=threat(cap,p);
  const buy=k=>{if(spent()+U[k].c<=S.ipc[p]){S.bought[k]=(S.bought[k]||0)+1;return true}return false};
  if(th>def*0.8){while(buy('inf'));return}
  const naval=p===2||p===3||p===4,nTr=S.u.filter(u=>u.o===p&&u.k==='tr').length,nWar=S.u.filter(u=>u.o===p&&['dd','ca','bb','cv','sub'].includes(u.k)).length;
  if(naval&&nTr<4)buy('tr');if(naval&&nWar<nTr+1)buy('dd');
  if(S.turn%2===1&&S.ipc[p]-spent()>25)buy('ftr');if(p===1&&S.turn%3===0)buy('bmb');
  const mix=['inf','inf','art','tank','inf','art','tank','inf'];let i=0,g=0;while(g++<60){if(!buy(mix[i++%mix.length])&&!buy('inf'))break}}
function guardCapitals(p){const cap=P[p].cap;if(S.own[cap]!==p)return;const def=pow(S.u.filter(u=>u.l===cap&&u.o===p),false),th=threat(cap,p);if(th<=def)return;
  ADJ[cap].forEach(n=>{if(LOC[n].sea)return;S.u.filter(u=>u.l===n&&u.o===p&&U[u.k].t==='L'&&!u.cm&&u.c==null&&u.mv>0&&u.k!=='aa').forEach(u=>{const r=canMove(u,cap);if(r)doMove(u,cap,r)})})}

// ===== pause / resume / export =====
function connectedIds(){return[net.me,...net.conns.filter(c=>c.open).map(c=>c.pid)]}
function claimSeat(c,d){let p=S.ctrl.indexOf(d.join);
  if(p<0){p=S.names.findIndex((n,i)=>n===d.name&&S.ctrl[i]!=='ai'&&S.ctrl[i]!==net.me);if(p>=0){const old=S.ctrl[p];net.conns.filter(x=>x.pid===old&&x!==c).forEach(x=>{try{x.close()}catch(e){}});net.conns=net.conns.filter(x=>x.pid!==old||x===c);S.ctrl=S.ctrl.map(x=>x===old?d.join:x);S.ctrl[p]=d.join;log(`${d.name} reclaimed ${P[p].n}.`)}}
  if(p<0){const hum=S.ctrl.map((x,i)=>i).filter(i=>S.ctrl[i]!=='ai'&&S.ctrl[i]!==net.me);let free=hum.filter(i=>!connectedIds().includes(S.ctrl[i]));if(!free.length)free=hum;c.send({state:S,pick:free});return}
  commit()}
function pauseUI(){const el=$('pause');if(!S||!S.paused){el.style.display='none';$('pz').style.display=net.role==='host'?'inline-block':'none';return}
  el.style.display='flex';$('pz').style.display='none';const ids=net.role==='host'?connectedIds():[];
  $('pinfo').innerHTML=`Room <b>${net.code}</b> · turn ${S.turn}<br>`+P.map((x,i)=>`${x.n}: ${S.ctrl[i]==='ai'?'🤖 AI':(S.names[i]||'?')+(net.role==='host'?(ids.includes(S.ctrl[i])?' ✅':' ⏳'):'')}`).join('<br>')+(net.role==='host'?'<br><small>Friends rejoin with the same link/code.</small>':'<br><small>Waiting for the host to resume…</small>');
  $('seatpick').innerHTML=net.role==='client'&&net.pick&&net.pick.length&&!S.ctrl.includes(net.me)?'Pick your seat:<br>'+net.pick.map(p=>`<button class="sm" data-seat="${p}">${P[p].n} (${S.names[p]})</button>`).join(' '):'';
  $('unpause').style.display=net.role==='host'?'block':'none'}
$('seatpick').addEventListener('click',e=>{const b=e.target.closest('[data-seat]');if(b&&net.host){net.host.send({claim:+b.dataset.seat});net.pick=null;$('seatpick').innerHTML='Requested…'}});
$('pz').onclick=()=>{if(net.role!=='host'||!S)return;S.paused=true;log('Game paused by host.');save();broadcast();render()};
$('unpause').onclick=()=>{S.paused=false;log('Game resumed.');commit()};
$('resume').onclick=()=>{const d=JSON.parse(localStorage.getItem('it-online')||'null');if(!d)return alert('No saved online game on this device. Import one first.');
  S=d.S;S.paused=true;net.lobby=d.lobby||[];net.me=myId();const old=d.me;S.ctrl=S.ctrl.map(x=>x===old?net.me:x);$('menu').style.display='none';
  hostRoom(S.names[S.ctrl.indexOf(net.me)]||'Host',5,0,d.code).then(()=>{render()});render.fk=S.fx&&S.fx.k;render()};
async function packSave(){const raw=localStorage.getItem('it-online')||localStorage.getItem('it-save');if(!raw)return null;
  const cs=new Blob([raw]).stream().pipeThrough(new CompressionStream('gzip'));const buf=new Uint8Array(await new Response(cs).arrayBuffer());let b='';buf.forEach(x=>b+=String.fromCharCode(x));return 'IT1:'+btoa(b)}
async function unpackSave(code){code=code.trim();if(code.startsWith('{'))return code;if(!code.startsWith('IT1:'))throw 'bad code';const bin=atob(code.slice(4)),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  return await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).text()}
$('exp').onclick=async()=>{const c=await packSave();if(!c)return alert('No save yet');const t=$('codebox');t.style.display='block';t.value=c;t.select();try{await navigator.clipboard.writeText(c)}catch(e){}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:'text/plain'}));a.download='iron-theater.itsave';a.click()};
async function importText(txt){const raw=await unpackSave(txt);const d=JSON.parse(raw);if(!d.S)throw 'bad save';localStorage.setItem('it-save',raw);if(d.online)localStorage.setItem('it-online',raw);alert('Save imported. '+(d.online?'Tap "Resume saved online game".':'Tap "Continue Saved".'))}
$('imp').onclick=()=>{const t=$('codebox');if(t.style.display==='block'&&t.value.trim()){importText(t.value).catch(e=>alert('Import failed: '+e))}else{t.style.display='block';t.value='';t.placeholder='Paste a save code, then tap Import again — or pick a file';$('impf').click()}};
$('impf').onchange=async e=>{const f=e.target.files[0];if(f)importText(await f.text()).catch(er=>alert('Import failed: '+er))};
// difficulty UI
const LVN=['Easy','Normal','Hard','Brutal'];
$('pcs').innerHTML=P.map((x,i)=>`<div class="row"><span class="nm" style="color:${x.c};font-weight:700">${x.n}<br><small style="color:#ccc">${TN[TEAM[i]]}</small></span><select data-pc="${i}" style="width:130px"><option value="h">👤 Human</option>${LVN.map((n,j)=>`<option value="${j}" ${j===1?'selected':''}>🤖 AI ${n}</option>`).join('')}</select></div>`).join('');
const pcs=()=>[...document.querySelectorAll('[data-pc]')];
function preset(){const m=$('mode').value,pw=+$('pw').value;pcs().forEach((s,i)=>{const human=m==='hot'||(m==='ai'&&i===pw);if(human)s.value='h';else if(s.value==='h')s.value='1'})}
$('mode').onchange=preset;$('pw').onchange=preset;preset();
const getLvl=()=>pcs().map(s=>s.value==='h'?1:+s.value);

window.__G.packSave=packSave;window.__G.importText=importText;

// ===== naval logistics AI (breaks island/overseas stalemates) =====
const enemyLand=p=>l=>!LOC[l].sea&&enemyOf(S.own[l],p);
function stranded(p){return S.u.filter(u=>u.o===p&&U[u.k].t==='L'&&u.c==null&&!LOC[u.l].sea&&distTo(u.l,enemyLand(p),'L')>=99).length}
function buyFerries(p){const st=stranded(p);if(st<6)return;const nTr=S.u.filter(u=>u.o===p&&u.k==='tr').length,nW=S.u.filter(u=>u.o===p&&['dd','ca','bb','sub'].includes(u.k)).length;
  const coast=LOC.some((L,i)=>S.ic[i]&&S.own[i]===p&&[...ADJ[i]].some(z=>LOC[z].sea));if(!coast)return;
  const want=Math.min(8,Math.ceil(st/2));let n=0;while(nTr+n<want&&spent()+7<=S.ipc[p]&&n<3){S.bought.tr=(S.bought.tr||0)+1;n++}
  if(nW<Math.ceil((nTr+n)/2)&&spent()+8<=S.ipc[p])S.bought.dd=(S.bought.dd||0)+1}
function seaStep(tr,goal){let best=null,bd=distTo(tr.l,goal,'S');LOC.forEach((L,z)=>{if(!L.sea||z===tr.l)return;const r=canMove(tr,z);if(!r)return;const d=distTo(z,goal,'S');if(d<bd){bd=d;best={z,r}}});return best}
function ferry(p){S.u.filter(u=>u.o===p&&u.k==='tr'&&!u.ul&&u.mv>0).forEach(tr=>{const cg=cargoOf(tr);
    if(cg.length){const vc=l=>enemyLand(p)(l)&&!!LOC[l].vc;const goal=distTo(tr.l,vc,'S')<99?vc:enemyLand(p);const st=seaStep(tr,goal);if(st)doMove(tr,st.z,st.r);return}
    const src=l=>!LOC[l].sea&&S.own[l]===p&&S.u.filter(u=>u.l===l&&u.o===p&&U[u.k].t==='L'&&u.k!=='aa'&&!u.cm&&u.mv>0).length>=3&&distTo(l,enemyLand(p),'L')>=2;
    if(![...ADJ[tr.l]].some(src)){const st=seaStep(tr,src);if(st)doMove(tr,st.z,st.r)}
    const land=[...ADJ[tr.l]].find(src);if(land==null)return;
    S.u.filter(u=>u.l===land&&u.o===p&&(u.k==='inf'||u.k==='art'||u.k==='tank')&&!u.cm&&u.mv>0&&u.c==null).sort((a,b)=>U[b.k].a-U[a.k].a).forEach(u=>{if(cargoOf(tr).length>=2)return;const r=canMove(u,tr.l);if(r&&r.kind==='load'&&r.tr===tr)doMove(u,tr.l,r);else if(r&&r.kind==='load'&&trRoom(tr,u.k)){u.l=tr.l;u.c=tr.i;u.mv=0}})})}
