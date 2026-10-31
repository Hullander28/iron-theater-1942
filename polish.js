'use strict';
if(window.NO_ROTATE||(navigator.webdriver&&!window.FORCE_ROTATE))document.documentElement.classList.add('norot');
// ===== Iron Theater 1942 – polish layer: sound, battle board, tutorial, map look, zoom gestures, turn recaps =====
// ---------- Sound (all synthesized with Web Audio; no external assets) ----------
const SFX=(()=>{let ctx=null,master=null,musicGain=null,noise=null,music=null;
  const st={vol:+(localStorage.getItem('it-vol')??0.7),mute:localStorage.getItem('it-mute')==='1',music:localStorage.getItem('it-music')!=='0'};
  function init(){if(ctx)return ctx;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ctx=new AC();master=ctx.createGain();master.connect(ctx.destination);
    musicGain=ctx.createGain();musicGain.gain.value=0;musicGain.connect(master);apply();
    const n=ctx.createBuffer(1,ctx.sampleRate*1.5,ctx.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;noise=n;return ctx}
  function apply(){if(!master)return;master.gain.setTargetAtTime(st.mute?0:st.vol,ctx.currentTime,.05);if(musicGain)musicGain.gain.setTargetAtTime(st.music&&!st.mute?0.22:0,ctx.currentTime,.4);
    localStorage.setItem('it-vol',st.vol);localStorage.setItem('it-mute',st.mute?'1':'0');localStorage.setItem('it-music',st.music?'1':'0')}
  const ok=()=>{if(!ctx||st.mute)return false;if(ctx.state==='suspended')ctx.resume();return true};
  function nz(t,dur,{f=1200,q=1,type='lowpass',g=.6,att=.002,f2}={}){const s=ctx.createBufferSource();s.buffer=noise;const bq=ctx.createBiquadFilter();bq.type=type;bq.frequency.setValueAtTime(f,t);if(f2)bq.frequency.exponentialRampToValueAtTime(f2,t+dur);bq.Q.value=q;
    const e=ctx.createGain();e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(g,t+att);e.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(bq);bq.connect(e);e.connect(master);s.start(t,Math.random()*.5);s.stop(t+dur+.05)}
  function tone(t,dur,{f=220,type='sawtooth',g=.2,f2,att=.02,lp=2000}={}){const o=ctx.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
    const bq=ctx.createBiquadFilter();bq.frequency.value=lp;const e=ctx.createGain();e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(g,t+att);e.gain.setValueAtTime(g,t+Math.max(att,dur*.6));e.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(bq);bq.connect(e);e.connect(master);o.start(t);o.stop(t+dur+.05)}
  const P={
    dice(n=6){const t=ctx.currentTime;for(let i=0;i<Math.min(14,4+n);i++)nz(t+i*.045+Math.random()*.03,.05,{f:2500+Math.random()*2500,type:'bandpass',q:3,g:.35})},
    gun(){const t=ctx.currentTime;for(let i=0;i<9;i++)nz(t+i*.09+Math.random()*.04,.09,{f:1800,f2:400,g:.45})},
    artillery(){const t=ctx.currentTime;for(let i=0;i<3;i++){nz(t+i*.35,.9,{f:400,f2:60,g:.9,att:.005});tone(t+i*.35,.5,{f:90,f2:35,type:'sine',g:.5,att:.004})}},
    boom(){const t=ctx.currentTime;nz(t,1.4,{f:900,f2:50,g:1,att:.004});tone(t,.8,{f:70,f2:28,type:'sine',g:.6,att:.003})},
    engine(dur=1.6){const t=ctx.currentTime;tone(t,dur,{f:70,f2:110,type:'sawtooth',g:.12,att:.3,lp:600});tone(t,dur,{f:74,f2:116,type:'square',g:.05,att:.3,lp:500});nz(t,dur,{f:500,g:.08,att:.3})},
    horn(){const t=ctx.currentTime;tone(t,1.3,{f:110,type:'sawtooth',g:.22,att:.08,lp:700});tone(t,1.3,{f:138.6,type:'sawtooth',g:.14,att:.08,lp:700})},
    tread(){const t=ctx.currentTime;for(let i=0;i<8;i++)nz(t+i*.11,.08,{f:300,g:.25})},
    sting(){const t=ctx.currentTime;[[0,261.6],[.18,329.6],[.36,392],[.54,523.3]].forEach(([d,f])=>{tone(t+d,.9-d*.4+.4,{f,type:'sawtooth',g:.16,att:.03,lp:2400});tone(t+d,.9,{f:f*1.005,type:'square',g:.05,att:.03,lp:1800})});
      [261.6,329.6,392,523.3].forEach(f=>tone(t+.75,1.6,{f,type:'sawtooth',g:.09,att:.05,lp:2200}));nz(t+.75,.8,{f:5000,type:'highpass',g:.15})},
    click(){const t=ctx.currentTime;tone(t,.05,{f:900,type:'triangle',g:.12,att:.002})}};
  function play(k,...a){init();if(!ok())return;try{P[k](...a)}catch(e){}}
  // ambient: slow, quiet minor pad with occasional distant drum
  function startMusic(){if(!init()||music)return;const chords=[[110,130.8,164.8],[98,123.5,146.8],[87.3,110,130.8],[98,116.5,146.8]];let i=0;
    const step=()=>{if(!ctx)return;const t=ctx.currentTime;chords[i++%4].forEach(f=>{[1,2].forEach(m=>{const o=ctx.createOscillator();o.type=m===1?'triangle':'sine';o.frequency.value=f*m;o.detune.value=(Math.random()-.5)*8;
        const e=ctx.createGain();e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(m===1?.08:.03,t+2.5);e.gain.linearRampToValueAtTime(0,t+8.4);o.connect(e);e.connect(musicGain);o.start(t);o.stop(t+8.6)})});
      if(Math.random()<.6){const s=ctx.createBufferSource();s.buffer=noise;const bq=ctx.createBiquadFilter();bq.frequency.value=160;const e=ctx.createGain();e.gain.setValueAtTime(.25,t+4);e.gain.exponentialRampToValueAtTime(.001,t+4.5);s.connect(bq);bq.connect(e);e.connect(musicGain);s.start(t+4);s.stop(t+4.6)}};
    step();music=setInterval(step,8000)}
  return{st,init,apply,play,startMusic}})();
window.SFX=SFX;
['pointerdown','touchstart','touchend','click','keydown'].forEach(ev=>document.addEventListener(ev,()=>{const c=SFX.init();if(c&&c.state!=='running')c.resume();SFX.startMusic()},{passive:true}));
function soundUI(){const el=$('sndpop');el.style.display=el.style.display==='flex'?'none':'flex';el.innerHTML=`<b>Sound</b><label>Volume <input type="range" id="vol" min="0" max="1" step="0.05" value="${SFX.st.vol}" style="width:150px"></label>
  <label><input type="checkbox" id="mute" ${SFX.st.mute?'checked':''} style="width:auto"> Mute all</label><label><input type="checkbox" id="mus" ${SFX.st.music?'checked':''} style="width:auto"> Ambient music</label><button class="sm" id="sndx">Close</button>`;
  $('vol').oninput=e=>{SFX.st.vol=+e.target.value;SFX.apply();sndBtn()};$('mute').onchange=e=>{SFX.st.mute=e.target.checked;SFX.apply();sndBtn()};$('mus').onchange=e=>{SFX.st.music=e.target.checked;SFX.init();SFX.startMusic();SFX.apply()};$('sndx').onclick=()=>el.style.display='none'}
function sndBtn(){$('snd').textContent=SFX.st.mute||SFX.st.vol==0?'🔇':'🔊'}
$('snd').onclick=soundUI;sndBtn();
let lastFxK=null,lastSndK=null;
function playFor(){if(!S)return;
  if(S.fx&&S.fx.k!==lastFxK){const first=lastFxK===null;lastFxK=S.fx.k;if(!first){const f=S.fx;
    if(f.type==='battle'){const ks=[...(f.ak||[]),...(f.dk||[])];SFX.play('dice',(f.ad||[]).length+(f.dd||[]).length);
      setTimeout(()=>{if(ks.some(k=>U[k]&&U[k].t==='A'))SFX.play('engine',1.4);if(ks.some(k=>['art','tank','bb','ca','dd'].includes(k)))SFX.play('artillery');if(ks.includes('inf'))SFX.play('gun')},350);
      if(f.lostA+f.lostD>0)setTimeout(()=>SFX.play('boom'),1100)}
    else if(f.type==='move'){const ks=f.kinds||[];if(ks.some(k=>U[k].t==='A'))SFX.play('engine');else if(ks.some(k=>U[k].t==='S'))SFX.play('horn');else if(ks.includes('tank'))SFX.play('tread')}}}
  if(S.snd&&S.snd.k!==lastSndK){const first=lastSndK===null;lastSndK=S.snd.k;if(!first&&S.snd.type==='capital')setTimeout(()=>SFX.play('sting'),900)}}
// ---------- map look: paper, ocean, terrain mottling ----------
function texURL(kind){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),im=g.createImageData(256,256),d=im.data;
  const blot=[];for(let i=0;i<26;i++)blot.push([Math.random()*256,Math.random()*256,12+Math.random()*40]);
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){const i=(y*256+x)*4;let v=Math.random()*26;
    if(kind==='paper'){blot.forEach(([bx,by,r])=>{const dx=Math.min(Math.abs(x-bx),256-Math.abs(x-bx)),dy=Math.min(Math.abs(y-by),256-Math.abs(y-by)),q=1-Math.hypot(dx,dy)/r;if(q>0)v+=q*22});
      d[i]=120;d[i+1]=88;d[i+2]=40;d[i+3]=Math.min(255,v*1.3)}
    else{const w=Math.sin((x*0.09+Math.sin(y*0.05)*2.2))*Math.sin(y*0.6);v=(w>.82?60:0)+Math.random()*14;d[i]=245;d[i+1]=250;d[i+2]=255;d[i+3]=v}}
  g.putImageData(im,0,0);return c.toDataURL('image/png')}
const _buildBase=buildBase;
buildBase=function(M){_buildBase(M);const NS='http://www.w3.org/2000/svg';
  const defs=document.createElementNS(NS,'defs');defs.innerHTML=`<pattern id="paperT" width="256" height="256" patternUnits="userSpaceOnUse"><image href="${texURL('paper')}" width="256" height="256"/></pattern><pattern id="oceanT" width="256" height="256" patternUnits="userSpaceOnUse" patternTransform="scale(.7)"><image href="${texURL('ocean')}" width="256" height="256"/></pattern>
   <linearGradient id="oceanG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9c6d1"/><stop offset=".5" stop-color="#94b7c6"/><stop offset="1" stop-color="#a5c2cc"/></linearGradient>
   <filter id="coast" x="-5%" y="-5%" width="110%" height="110%"><feMorphology operator="dilate" radius="2.2" in="SourceAlpha" result="d"/><feGaussianBlur in="d" stdDeviation="2.5" result="b"/><feFlood flood-color="#5f8797" flood-opacity=".55"/><feComposite in2="b" operator="in"/></filter>`;M.insertBefore(defs,M.firstChild);
  const water=M.querySelector('rect[fill="#9dbccb"]');if(water){water.setAttribute('fill','url(#oceanG)');const o=document.createElementNS(NS,'rect');o.setAttribute('width',MAP.W);o.setAttribute('height',MAP.H);o.setAttribute('fill','url(#oceanT)');o.setAttribute('pointer-events','none');water.after(o);
    // coastal shading halo built from land shapes (static, rendered once)
    const halo=document.createElementNS(NS,'g');halo.setAttribute('filter','url(#coast)');halo.setAttribute('pointer-events','none');halo.innerHTML=LOC.filter(L=>!L.sea).map(L=>`<path d="${L.d}" fill="#000"/>`).join('')+MAP.neutral.map(n=>`<path d="${n.d}" fill="#000"/>`).join('');o.after(halo)}
  const lab=$('labels');const paper=document.createElementNS(NS,'rect');paper.setAttribute('width',MAP.W);paper.setAttribute('height',MAP.H);paper.setAttribute('fill','url(#paperT)');paper.setAttribute('opacity','.55');paper.setAttribute('pointer-events','none');paper.style.mixBlendMode='multiply';lab.before(paper);
  updateLabels(true)};
const ABBR={'United Kingdom':'U.K.','Western Europe':'W. Europe','Southern Europe':'S. Europe','Eastern Europe':'E. Europe','Bulgaria Romania':'Bulg.-Rom.','Karelia S.S.R.':'Karelia','Kazakh S.S.R.':'Kazakh','Belorussia':'Belorus.','Trans-Jordan':'Tr.-Jordan','Anglo-Egyptian Sudan':'A.-E. Sudan','French Equatorial Africa':'Fr. Eq. Africa','French West Africa':'Fr. W. Africa','Italian East Africa':'It. E. Africa','Union of South Africa':'S. Africa','French Indochina Thailand':'Indochina','Philippine Islands':'Philippines','Hawaiian Islands':'Hawaii','Eastern United States':'Eastern U.S.','Central United States':'Central U.S.','Western United States':'Western U.S.','Evenki National Okrug':'Evenki','Buryatia S.S.R.':'Buryatia','Yakut S.S.R.':'Yakut','Soviet Far East':'Sov. Far East','Solomon Islands':'Solomons','Caroline Islands':'Carolines','Morocco Algeria':'Morocco-Alg.','Central America':'C. America','Belgian Congo':'B. Congo'};
let lastLabZ=0;
function updateLabels(force){const lab=$('labels');if(!lab)return;if(!force&&Math.abs(zoom-lastLabZ)<1)return;lastLabZ=zoom;const k=zoom/MAP.W;
  const m=Math.max(.8,Math.min(3.6,Math.pow(2400/zoom,.75)));window.PS=Math.max(.75,Math.min(2.6,Math.pow(2400/zoom,.6)));let h='';
  MAP.neutral.forEach(n=>{if(6*m*k>=6)h+=`<text x="${n.x}" y="${n.y}" class="nl" font-size="${6*m}">${n.n}</text>`});
  LOC.forEach(L=>{if(L.sea){const r=6.5*Math.min(m,1.8);if(r*k<4.5)return;h+=`<g><circle cx="${L.x}" cy="${L.y+17*m}" r="${r}" fill="#f3ead2" stroke="#3d5b6b" stroke-width=".8"/><text x="${L.x}" y="${L.y+17*m+r*.4}" class="szn" font-size="${r*1.08}">${L.num}</text></g>`;return}
    const base=Math.max(5.2,Math.min(9,Math.sqrt(L.a||400)/7));const small=Math.sqrt(L.a||400)<60;let fs=base*Math.min(m,small?1.7:3.6);const px=fs*k;
    if(px<5.2)return;let name=L.n;if((zoom<4200&&small||px<7.5)&&ABBR[name])name=ABBR[name];
    const dy=14*(window.PS||1);h+=`<text x="${L.x}" y="${L.y+dy+fs}" class="tl" font-size="${fs}">${name}${L.vc?' ★':''}</text>`;
    if(px>=7)h+=`<text x="${L.x}" y="${L.y+dy+1+fs*1.95}" class="ti" font-size="${fs*.85}">${L.v} IPC${L.vc&&px>=9?' · '+L.vc:''}</text>`});
  lab.innerHTML=h}
let zr=0;window.onZoom=()=>{cancelAnimationFrame(zr);zr=requestAnimationFrame(()=>{updateLabels();if(S)render()})};
// ---------- touch gestures: pan, pinch at fingers, double-tap, taps ----------
(()=>{const w=$('wrap'),M=$('map');let g=null,lastTap=null;
  const pt=t=>{const r=w.getBoundingClientRect();return{x:t.clientX-r.left,y:t.clientY-r.top}};
  w.addEventListener('touchstart',e=>{e.preventDefault();const ts=[...e.touches];
    if(ts.length===1&&!g){const p=pt(ts[0]);g={mode:'one',x0:p.x,y0:p.y,sl:w.scrollLeft,st:w.scrollTop,t0:Date.now(),moved:false,target:ts[0].target,cx:ts[0].clientX,cy:ts[0].clientY}}
    else if(ts.length>=2){const a=pt(ts[0]),b=pt(ts[1]);const c={x:(a.x+b.x)/2,y:(a.y+b.y)/2};g={mode:'pinch',d0:Math.hypot(a.x-b.x,a.y-b.y)||1,c0:c,z0:zoom,sl:w.scrollLeft,st:w.scrollTop,X:(w.scrollLeft+c.x)/zoom,Y:(w.scrollTop+c.y)/zoom,z:zoom,c1:c,moved:true}}},{passive:false});
  w.addEventListener('touchmove',e=>{e.preventDefault();if(!g)return;const ts=[...e.touches];
    if(g.mode==='one'&&ts.length===1){const p=pt(ts[0]);const dx=p.x-g.x0,dy=p.y-g.y0;if(!g.moved&&Math.hypot(dx,dy)<9)return;g.moved=true;w.scrollLeft=g.sl-dx;w.scrollTop=g.st-dy}
    else if(g.mode==='pinch'&&ts.length>=2){const a=pt(ts[0]),b=pt(ts[1]);const d=Math.hypot(a.x-b.x,a.y-b.y);const c={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
      const z=Math.max(fitZoom(),Math.min(8000,g.z0*d/g.d0));g.z=z;g.c1=c;const s=z/g.z0;const tx=c.x+g.sl-g.X*g.z0*s,ty=c.y+g.st-g.Y*g.z0*s;
      M.style.transformOrigin='0 0';M.style.transform=`translate(${tx}px,${ty}px) scale(${s})`;}},{passive:false});
  w.addEventListener('touchend',e=>{e.preventDefault();if(!g)return;
    if(g.mode==='pinch'){if(e.touches.length===0||e.touches.length===1){M.style.transform='';zoom=g.z;localStorage.setItem('it-zoom2',zoom);M.style.width=zoom+'px';w.scrollLeft=g.X*zoom-g.c1.x;w.scrollTop=g.Y*zoom-g.c1.y;g=null;window.onZoom()}return}
    if(g.mode==='one'&&e.touches.length===0){const tapOK=!g.moved&&Date.now()-g.t0<600;const cx=g.cx,cy=g.cy,p={x:g.x0,y:g.y0};g=null;if(!tapOK)return;
      const now=Date.now();if(lastTap&&now-lastTap.t<320&&Math.hypot(cx-lastTap.x,cy-lastTap.y)<30){lastTap=null;setZoom(zoom*2,p.x,p.y);return}
      lastTap={t:now,x:cx,y:cy};window.__touchTap=now;mapTap(document.elementFromPoint(cx,cy))}},{passive:false});
  w.addEventListener('touchcancel',()=>{M.style.transform='';g=null});
  ['gesturestart','gesturechange'].forEach(ev=>document.addEventListener(ev,e=>e.preventDefault(),{passive:false}));
  w.addEventListener('dblclick',e=>{const r=w.getBoundingClientRect();setZoom(zoom*2,e.clientX-r.left,e.clientY-r.top)})})();
function fitMap(){setZoom(fitZoom());const w=$('wrap');w.scrollLeft=0;w.scrollTop=Math.max(0,(zoom*MAP.H/MAP.W-w.clientHeight)/2)}
$('fit').onclick=fitMap;
// ---------- battle board ----------
const DIEPIPS={1:[[50,50]],2:[[25,25],[75,75]],3:[[25,25],[50,50],[75,75]],4:[[25,25],[75,25],[25,75],[75,75]],5:[[25,25],[75,25],[50,50],[25,75],[75,75]],6:[[25,22],[75,22],[25,50],[75,50],[25,78],[75,78]]};
const dieHTML=(v,hit,roll,c,i)=>`<span class="die ${hit?'hit':'miss'} ${roll?'roll':''}" style="--dc:${c};animation-delay:${(i%8)*40}ms">${DIEPIPS[v].map(([x,y])=>`<i style="left:${x}%;top:${y}%"></i>`).join('')}</span>`;
let boardK=null;
function boardHTML(l){const p=S.cur,A=S.u.filter(u=>u.l===l&&u.o===p&&fighting(u)),D=S.u.filter(u=>u.l===l&&enemyOf(u.o,p)&&fighting(u));const B=S.board&&S.board.l===l?S.board:null;
  const newRoll=B&&boardK!==B.round+':'+l+':'+B.RA.length+':'+B.RD.length;if(B)boardK=B.round+':'+l+':'+B.RA.length+':'+B.RD.length;
  const side=(us,att,rolls,col,title,owner)=>{let sup=us.filter(u=>u.k==='art').length;const cols={1:{},2:{},3:{},4:{}},zero={};
    us.forEach(u=>{let v=att?U[u.k].a:U[u.k].d;if(att&&u.k==='inf'&&sup>0){v=2;sup--}if(!v){zero[u.k]=(zero[u.k]||0)+1;return}(cols[v]=cols[v]||{})[u.k]=(cols[v][u.k]||0)+1});
    const oc=P[owner]?P[owner].c:'#888';
    return `<div class="bside"><div class="bt" style="background:${oc}">${title} · ${P[owner]?P[owner].n:''}</div><div class="bcols">${[1,2,3,4].map(v=>`<div class="bcol"><div class="bv">${v}</div><div class="bu">${Object.entries(cols[v]).map(([k,n])=>`<span class="bpc">${pieceSvg(k,oc).replace('width="40" height="40"','width="30" height="30"')}<b>${n}</b></span>`).join('')||'<span class="be">–</span>'}</div>
      <div class="bd">${(rolls||[]).filter(r=>r[0]===v).map((r,i)=>dieHTML(r[1],r[1]<=v,newRoll,col,i)).join('')}</div></div>`).join('')}</div>${Object.keys(zero).length?`<div class="bz">No ${att?'attack':'defense'}: ${Object.entries(zero).map(([k,n])=>`${n} ${U[k].n}`).join(', ')}</div>`:''}</div>`};
  const dOwn=D[0]?D[0].o:S.own[l];let h=`<div class="board"><div class="bhead">⚔ Battle of <b>${LOC[l].n}</b>${S.round[l]?` · round ${S.round[l]}`:''}${S.battles.length>1?` · ${S.battles.indexOf(l)+1}/${S.battles.length}`:''}</div>`;
  h+=side(A,true,B&&B.RA,'#c0392b','ATTACKER',p)+side(D,false,B&&B.RD,'#f2efe6','DEFENDER',dOwn);
  if(B)h+=`<div class="bres">Last roll: attacker <b>${B.ah+(B.sa||0)}</b> hit(s) · defender <b>${B.dh+(B.sd||0)}</b> hit(s)${B.lostDk&&B.lostDk.length?` · defender lost ${B.lostDk.map(k=>U[k].n).join(', ')}`:''}${B.lostAk&&B.lostAk.length?` · attacker lost ${B.lostAk.map(k=>U[k].n).join(', ')}`:''}</div>`;
  if(S.pend&&S.pend.l===l&&canAct()){const g={};A.filter(u=>u.alive!==false).forEach(u=>g[u.k]=(g[u.k]||0)+1);ui.cas=ui.cas||{};const tot=Object.values(ui.cas).reduce((a,b)=>a+b,0);
    h+=`<div class="bcas"><b>Choose ${S.pend.hits} casualt${S.pend.hits>1?'ies':'y'}</b> (${tot}/${S.pend.hits})<div>${Object.entries(g).map(([k,n])=>`<span class="cpick">${pieceSvg(k,P[p].c).replace('width="40" height="40"','width="28" height="28"')}${U[k].n} <button class="sm" data-cas="${k}" data-d="-1">−</button><b>${ui.cas[k]||0}</b>/${n}<button class="sm" data-cas="${k}" data-d="1" data-max="${n}">+</button></span>`).join('')}</div>
      <div style="display:flex;gap:6px;margin-top:4px"><button class="sm" id="casok" ${tot===S.pend.hits?'':'disabled'}>Remove chosen</button><button class="sm" id="casauto">Auto-pick (cheapest)</button></div></div>`}
  if(canAct()&&!isAI(p))h+=`<label class="bchk"><input type="checkbox" id="choosecas" ${S.choose?'checked':''}> Let me choose my casualties</label>`;
  return h+'</div>'}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cas]');if(b){const k=b.dataset.cas;ui.cas=ui.cas||{};const tot=Object.values(ui.cas).reduce((a,c)=>a+c,0)-(ui.cas[k]||0);ui.cas[k]=Math.max(0,Math.min(+(b.dataset.max||99),(ui.cas[k]||0)+(+b.dataset.d),S.pend?S.pend.hits-tot:0));render();return}
  if(e.target.id==='casok'){const pick=ui.cas;ui.cas={};doAct({t:'cas',pick})}else if(e.target.id==='casauto'){ui.cas={};doAct({t:'cas',pick:null})}});
document.addEventListener('change',e=>{if(e.target.id==='choosecas')doAct({t:'choose',v:e.target.checked})});
// ---------- tutorial ----------
const TUT=[
 {ph:'purchase',txt:'Welcome, Commander! You lead the <b>Soviet Union</b>. Each turn has six phases. First, <b>Purchase</b>: tap <b>+</b> next to Infantry twice (3 IPC each).',hl:'#list button[data-b="inf"][data-d="1"]',done:()=>(S.bought.inf||0)>=2},
 {ph:'purchase',txt:'Good. Unspent IPC carries over. Tap <b>Done → Combat move</b>.',hl:'#bar button',done:()=>S.phase!=='purchase'},
 {ph:'combat',txt:'<b>Combat move</b>: move into enemy spaces to attack. Tap <b>West Russia</b> (highlighted) to select your army there.',terr:'West Russia',done:()=>ui.sel===IDX('West Russia')},
 {ph:'combat',txt:'Use −/+ to choose units, then tap German-held <b>Belorussia</b> next door. Land units move only across shared borders – infantry 1, tanks 2.',terr:'Belorussia',done:()=>S.u.some(u=>u.o===0&&u.l===IDX('Belorussia'))},
 {ph:'combat',txt:'Ready. Tap <b>Done → Combat</b> to fight.',hl:'#bar button:last-child',done:()=>S.phase!=='combat'},
 {ph:'battle',txt:'The <b>battle board</b>: units line up by hit value. A die hits when it rolls <b>at or under</b> its column. Tap <b>Roll round</b> (or Auto-resolve). Tick “choose my casualties” to pick your own losses.',hl:'#bar button',done:()=>S.phase!=='battle'},
 {ph:'noncombat',txt:'<b>Noncombat move</b>: reposition units that did not fight and land planes. Tap <b>Done → Mobilize</b> when finished.',hl:'#bar button:last-child',done:()=>S.phase!=='noncombat'},
 {ph:'mobilize',txt:'<b>Mobilize</b>: new units appear at your factories. Tap <b>Russia</b> to place them, or tap <b>Auto-place & end turn</b>.',terr:'Russia',hl:'#bar button',done:()=>S.cur!==0},
 {ph:null,txt:'<b>Income</b>: you collected IPC for every territory you hold (see the log). The AI powers now take their turns; when it is your turn again a <b>turn summary</b> shows what they did. Good luck!',final:true}];
let tutI=-1;
function tutStart(){$('tut').dataset.i='';localStorage.removeItem('it-save');tutI=0;S=null;net.role='local';const ctrl=['human','ai','ai','ai','ai'];newGame(ctrl,{lvl:[1,0,0,0,0],limit:40});S.tut=1;S.choose=false;$('menu').style.display='none';commit();setTimeout(()=>centerOn(IDX('West Russia')),50)}
function tutRender(){const el=$('tut');document.querySelectorAll('.tut-hl').forEach(x=>x.classList.remove('tut-hl'));if(!S||!S.tut||tutI<0||tutI>=TUT.length){el.style.display='none';return}
  let st=TUT[tutI];while(!st.final&&st.done()){tutI++;st=TUT[tutI]}
  el.style.display='block';if(el.dataset.i!=String(tutI)){el.dataset.i=tutI;el.innerHTML=`<div class="tstep">Guided game · step ${tutI+1}/${TUT.length}</div><div>${st.txt}</div><div style="display:flex;gap:6px;margin-top:6px">${st.final?'<button class="sm" id="tutdone">Finish tutorial</button>':'<button class="sm" id="tutskip">Skip tutorial</button>'}</div>`}
  if(st.hl&&S.cur===0){const t=document.querySelector(st.hl);t&&t.classList.add('tut-hl')}
  if(st.terr&&S.cur===0){const l=IDX(st.terr);const hl=$('hl');if(hl)hl.insertAdjacentHTML('beforeend',`<path class="tutpulse" d="${LOC[l].d}" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-width="4"/>`)}
  const end=()=>{tutI=-1;el.dataset.i='';S.tut=0;localStorage.setItem('it-tut-done','1');save();el.style.display='none';render()};const a=$('tutskip'),b=$('tutdone');if(a)a.onclick=end;if(b)b.onclick=end}
$('tutbtn').onclick=tutStart;
// ---------- turn summary ----------
let recapShown={};
function recapCheck(){if(!S||S.phase!=='purchase'||!canAct()||!S.mark||!S.hist)return;const p=S.cur,key=S.turn+':'+p+':'+(net.code||'');if(recapShown[key])return;recapShown[key]=1;
  if(S.tut&&tutI>=0&&tutI<TUT.length-1)return;
  const ev=S.hist.slice(S.mark[p]||0).filter(e=>e.p!==p&&!/^—|collects|Noncombat move|All battles resolved/.test(e.m));if(!ev.length)return;
  window.__rcN=(window.__rcN||0)+1;if(window.NO_RECAP)return;const by={};ev.forEach(e=>{(by[e.p]=by[e.p]||[]).push(e)});
  const icon=m=>/capital|win the war/i.test(m)?'🏆':/controls|blitz/.test(m)?'🚩':/Battle|hold|wins at|downs|bombard/.test(m)?'⚔':/moved/.test(m)?'➜':'•';
  const sum=es=>{const bat=es.filter(e=>/^Battle of/.test(e.m));const keep=es.filter(e=>!/^Battle of/.test(e.m));const fights={};bat.forEach(e=>{const n=e.m.match(/Battle of (.+?), round/)[1];fights[n]=(fights[n]||0)+1});
    return keep.slice(-14).map(e=>`<div>${icon(e.m)} ${e.m}</div>`).join('')+(Object.keys(fights).length?`<div>⚔ Battles: ${Object.entries(fights).map(([n,r])=>`${n} (${r} rd)`).join(', ')}</div>`:'')};
  $('recap').innerHTML=`<div class="rbox"><h3>📜 Since your last turn</h3>${Object.keys(by).map(o=>`<div class="rpow"><div class="rp" style="background:${P[o].c}">${P[o].n}</div>${sum(by[o])}</div>`).join('')}<button id="recapok">Got it</button></div>`;
  endFx();$('recap').style.display='flex';$('recapok').onclick=()=>$('recap').style.display='none'}
// ---------- render hook ----------
const _render=render;
render=function(){_render();if(!S)return;$('panel').classList.toggle('battle',S.phase==='battle');
  if(S.phase==='battle'){const l=ui.bat!=null&&S.battles.includes(ui.bat)?ui.bat:S.battles[0];if(l!=null)$('msg').innerHTML=boardHTML(l)}else boardK=null;
  if(S.phase!=='battle')ui.cas={};
  playFor();tutRender();recapCheck()};

// ---------- landscape: fullscreen + orientation lock, right rail, slide-out drawer ----------
const coarse=matchMedia('(pointer:coarse)').matches;
function goLandscape(){if(!coarse)return;try{const el=document.documentElement,rf=el.requestFullscreen||el.webkitRequestFullscreen;
  const lock=()=>{try{const p=screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape');if(p&&p.catch)p.catch(()=>{})}catch(e){}};
  if(rf&&!document.fullscreenElement){const r=rf.call(el,{navigationUI:'hide'});if(r&&r.then)r.then(lock,lock);else lock()}else lock()}catch(e){}}
document.addEventListener('pointerdown',goLandscape,{once:true,capture:true});document.addEventListener('touchend',goLandscape,{once:true,capture:true});
const LMQ=matchMedia('(orientation:landscape) and (max-height:540px)');
const SHORT=['USSR','Germany','UK','Japan','USA'];
let drawerKey=null,drawerOpen=false;
let peekMode=false;
function setDrawer(o,pk){drawerOpen=o;peekMode=!!(o&&pk);const pn=$('panel');pn.classList.toggle('open',o&&!peekMode);pn.classList.toggle('peek',peekMode);$('drw').textContent=o&&!peekMode?'✕':'📋';$('peek').querySelector('.hd').textContent=peekMode?'▲':'▼'}
function selOnly(){return S&&ui.sel>=0&&!['purchase','battle','mobilize','over'].includes(S.phase)&&!S.pend}
function peekText(){const l=ui.sel;if(!S||l<0)return'';const L=LOC[l];const o=S.own[l];const own=L.sea?'Sea zone':(o!=null&&P[o]?P[o].n:'Neutral');
  const cnt={};S.u.filter(u=>u.l===l).forEach(u=>{const k=(P[u.o]?SHORT[u.o]+' ':'')+(U[u.k]?U[u.k].n:u.k);cnt[k]=(cnt[k]||0)+1});
  const us=Object.entries(cnt).map(([k,n])=>n+'× '+k).join(', ')||'no units';
  return `<b>${L.n}</b> · <span style="color:${o!=null&&P[o]?P[o].c:'#ccc'}">${own}</span>${L.v?' · '+L.v+' IPC':''}<br><span style="opacity:.85">${us}</span>`}
function keepVisible(){if(ui.sel<0||!peekMode)return;const w=$('wrap'),L=LOC[ui.sel];if(!L)return;const r=$('map').getBoundingClientRect(),k=r.width/MAP.W;const y=r.top+L.y*k,x=r.left+L.x*k;
  if(y>innerHeight-56-24||y<8||x<8||x>w.clientWidth-8){w.scrollTop=L.y*(zoom/MAP.W)-(w.clientHeight-56)/2;w.scrollLeft=L.x*(zoom/MAP.W)-w.clientWidth/2}}
$('peek').onclick=e=>{e.stopPropagation();if(peekMode)setDrawer(true,false);else if(selOnly())setDrawer(true,true);else setDrawer(false)};
(()=>{let sy=null;const pk=$('panel');pk.addEventListener('touchstart',e=>{sy=e.touches[0].clientY},{passive:true});pk.addEventListener('touchend',e=>{if(sy==null)return;const d=e.changedTouches[0].clientY-sy;sy=null;if(d<-25&&peekMode)setDrawer(true,false);else if(d>40&&drawerOpen&&!peekMode&&selOnly()&&pk.scrollTop<=0)setDrawer(true,true)},{passive:true})})();
$('wrap').addEventListener('pointerdown',()=>{if(LMQ.matches&&drawerOpen&&!peekMode&&selOnly()){drawerKey=null;setDrawer(true,true)}},true);
$('drw').onclick=()=>{if(peekMode)setDrawer(true,false);else if(drawerOpen&&selOnly())setDrawer(true,true);else setDrawer(!drawerOpen)};
$('go').onclick=()=>{const bs=[...document.querySelectorAll('#bar button')];const b=bs[bs.length-1];if(b&&!b.disabled)b.click()};
function railUpdate(){if(!S||!LMQ.matches)return;const p=S.cur;$('who').innerHTML=`<span style="color:${P[p].c};font-size:16px">■</span><br><b>${SHORT[p]}</b><br>${S.ipc[p]} IPC<br>Turn ${S.turn}<br><i>${S.phase}</i>`;
  const bs=[...document.querySelectorAll('#bar button')];const b=bs[bs.length-1];const g=$('go');g.textContent=b?b.textContent.replace(/&.*$/,'').replace('Done → ','→ ').replace('Auto-place & end turn','End turn'):'—';g.disabled=!b||b.disabled||!canAct();
  const me=canAct();const want=me&&(['purchase','battle','mobilize'].includes(S.phase)||ui.sel>=0||!!S.pend||S.phase==='over');
  const key=[S.phase,p,ui.sel,!!S.pend,me].join(':');if(key!==drawerKey){drawerKey=key;setDrawer(want,selOnly());if(peekMode)requestAnimationFrame(keepVisible)}
  if(peekMode||drawerOpen)$('peek').querySelector('.tx').innerHTML=selOnly()?peekText():'Orders — tap ▼ to close';}
LMQ.addEventListener&&LMQ.addEventListener('change',()=>{drawerKey=null;setTimeout(()=>{window.onZoom&&onZoom();if(S)render()},120)});
const _render2=render;render=function(){_render2();railUpdate()};
