/* ============================================
   CONTENT (replace with your real material)
   ============================================ */
const ENTRIES = [
  {
    id:"letter_1",
    type:"text",
    title:"An afternoon of laughter",
    date:"2025-03-19",
    tags:["laugh","walk","us"],
    cover:"https://res.cloudinary.com/dxub5wglw/image/upload/f_auto,q_auto/v1700000000/album/cover_paper.jpg",
    text:`Do you remember that café where the spoon sounded louder than our laugh?\nI still feel how the sun paused on your hair...`
  },
  {
    id:"photo_1",
    type:"image",
    title:"Your smile at the window",
    date:"2025-04-08",
    tags:["photo","home"],
    cover:"https://res.cloudinary.com/dxub5wglw/image/upload/f_auto,q_auto/v1700000000/album/window_smile.jpg",
    src:"https://res.cloudinary.com/dxub5wglw/image/upload/f_auto,q_auto/v1700000000/album/window_smile.jpg",
    caption:"I looked at you and knew that instant deserved a frame."
  },
  {
    id:"audio_1",
    type:"audio",
    title:"Voice letter — 1",
    date:"2025-05-14",
    tags:["audio","letter"],
    cover:"https://res.cloudinary.com/dxub5wglw/image/upload/f_auto,q_auto/v1700000000/album/tape.jpg",
    src:"https://res.cloudinary.com/dul66qlpq/video/upload/v1760101534/dona_nobis_pacem___explicacion_3_rmnjay.mp3",
    notes:"Recorded on my way home; a bit of wind, but it's us."
  },
  {
    id:"video_1",
    type:"video",
    title:"Little park clip",
    date:"2025-06-02",
    tags:["video","park"],
    cover:"https://res.cloudinary.com/dxub5wglw/image/upload/f_auto,q_auto/v1700000000/album/park.jpg",
    src:"https://res.cloudinary.com/demo/video/upload/w_1280,h_720,c_fill/sample.mp4", // replace with your .mp4
    caption:"Not perfect, but it's us."
  }
];

/* ============================================
   UTILS
   ============================================ */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'});
const byNew = (a,b) => new Date(b.date) - new Date(a.date);

// Favorites
const FAVKEY = 'sophie_favs';
const getFavs = () => new Set(JSON.parse(localStorage.getItem(FAVKEY)||'[]'));
const setFavs = (set) => localStorage.setItem(FAVKEY, JSON.stringify([...set]));

// Gate (light privacy). We'll compare hash of input vs hash of the constant key.
const GATEKEY = 'sophie_gate_ok';
const SECRET_PLAIN = 'SMDD+CARM';
const HINT = 'It has a "+" and our initials.';
function hashLike(s){
  let h=0; for(let i=0;i<s.length;i++){ h=(h<<5)-h + s.charCodeAt(i); h|=0; } // 32-bit signed
  return (h>>>0).toString(16).slice(0,16);
}

// Replace newlines with <br> safely (LF/CRLF/CR)
function nl2br(text){
  return String(text).replace(/\r\n|\r|\n/g,'<br>');
}

/* ============================================
   RENDER
   ============================================ */
const grid = $('#grid');
const q = $('#q');
const countChip = $('#countChip');

function tagLabel(type){
  return type==='text' ? 'LETTER' : type==='image' ? 'MEMORY' : type==='audio' ? 'AUDIO' : 'VIDEO';
}

function cardTemplate(item){
  const favs = getFavs();
  const fav = favs.has(item.id);
  return `
    <article class="card" data-id="${item.id}" data-type="${item.type}" data-tags="${(item.tags||[]).join(',')}">
      <span class="tag">${tagLabel(item.type)}</span>
      <button class="fav" aria-pressed="${fav}" title="Mark favorite">${fav?'★':'☆'}</button>
      ${ item.type==='image' ? `<img class=\"cover\" src=\"${item.cover||item.src}\" alt=\"\">` :
          item.type==='video' ? `<img class=\"cover\" src=\"${item.cover||''}\" alt=\"\">` :
          `<img class=\"cover\" src=\"${item.cover||''}\" alt=\"\">` }
      <div class="content">
        <h3 class="title">${item.title}</h3>
        <p class="meta">${fmtDate(item.date)} • ${(item.tags||[]).join(' · ')}</p>
      </div>
    </article>`;
}

function render(list){
  grid.innerHTML = list.sort(byNew).map(cardTemplate).join('');
  countChip.textContent = `${list.length} ${list.length===1?'moment':'moments'}`;
}

function filterList(){
  const needle = (q.value||'').toLowerCase();
  const activeType = $$('.filter').find(b=>b.getAttribute('aria-pressed')==='true')?.dataset.type || 'all';
  const out = ENTRIES.filter(it=>{
    const txt = (it.title + ' ' + (it.tags||[]).join(' ') + ' ' + (it.caption||'') + ' ' + (it.text||'')).toLowerCase();
    const matchTxt = !needle || txt.includes(needle);
    const matchType = activeType==='all' || it.type===activeType;
    return matchTxt && matchType;
  });
  render(out);
}

/* ============================================
   MODAL + CONTENT TYPES
   ============================================ */
const overlay = $('#overlay');
const modalTitle = $('#modalTitle');
const modalBody = $('#modalBody');
const modalFoot = $('#modalFoot');
const favToggle = $('#favToggle');

function openModal(item){
  modalTitle.textContent = item.title;
  favToggle.setAttribute('aria-pressed', getFavs().has(item.id));
  favToggle.onclick = ()=>{ const s=getFavs(); s.has(item.id)?s.delete(item.id):s.add(item.id); setFavs(s); favToggle.setAttribute('aria-pressed', s.has(item.id)); filterList(); };

  if(item.type==='text'){
    modalBody.innerHTML = `<article class="letter"><div class="hand">${nl2br(item.text||'')}</div></article>`;
    modalFoot.innerHTML = `<span class="meta">${fmtDate(item.date)} • ${(item.tags||[]).join(' · ')}</span>`;
  }
  else if(item.type==='image'){
    modalBody.innerHTML = `<figure><img src="${item.src}" alt="${item.caption||''}"><figcaption class="meta" style="margin-top:8px">${item.caption||''}</figcaption></figure>`;
    modalFoot.innerHTML = `<span class="meta">${fmtDate(item.date)} • ${(item.tags||[]).join(' · ')}</span>`;
  }
  else if(item.type==='audio'){
    const id = 'aud_'+item.id;
    modalBody.innerHTML = `
      <div class="player" role="group" aria-label="Audio controls">
        <button class="p-btn play" aria-label="Play">▶</button>
        <div class="p-time"><span class="p-cur">0:00</span><div class="pbar"><div class="fill"></div></div><span class="p-dur">0:00</span></div>
      </div>
      <p class="meta" style="margin-top:8px">${item.notes||''}</p>
      <audio id="${id}" preload="metadata" src="${item.src}"></audio>`;
    modalFoot.innerHTML = `<a class="btn" href="${item.src}" download>Download</a>`;
    bindPlayer($('#'+id), $('.player', modalBody), item);
  }
  else if(item.type==='video'){
    modalBody.innerHTML = `
      <video controls playsinline style="width:100%;border-radius:18px;border:1px solid rgba(48,38,58,.12);box-shadow:var(--shadow)" src="${item.src}"></video>
      <p class="meta" style="margin-top:8px">${item.caption||''}</p>`;
    modalFoot.innerHTML = `<a class="btn" href="${item.src}" download>Download</a>`;
  }

  overlay.classList.add('show');
}

$('#close').addEventListener('click', ()=> overlay.classList.remove('show'));
overlay.addEventListener('click', (e)=>{ if(e.target===overlay) overlay.classList.remove('show'); });

/* ============================================
   PLAYER + STICKY MINI (audio only)
   ============================================ */
let currentAudio=null;
const mini=$('#mini');
const miniPlay=$('#miniPlay');
const miniClose=$('#miniClose');
const miniBar=$('#miniBar');
const miniProg=$('#miniProg');
const miniTitle=$('#miniTitle');

function fmt(t){if(!isFinite(t))return'0:00';t=t|0;const m=(t/60)|0,s=(t%60)|0;return m+':'+String(s).padStart(2,'0')}

function bindPlayer(audio, root, item){
  const play=$('.play', root), cur=$('.p-cur', root), dur=$('.p-dur', root), bar=$('.pbar', root), fill=$('.fill', root);
  function sync(){cur.textContent=fmt(audio.currentTime); if(isFinite(audio.duration)) dur.textContent=fmt(audio.duration); fill.style.width=(audio.duration?(audio.currentTime/audio.duration)*100:0)+'%'; play.textContent=audio.paused?'▶':'❚❚'; syncMini();}
  function seek(x){const r=bar.getBoundingClientRect(); const pct=Math.min(1,Math.max(0,(x-r.left)/r.width)); if(isFinite(audio.duration)) audio.currentTime=pct*audio.duration; sync();}
  play.addEventListener('click',()=>{ audio.paused?audio.play():audio.pause(); });
  bar.addEventListener('mousedown',e=>seek(e.clientX));
  bar.addEventListener('touchstart',e=>{seek(e.touches[0].clientX)},{passive:true});
  audio.addEventListener('timeupdate',sync); audio.addEventListener('loadedmetadata',sync); audio.addEventListener('play',()=>{ currentAudio=audio; showMini(item); sync(); }); audio.addEventListener('pause',sync); audio.addEventListener('ended',()=>{ hideMini(); });
  sync();
}

function showMini(item){ mini.classList.remove('mini--hidden'); miniTitle.textContent=item.title; syncMini(); }
function hideMini(){ if(currentAudio){ try{ currentAudio.pause(); currentAudio.currentTime=0; }catch{} } currentAudio=null; mini.classList.add('mini--hidden'); }
function syncMini(){ if(!currentAudio){ mini.classList.add('mini--hidden'); return; } const d=currentAudio.duration||0; const pct=d?(currentAudio.currentTime/d)*100:0; miniProg.style.width=pct+'%'; miniPlay.textContent = currentAudio.paused?'▶':'❚❚'; }
miniPlay.addEventListener('click',()=>{ if(!currentAudio) return; currentAudio.paused?currentAudio.play():currentAudio.pause(); syncMini(); });
miniClose.addEventListener('click', hideMini);
miniBar.addEventListener('click', e=>{ if(!currentAudio||!currentAudio.duration) return; const r=miniBar.getBoundingClientRect(); currentAudio.currentTime=((e.clientX-r.left)/r.width)*currentAudio.duration; });

/* ============================================
   SEARCH + FILTERS + TABS
   ============================================ */
q.addEventListener('input', filterList);
$$('.filter').forEach(b=> b.addEventListener('click', ()=>{ $$('.filter').forEach(x=>x.setAttribute('aria-pressed','false')); b.setAttribute('aria-pressed','true'); filterList(); }));

function syncTabs(){
  const hash = location.hash.slice(1) || 'home';
  $$('.tab').forEach(t=> t.setAttribute('aria-current', t.getAttribute('href') == '#'+hash ? 'page' : 'false'));
}
window.addEventListener('hashchange', syncTabs);

/* ============================================
   GATE (secret key)
   ============================================ */
const gate=$('#gate');
const pass=$('#pass');
const enter=$('#enter');
const hint=$('#hint');
const msg=$('#msg');

function openGateIfNeeded(){
  if(localStorage.getItem(GATEKEY)==='ok'){
    gate.hidden = true;
    gate.setAttribute('hidden','');
    return;
  }
  gate.hidden = false;
  gate.removeAttribute('hidden');
  pass.focus();
}

enter.addEventListener('click', ()=>{
  const input = pass.value.trim();
  if(!input){ msg.textContent='Type the key.'; return; }
  if(hashLike(input)===hashLike(SECRET_PLAIN)){
    localStorage.setItem(GATEKEY,'ok');
    // Hide gate robustly (attribute + style)
    gate.hidden = true;
    gate.setAttribute('hidden','');
    gate.style.display = 'none';
    pass.value=''; msg.textContent='';
  } else {
    msg.textContent='Wrong key. Try again.'; pass.select();
  }
});
hint.addEventListener('click', ()=>{ alert(HINT); });
pass.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); enter.click(); } });

/* ============================================
   SELF-TESTS (lightweight)
   ============================================ */
(function selfTests(){
  try{
    // existing tests (kept)
    console.assert(nl2br('a\nb')==='a<br>b', 'nl2br basic');
    console.assert(nl2br('a\r\nb')==='a<br>b', 'nl2br CRLF');
    console.assert(hashLike('SMDD+CARM')===hashLike('SMDD+CARM'), 'hashLike deterministic');
    console.assert(hashLike('SMDD+CARM')!==hashLike('smdd+carm'), 'hashLike case-sensitive');

    // additional tests
    console.assert(nl2br('')==='', 'nl2br empty');
    console.assert(hashLike('SMDD+CARM ')!==hashLike('SMDD+CARM'), 'hashLike whitespace matters');
    console.assert(byNew({date:'2025-01-02'},{date:'2025-01-01'})<0, 'byNew newer first');
    const fd = fmtDate('2025-11-04');
    console.assert(typeof fd==='string' && fd.includes('2025'), 'fmtDate returns readable year');
    console.assert(tagLabel('text')==='LETTER' && tagLabel('audio')==='AUDIO', 'tagLabel mapping');
  }catch(e){ console.error('Self-tests failed', e); }
})();

/* ============================================
   INIT
   ============================================ */
function init(){
  syncTabs();
  filterList();
  openGateIfNeeded();
}
document.addEventListener('DOMContentLoaded', init);
