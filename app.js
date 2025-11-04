/* ============================================
   CONTENT (replace with your real material)
   ============================================ */
const ENTRIES = [
  {
    id:"letter_grandpa",
    type:"text",
    title:"What My Grandpa Would Say About Our First Year Together",
    date:"2025-11-04",
    tags:["letter","year-one","grandpa"],
    cover:"https://res.cloudinary.com/dxub5wglw/image/upload/f_auto,q_auto/v1700000000/album/cover_paper.jpg",
    text:`What My Grandpa Would Say About Our First Year Together

My grandpa has a very particular way of celebrating good things. I think it’s a wise one.
When something good happens to someone in the family, he’s happy, of course — but his attitude is always: “I already knew that.”
He normalizes good things. He’s happy and kind, but he doesn’t overhype anything: he understands that doing things right is the only reasonable path.

And you know what, Sophie? I think something like that applies to us.

Because of course we’ve shared beautiful moments for a whole year. Of course this is a victory. We should celebrate — no doubt about it. But we should also understand something more important: this is only the beginning. The good news is only just starting to arrive.

This year we’ve been brutally limited. We’ve barely been able to be together virtually, and much less physically. It’s been frustrating, I know. There have been nights when we just wanted to be in the same place, breathing the same air.

But listen to me carefully:

• We’ve already proven that this is stronger than any obstacle — Most relationships fall apart with the kind of chaos we’ve gone through, right? Even more so if it’s long-distance… But we’ve done a damn good job.
• The best of us is a huge promise waiting to be fulfilled — The trips we’ll take together, the mornings when we wake up and won’t have to say goodbye, the decisions we’ll make, the dreams we’ll chase side by side, the small routines that will become our life… All of that is already there, waiting for us.
• We built this in “impossible mode” — If we managed to keep this alive, to make it grow, to deepen it with every limitation in the universe against us… can you imagine how unstoppable we’ll be when everything is finally on our side?

If my grandpa were here, he’d look at you with that smile of his and say: “I already knew it. Of course they were going to get here. And of course they’re going much further.”

He’s amazing. He would tell us to be patient and trust in each other’s love.

And I, Sophie, tell you this:

Take my hand and let’s continue this adventure for the rest of our lives.
Hold my hand tight — I will never let go.
I will be by your side because… that’s exactly where I want to be.

Anyway, let’s just keep going day by day — sharing life.
Trying to give each other beautiful, happy things.
That will be enough.

😘🫂❤️ (the magic emoji trident hahaha)`
  }
];

/* ============================================
   UTILS
   ============================================ */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const fmtDate = (iso) => {
  const date = new Date(iso + 'T12:00:00');
  if(Number.isNaN(date.getTime())) return iso;
  const formatted = date.toLocaleDateString('es-ES', {day:'numeric', month:'long', year:'numeric'});
  const parts = formatted.split(' de ');
  return parts.length === 3 ? `${parts[0]} de ${parts[1]} del ${parts[2]}` : formatted;
};
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

function excerpt(text, max=180){
  const clean = String(text||'').replace(/\s+/g,' ').trim();
  if(!clean) return '';
  if(clean.length <= max) return clean;
  return clean.slice(0, Math.max(0, max-3)).trimEnd() + '...';
}

/* ============================================
   RENDER
   ============================================ */
const grid = $('#grid');
const q = $('#q');
const countChip = $('#countChip');

function tagLabel(type){
  return type==='text' ? 'CARTA' : type==='image' ? 'MEMORIA' : type==='audio' ? 'AUDIO' : 'VIDEO';
}

function cardTemplate(item){
  const favs = getFavs();
  const fav = favs.has(item.id);
  const tag = `<span class="tag">${tagLabel(item.type)}</span>`;
  const favBtn = `<button class="fav" type="button" aria-pressed="${fav}" title="${fav ? 'Quitar de favoritos' : 'Marcar como favorito'}">${fav?'★':'☆'}</button>`;
  const meta = `${fmtDate(item.date)}${(item.tags && item.tags.length ? ` &bull; ${(item.tags||[]).join(' &bull; ')}` : '')}`;
  if(item.type==='text'){
    const lines = (item.text||'').split('\n').map(l=>l.trim()).filter(Boolean);
    const titleKey = item.title.trim().toLowerCase();
    const body = lines.length && lines[0].toLowerCase() === titleKey ? lines.slice(1).join(' ') : lines.join(' ');
    const preview = excerpt(body, 220);
    return `
    <article class="card card--text" data-id="${item.id}" data-type="${item.type}" data-tags="${(item.tags||[]).join(',')}">
      ${tag}
      ${favBtn}
      <div class="content">
        <h3 class="title">${item.title}</h3>
        <p class="meta">${meta}</p>
        <p class="excerpt">${preview}</p>
        <span class="cta" aria-hidden="true">Leer carta ↗</span>
      </div>
    </article>`;
  }
  return `
    <article class="card" data-id="${item.id}" data-type="${item.type}" data-tags="${(item.tags||[]).join(',')}">
      ${tag}
      ${favBtn}
      ${ item.type==='image' ? `<img class="cover" src="${item.cover||item.src}" alt="">` :
          item.type==='video' ? `<img class="cover" src="${item.cover||''}" alt="">` :
          `<img class="cover" src="${item.cover||''}" alt="">` }
      <div class="content">
        <h3 class="title">${item.title}</h3>
        <p class="meta">${meta}</p>
      </div>
    </article>`;
}
function render(list){
  grid.innerHTML = list.sort(byNew).map(cardTemplate).join('');
  countChip.textContent = `${list.length} ${list.length===1?'momento':'momentos'}`;
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

function findEntry(id){
  return ENTRIES.find(it => it.id === id);
}

grid.addEventListener('click', (event)=>{
  const favBtn = event.target.closest('.fav');
  if(favBtn){
    event.stopPropagation();
    const card = favBtn.closest('.card');
    if(!card) return;
    const id = card.dataset.id;
    const favs = getFavs();
    if(favs.has(id)){ favs.delete(id); } else { favs.add(id); }
    setFavs(favs);
    filterList();
    return;
  }
  const card = event.target.closest('.card');
  if(!card) return;
  const item = findEntry(card.dataset.id);
  if(item){
    openModal(item);
  }
});

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
  const favSet = getFavs();
  favToggle.setAttribute('aria-pressed', favSet.has(item.id));
  favToggle.onclick = ()=>{
    const s = getFavs();
    if(s.has(item.id)){
      s.delete(item.id);
    } else {
      s.add(item.id);
    }
    setFavs(s);
    favToggle.setAttribute('aria-pressed', s.has(item.id));
    filterList();
  };
  const metaInfo = `${fmtDate(item.date)}${(item.tags && item.tags.length ? ' &bull; ' + (item.tags||[]).join(' &bull; ') : '')}`;

  if(item.type==='text'){
    modalBody.innerHTML = `<article class="letter"><div class="hand">${nl2br(item.text||'')}</div></article>`;
    modalFoot.innerHTML = metaInfo ? `<span class="meta">${metaInfo}</span>` : '';
  }
  else if(item.type==='image'){
    modalBody.innerHTML = `<figure><img src="${item.src}" alt="${item.caption||''}"><figcaption class="meta" style="margin-top:8px">${item.caption||''}</figcaption></figure>`;
    modalFoot.innerHTML = metaInfo ? `<span class="meta">${metaInfo}</span>` : '';
  }
  else if(item.type==='audio'){
    const id = 'aud_'+item.id;
    modalBody.innerHTML = `
      <div class="player" role="group" aria-label="Audio controls">
        <button class="p-btn play" aria-label="Play">�-�</button>
        <div class="p-time"><span class="p-cur">0:00</span><div class="pbar"><div class="fill"></div></div><span class="p-dur">0:00</span></div>
      </div>
      <p class="meta" style="margin-top:8px">${item.notes||''}</p>
      <audio id="${id}" preload="metadata" src="${item.src}"></audio>`;
    modalFoot.innerHTML = `${metaInfo ? `<span class="meta">${metaInfo}</span>` : ''}<a class="btn" href="${item.src}" download>Descargar</a>`;
    bindPlayer($('#'+id), $('.player', modalBody), item);
  }
  else if(item.type==='video'){
    modalBody.innerHTML = `
      <video controls playsinline style="width:100%;border-radius:18px;border:1px solid rgba(48,38,58,.12);box-shadow:var(--shadow)" src="${item.src}"></video>
      <p class="meta" style="margin-top:8px">${item.caption||''}</p>`;
    modalFoot.innerHTML = `${metaInfo ? `<span class="meta">${metaInfo}</span>` : ''}<a class="btn" href="${item.src}" download>Descargar</a>`;
  }
  else{
    modalBody.innerHTML = '';
    modalFoot.innerHTML = metaInfo ? `<span class="meta">${metaInfo}</span>` : '';
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
  function sync(){cur.textContent=fmt(audio.currentTime); if(isFinite(audio.duration)) dur.textContent=fmt(audio.duration); fill.style.width=(audio.duration?(audio.currentTime/audio.duration)*100:0)+'%'; play.textContent=audio.paused?'â–¶':'âšâš'; syncMini();}
  function seek(x){const r=bar.getBoundingClientRect(); const pct=Math.min(1,Math.max(0,(x-r.left)/r.width)); if(isFinite(audio.duration)) audio.currentTime=pct*audio.duration; sync();}
  play.addEventListener('click',()=>{ audio.paused?audio.play():audio.pause(); });
  bar.addEventListener('mousedown',e=>seek(e.clientX));
  bar.addEventListener('touchstart',e=>{seek(e.touches[0].clientX)},{passive:true});
  audio.addEventListener('timeupdate',sync); audio.addEventListener('loadedmetadata',sync); audio.addEventListener('play',()=>{ currentAudio=audio; showMini(item); sync(); }); audio.addEventListener('pause',sync); audio.addEventListener('ended',()=>{ hideMini(); });
  sync();
}

function showMini(item){ mini.classList.remove('mini--hidden'); miniTitle.textContent=item.title; syncMini(); }
function hideMini(){ if(currentAudio){ try{ currentAudio.pause(); currentAudio.currentTime=0; }catch{} } currentAudio=null; mini.classList.add('mini--hidden'); }
function syncMini(){ if(!currentAudio){ mini.classList.add('mini--hidden'); return; } const d=currentAudio.duration||0; const pct=d?(currentAudio.currentTime/d)*100:0; miniProg.style.width=pct+'%'; miniPlay.textContent = currentAudio.paused?'â–¶':'âšâš'; }
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
if (hint) {
  hint.addEventListener('click', () => { alert(HINT); });
}
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
    console.assert(tagLabel('text')==='CARTA' && tagLabel('audio')==='AUDIO', 'tagLabel mapping');
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
