// ===== Accounts & stats (Supabase) — guest play always works =====
(function(){
const SB_URL='https://iwyckyiuoedgbnxknzjk.supabase.co',SB_KEY='sb_publishable_f8G6BI43nblKDUOrMIIFGQ_dqG_Upl3',SB_JS='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const A={sb:null,user:null,name:null,ready:null,dbMissing:false};window.__A=A;
const NODB='Accounts aren’t set up on the server yet (the owner still needs to finish the Supabase setup). You can still play as a guest.';
const isMissing=e=>!!e&&(/PGRST20[25]|42P01|42883/.test(e.code||'')||/does not exist|schema cache|Could not find|Invalid API key|No API key/i.test(e.message||''));
function load(){if(A.ready)return A.ready;A.ready=new Promise((res,rej)=>{if(window.supabase)return res();const s=document.createElement('script');s.src=SB_JS;s.crossOrigin='anonymous';s.onload=res;s.onerror=()=>{A.ready=null;rej(new Error('offline'))};document.head.appendChild(s)}).then(()=>{
  A.sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,storageKey:'it-sb-auth'}});
  A.sb.auth.onAuthStateChange((_e,s)=>setUser(s&&s.user));return A.sb.auth.getSession().then(({data})=>setUser(data.session&&data.session.user))});return A.ready}
async function setUser(u){A.user=u||null;if(u){localStorage.setItem('it-uid',u.id);A.name=(u.user_metadata&&u.user_metadata.username)||u.email.split('@')[0];
    try{const{data,error}=await A.sb.from('profiles').select('username').eq('id',u.id).maybeSingle();if(error&&isMissing(error))A.dbMissing=true;else if(data)A.name=data.username}catch(e){}
    if($('nm')&&!$('nm').value)$('nm').value=A.name;flush()}
  else localStorage.removeItem('it-uid');bar()}
function bar(){const el=$('acctbar');if(!el)return;el.innerHTML=A.user?`👤 Signed in as <b>${esc(A.name)}</b> <button class="sm" id="a-out">Sign out</button>`:`<small>Playing as guest · stats not saved</small> <button class="sm" id="a-in">Sign in / Sign up</button>`;
  if(A.dbMissing)el.innerHTML+=`<br><small style="color:#f99">${NODB}</small>`;
  const o=$('a-out'),i=$('a-in');if(o)o.onclick=async()=>{await A.sb.auth.signOut();setUser(null)};if(i)i.onclick=()=>authForm('in')}
function modal(html){let m=$('acct');if(!m){m=document.createElement('div');m.id='acct';m.style.cssText='position:fixed;inset:0;z-index:50;background:#0b1219f0;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:16px';document.body.appendChild(m)}
  m.innerHTML=`<div style="background:#1d2c3a;border:1px solid #e6b43c;border-radius:12px;padding:14px;max-width:440px;width:100%;color:#f1e8d4;font-size:14px;position:relative"><button id="a-x" class="sm" style="position:absolute;right:8px;top:8px;width:auto">✕</button>${html}</div>`;m.style.display='flex';$('a-x').onclick=()=>m.style.display='none';return m}
function closeModal(){const m=$('acct');if(m)m.style.display='none'}
async function need(){try{await load();return true}catch(e){modal('<h3>Accounts</h3>You’re offline, so accounts and stats aren’t available right now. Guest play still works.');return false}}
async function authForm(mode){if(!await need())return;const up=mode==='up';
  modal(`<h3 style="margin-top:0">${up?'Create account':'Sign in'}</h3>${up?'<input id="a-u" placeholder="Username (2–20 letters)" maxlength="20" autocomplete="username"><br><br>':''}<input id="a-e" type="email" placeholder="Email" autocomplete="email"><br><br><input id="a-p" type="password" placeholder="Password (6+ chars)" autocomplete="${up?'new':'current'}-password"><br><br>
  <button id="a-go">${up?'Sign up':'Sign in'}</button> <div id="a-msg" style="margin:8px 0;color:#fc8"></div><small>${up?'Have an account? <a href="#" id="a-sw" style="color:#e6b43c">Sign in</a>':'New here? <a href="#" id="a-sw" style="color:#e6b43c">Create an account</a>'}</small>`);
  $('a-sw').onclick=e=>{e.preventDefault();authForm(up?'in':'up')};
  $('a-go').onclick=async()=>{const msg=t=>$('a-msg').textContent=t,email=$('a-e').value.trim(),pw=$('a-p').value;if(!email||pw.length<6)return msg('Enter an email and a password of 6+ characters.');msg('Working…');
    try{if(up){const u=$('a-u').value.trim();if(!/^[\w .-]{2,20}$/.test(u))return msg('Username: 2–20 letters, numbers, spaces, . _ -');
        const ck=await A.sb.from('profiles').select('id').ilike('username',u).limit(1);if(ck.error&&isMissing(ck.error)){A.dbMissing=true;bar();return msg(NODB)}if(ck.data&&ck.data.length)return msg('That username is taken.');
        const{data,error}=await A.sb.auth.signUp({email,password:pw,options:{data:{username:u}}});if(error){if(isMissing(error)){A.dbMissing=true;bar();return msg(NODB)}return msg(error.message)}
        if(!data.session)return msg('Check your email to confirm your account, then sign in.');}
      else{const{error}=await A.sb.auth.signInWithPassword({email,password:pw});if(error){if(isMissing(error)){A.dbMissing=true;bar();return msg(NODB)}return msg(error.message)}}
      closeModal()}catch(e){msg('Network error – try again.')}}}
const CN=i=>(window.P&&P[i])?P[i].n:'#'+i;
async function stats(){if(!await need())return;if(!A.user){modal('<h3>📊 Stats</h3>Sign in to track your games, wins and favorite country.<br><br><button id="a-g">Sign in / Sign up</button>');$('a-g').onclick=()=>authForm('in');return}
  modal('<h3>📊 Your stats</h3>Loading…');const[s,h]=await Promise.all([A.sb.rpc('player_stats',{p_uid:A.user.id}),A.sb.rpc('game_history',{p_uid:A.user.id,p_limit:20})]);
  if(s.error||h.error){const e=s.error||h.error;if(isMissing(e)){A.dbMissing=true;bar()}return modal('<h3>📊 Your stats</h3>'+(isMissing(e)?NODB:'Couldn’t load stats: '+esc(e.message)))}
  const r=(s.data&&s.data[0])||{games:0,wins:0,losses:0,wins_by_country:{}},wb=r.wins_by_country||{};
  modal(`<h3 style="margin-top:0">📊 ${esc(A.name)}</h3><div style="display:flex;gap:12px;flex-wrap:wrap"><div><b style="font-size:22px">${r.games}</b><br>Games</div><div><b style="font-size:22px;color:#7d7">${r.wins}</b><br>Wins</div><div><b style="font-size:22px;color:#f88">${r.losses}</b><br>Losses</div><div><b style="font-size:22px">${r.games?Math.round(100*r.wins/r.games):0}%</b><br>Win rate</div></div>
   <p>Favorite country: <b>${r.fav_country!=null?CN(r.fav_country):'—'}</b></p><b>Wins by country</b><br>${[0,1,2,3,4].map(i=>`${CN(i)}: ${wb[i]||0}`).join(' · ')}
   <h4>Recent games</h4>${(h.data||[]).length?h.data.map(g=>`<div style="border-top:1px solid #345;padding:4px 0">${g.won?'🏆 Win':'✖ Loss'} · ${g.countries.map(CN).join(', ')} · ${g.turns||'?'} turns · ${new Date(g.created_at).toLocaleDateString()}<br><small>${esc(g.players)}${g.room?' · room '+esc(g.room):''}</small></div>`).join(''):'<small>No games recorded yet. Finish a game while signed in.</small>'}`)}
async function board(){if(!await need())return;if(!A.user){modal('<h3>🏆 Leaderboard</h3>Sign in to see your group’s leaderboard.<br><br><button id="a-g">Sign in / Sign up</button>');$('a-g').onclick=()=>authForm('in');return}
  modal('<h3>🏆 Leaderboard</h3>Loading…');const{data,error}=await A.sb.rpc('player_stats',{p_uid:null});
  if(error){if(isMissing(error)){A.dbMissing=true;bar()}return modal('<h3>🏆 Leaderboard</h3>'+(isMissing(error)?NODB:'Couldn’t load: '+esc(error.message)))}
  modal(`<h3 style="margin-top:0">🏆 Leaderboard</h3><table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="color:#e6b43c"><th align=left>#</th><th align=left>Player</th><th>W</th><th>L</th><th>Games</th><th>Fav</th></tr>${(data||[]).map((r,i)=>`<tr style="border-top:1px solid #345${r.user_id===A.user.id?';background:#2a3f2a':''}"><td>${i+1}</td><td>${esc(r.username)}</td><td align=center>${r.wins}</td><td align=center>${r.losses}</td><td align=center>${r.games}</td><td align=center>${r.fav_country!=null?CN(r.fav_country):'—'}</td></tr>`).join('')}</table>`)}
// ---- recording finished games (host / local device only) ----
function pend(){try{return JSON.parse(localStorage.getItem('it-pending')||'[]')}catch(e){return[]}}
function recd(){try{return JSON.parse(localStorage.getItem('it-recorded')||'[]')}catch(e){return[]}}
async function flush(){if(!A.user||A.dbMissing)return;const q=pend();if(!q.length)return;const left=[];
  for(const g of q){if(g.host!==A.user.id){continue}try{const{error}=await A.sb.rpc('record_game',g.args);if(error){if(isMissing(error)){A.dbMissing=true;bar();left.push(g)}else console.warn('record_game',error.message)}else{const r=recd();r.push(g.args.p_gid);localStorage.setItem('it-recorded',JSON.stringify(r.slice(-200)))}}catch(e){left.push(g)}}
  localStorage.setItem('it-pending',JSON.stringify(left))}
function check(){const G=window.__G;if(!G)return;const S=G.S,net=G.net;if(!S||S.phase!=='over'||S.winner<0||net.role==='client')return;
  const me=localStorage.getItem('it-uid');if(!me||!UUID.test(me))return;if(!S.gid)S.gid='g'+Date.now().toString(36);
  if(recd().includes(S.gid)||pend().some(g=>g.args.p_gid===S.gid))return;
  let players;const online=net.role==='host';
  if(online)players=S.ctrl.map((id,i)=>({uid:id,country:i,won:TEAM[i]===S.winner})).filter(x=>UUID.test(x.uid));
  else{const seats=S.ctrl.map((c,i)=>c==='local'?i:-1).filter(i=>i>=0);if(!seats.length||new Set(seats.map(i=>TEAM[i])).size>1)return;players=seats.map(i=>({uid:me,country:i,won:TEAM[i]===S.winner}))}
  if(!players.some(x=>x.uid===me))return;
  const q=pend();q.push({host:me,args:{p_gid:S.gid,p_room:online?net.code:null,p_mode:online?'online':'local',p_winner:S.winner,p_turns:S.turn,p_players:players}});localStorage.setItem('it-pending',JSON.stringify(q));
  if(A.sb)flush();else load().catch(()=>{})}
A.check=check;A.flush=flush;
setInterval(check,2000);window.addEventListener('online',()=>{load().then(flush).catch(()=>{})});
// ---- UI hooks ----
function init(){const nm=$('nm');if(!nm||$('acctbar'))return;const box=document.createElement('div');box.innerHTML=`<hr style="width:240px"><b>Account</b><div id="acctbar" style="width:260px;text-align:center"><small>Loading account…</small></div><button id="a-stats">📊 My stats</button><button id="a-board">🏆 Leaderboard</button>`;
  box.style.cssText='display:flex;flex-direction:column;align-items:center;gap:9px';const menu=$('menu'),h1=menu.querySelector('h1');
  (h1&&h1.nextSibling?menu.insertBefore(box,h1.nextSibling.nextSibling||null):menu.appendChild(box));
  $('a-stats').onclick=stats;$('a-board').onclick=board;
  load().catch(()=>{const el=$('acctbar');if(el)el.innerHTML='<small>Offline – playing as guest. Accounts need internet.</small>'})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
