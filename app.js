/* ============================================
   CONTENT (replace with your real material)
   ============================================ */
const ENTRIES = [
  {
    id: "letter_grandpa",
    type: "text",
    title: "What My Grandpa Would Say About Our First Year Together",
    date: "2025-11-04",
    cover: "https://res.cloudinary.com/dul66qlpq/image/upload/v1762300312/Gemini_Generated_Image_bz7owbz7owbz7owb_kara35.png",
    text: `What My Grandpa Would Say About Our First Year Together

My grandpa has a very particular way of celebrating good things. I think it's a wise one.
When something good happens to someone in the family, he's happy, of course - but his attitude is always: "I already knew that."
He normalizes good things. He's happy and kind, but he doesn't overhype anything: he understands that doing things right is the only reasonable path.

And you know what, Sophie? I think something like that applies to us.

Because of course we've shared beautiful moments for a whole year. Of course this is a victory. We should celebrate - no doubt about it. But we should also understand something more important: this is only the beginning. The good news is only just starting to arrive.

This year we've been brutally limited. We've barely been able to be together virtually, and much less physically. It's been frustrating, I know. There have been nights when we just wanted to be in the same place, breathing the same air.

But listen to me carefully:

- We've already proven that this is stronger than any obstacle - Most relationships fall apart with the kind of chaos we've gone through, right? Even more so if it's long-distance. But we've done a damn good job.
- The best of us is a huge promise waiting to be fulfilled - The trips we'll take together, the mornings when we wake up and won't have to say goodbye, the decisions we'll make, the dreams we'll chase side by side, the small routines that will become our life. All of that is already there, waiting for us.
- We built this in "impossible mode" - If we managed to keep this alive, to make it grow, to deepen it with every limitation in the universe against us, can you imagine how unstoppable we'll be when everything is finally on our side?

If my grandpa were here, he'd look at you with that smile of his and say: "I already knew it. Of course they were going to get here. And of course they're going much further."

He's amazing. He would tell us to be patient and trust in each other's love.

And I, Sophie, tell you this:

Take my hand and let's continue this adventure for the rest of our lives.
Hold my hand tight - I will never let go.
I will be by your side because that's exactly where I want to be.

Anyway, let's just keep going day by day - sharing life.
Trying to give each other beautiful, happy things.
That will be enough.

(Consider this the magic emoji trident hahaha)`
  }
];

/* ============================================
   CONSTANTS & HELPERS
   ============================================ */
const TYPE_LABELS = {
  text: "LETTER",
  image: "MEMORY",
  audio: "AUDIO",
  video: "VIDEO"
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const byNew = (a, b) => new Date(b.date) - new Date(a.date);

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric"
});

function fmtDate(iso) {
  const timeSafeIso = `${iso}T12:00:00`;
  const date = new Date(timeSafeIso);
  return Number.isNaN(date.getTime()) ? iso : dateFormatter.format(date);
}

// Favorites
const FAVKEY = "sophie_favs";
const getFavs = () => new Set(JSON.parse(localStorage.getItem(FAVKEY) || "[]"));
const setFavs = (set) => localStorage.setItem(FAVKEY, JSON.stringify([...set]));

// Gate (light privacy).
const SECRET_PLAIN = "SMDD+CARM";
const HINT = 'It has a "+" and our initials.';

function hashLike(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0; // 32-bit signed
  }
  return (hash >>> 0).toString(16).slice(0, 16);
}

function nl2br(text) {
  return String(text).replace(/\r\n|\r|\n/g, "<br>");
}

function excerpt(text, max = 180) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= max) return clean;
  return `${clean.slice(0, Math.max(0, max - 3)).trimEnd()}...`;
}

function createTagPills(tags = []) {
  if (!tags.length) return "";
  return `<div class="card-tags">${tags.map((tag) => `<span class="pill">${tag}</span>`).join("")}</div>`;
}

function tagLabel(type) {
  return TYPE_LABELS[type] || "MEMORY";
}

/* ============================================
   RENDER
   ============================================ */
const grid = $("#grid");
const q = $("#q");
const countChip = $("#countChip");

function buildTextCard(item, favButton, tagsMarkup) {
  const typeLabel = tagLabel(item.type);
  const safeTitle = String(item.title || "");
  const ariaTitle = safeTitle.replace(/"/g, "&quot;");
  const lines = (item.text || "").split("\n").map((line) => line.trim()).filter(Boolean);
  const titleKey = safeTitle.trim().toLowerCase();
  const body = lines.length && lines[0].toLowerCase() === titleKey
    ? lines.slice(1).join(" ")
    : lines.join(" ");
  const preview = excerpt(body, 220);
  const dateLabel = fmtDate(item.date);
  const dateISO = item.date || "";

  return `
    <article class="card card--text" data-id="${item.id}" data-type="${item.type}" data-tags="${(item.tags || []).join(",")}" tabindex="0" role="button" aria-label="Read letter ${ariaTitle}">
      <span class="tag">${typeLabel}</span>
      ${favButton}
      <div class="content">
        <div class="card-head">
          <span class="card-head__label">Private letter</span>
          <time class="card-head__date" datetime="${dateISO}">${dateLabel}</time>
        </div>
        <h3 class="title">${safeTitle}</h3>
        <p class="excerpt">${preview}</p>
        <div class="card-foot">
          ${tagsMarkup}
          <span class="cta" aria-hidden="true">Read letter<span class="cta-icon">&#8599;</span></span>
        </div>
      </div>
    </article>`;
}

function cardTemplate(item) {
  const favs = getFavs();
  const fav = favs.has(item.id);
  const favLabel = fav ? "Remove from favorites" : "Add to favorites";
  const favIcon = fav ? "&#9733;" : "&#9734;";
  const favButton = `<button class="fav" type="button" aria-pressed="${fav}" aria-label="${favLabel}" title="${favLabel}">${favIcon}</button>`;
  const tagsMarkup = createTagPills(item.tags);
  const safeTitle = String(item.title || "");
  const ariaTitle = safeTitle.replace(/"/g, "&quot;");

  if (item.type === "text") {
    return buildTextCard(item, favButton, tagsMarkup);
  }

  const typeLabel = tagLabel(item.type);
  const meta = `${fmtDate(item.date)}${item.tags && item.tags.length ? ` &bull; ${(item.tags || []).join(" &bull; ")}` : ""}`;
  const coverSrc = item.type === "image" ? item.cover || item.src : item.cover || "";
  const typeLabelLower = typeLabel.toLowerCase();

  return `
    <article class="card" data-id="${item.id}" data-type="${item.type}" data-tags="${(item.tags || []).join(",")}" tabindex="0" role="button" aria-label="Open ${typeLabelLower} ${ariaTitle}">
      <span class="tag">${typeLabel}</span>
      ${favButton}
      <img class="cover" src="${coverSrc}" alt="">
      <div class="content">
        <h3 class="title">${safeTitle}</h3>
        <p class="meta">${meta}</p>
      </div>
    </article>`;
}

function render(list) {
  grid.innerHTML = list.sort(byNew).map(cardTemplate).join("");
  const count = list.length;
  countChip.textContent = `${count} ${count === 1 ? "moment" : "moments"}`;
}

function filterList() {
  const needle = (q.value || "").toLowerCase();
  const activeType = $$(".filter").find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.type || "all";
  const filtered = ENTRIES.filter((item) => {
    const textBlob = [
      item.title,
      ...(item.tags || []),
      item.caption || "",
      item.text || ""
    ].join(" ").toLowerCase();
    const matchesText = !needle || textBlob.includes(needle);
    const matchesType = activeType === "all" || item.type === activeType;
    return matchesText && matchesType;
  });
  render(filtered);
}

function findEntry(id) {
  return ENTRIES.find((entry) => entry.id === id);
}

grid.addEventListener("click", (event) => {
  const favBtn = event.target.closest(".fav");
  if (favBtn) {
    event.stopPropagation();
    const card = favBtn.closest(".card");
    if (!card) return;
    const id = card.dataset.id;
    const favs = getFavs();
    if (favs.has(id)) {
      favs.delete(id);
    } else {
      favs.add(id);
    }
    setFavs(favs);
    filterList();
    return;
  }

  const card = event.target.closest(".card");
  if (!card) return;
  const item = findEntry(card.dataset.id);
  if (item) {
    openModal(item);
  }
});

grid.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key !== "Enter" && key !== " " && key !== "Spacebar") return;
  if (event.target.closest(".fav")) return;
  const card = event.target.closest(".card");
  if (!card) return;
  const item = findEntry(card.dataset.id);
  if (item) {
    event.preventDefault();
    openModal(item);
  }
});

/* ============================================
   MODAL + CONTENT TYPES
   ============================================ */
const overlay = $("#overlay");
const modalTitle = $("#modalTitle");
const modalBody = $("#modalBody");
const modalFoot = $("#modalFoot");
const favToggle = $("#favToggle");

function setFavToggle(isFav) {
  const label = isFav ? "Remove from favorites" : "Add to favorites";
  favToggle.textContent = label;
  favToggle.setAttribute("aria-pressed", String(isFav));
}

function openModal(item) {
  modalTitle.textContent = item.title;
  const favSet = getFavs();
  const isFav = favSet.has(item.id);
  setFavToggle(isFav);

  favToggle.onclick = () => {
    const current = getFavs();
    if (current.has(item.id)) {
      current.delete(item.id);
    } else {
      current.add(item.id);
    }
    setFavs(current);
    setFavToggle(current.has(item.id));
    filterList();
  };

  const metaInfo = `${fmtDate(item.date)}${item.tags && item.tags.length ? ` &bull; ${(item.tags || []).join(" &bull; ")}` : ""}`;

  if (item.type === "text") {
    modalBody.innerHTML = `<article class="letter"><div class="hand">${nl2br(item.text || "")}</div></article>`;
    modalFoot.innerHTML = metaInfo ? `<span class="meta">${metaInfo}</span>` : "";
  } else if (item.type === "image") {
    modalBody.innerHTML = `<figure><img src="${item.src}" alt="${item.caption || ""}"><figcaption class="meta" style="margin-top:8px">${item.caption || ""}</figcaption></figure>`;
    modalFoot.innerHTML = metaInfo ? `<span class="meta">${metaInfo}</span>` : "";
  } else if (item.type === "audio") {
    const id = `aud_${item.id}`;
    modalBody.innerHTML = `
      <div class="player" role="group" aria-label="Audio controls">
        <button class="p-btn play" aria-label="Play">Play</button>
        <div class="p-time">
          <span class="p-cur">0:00</span>
          <div class="pbar"><div class="fill"></div></div>
          <span class="p-dur">0:00</span>
        </div>
      </div>
      <p class="meta" style="margin-top:8px">${item.notes || ""}</p>
      <audio id="${id}" preload="metadata" src="${item.src}"></audio>`;
    modalFoot.innerHTML = `${metaInfo ? `<span class="meta">${metaInfo}</span>` : ""}<a class="btn" href="${item.src}" download>Download</a>`;
    bindPlayer($(`#${id}`), $(".player", modalBody), item);
  } else if (item.type === "video") {
    modalBody.innerHTML = `
      <video controls playsinline style="width:100%;border-radius:18px;border:1px solid rgba(48,38,58,.12);box-shadow:var(--shadow)" src="${item.src}"></video>
      <p class="meta" style="margin-top:8px">${item.caption || ""}</p>`;
    modalFoot.innerHTML = `${metaInfo ? `<span class="meta">${metaInfo}</span>` : ""}<a class="btn" href="${item.src}" download>Download</a>`;
  } else {
    modalBody.innerHTML = "";
    modalFoot.innerHTML = metaInfo ? `<span class="meta">${metaInfo}</span>` : "";
  }

  overlay.classList.add("show");
}

$("#close").addEventListener("click", () => overlay.classList.remove("show"));
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) overlay.classList.remove("show");
});

/* ============================================
   PLAYER + STICKY MINI (audio only)
   ============================================ */
let currentAudio = null;
const mini = $("#mini");
const miniPlay = $("#miniPlay");
const miniClose = $("#miniClose");
const miniBar = $("#miniBar");
const miniProg = $("#miniProg");
const miniTitle = $("#miniTitle");

function fmtTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const whole = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function bindPlayer(audio, root, item) {
  const play = $(".play", root);
  const current = $(".p-cur", root);
  const duration = $(".p-dur", root);
  const bar = $(".pbar", root);
  const fill = $(".fill", root);

  function sync() {
    current.textContent = fmtTime(audio.currentTime);
    if (Number.isFinite(audio.duration)) {
      duration.textContent = fmtTime(audio.duration);
    }
    fill.style.width = audio.duration ? `${(audio.currentTime / audio.duration) * 100}%` : "0%";
    play.textContent = audio.paused ? "Play" : "Pause";
    syncMini();
  }

  function seek(clientX) {
    const rect = bar.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = pct * audio.duration;
    }
    sync();
  }

  play.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  bar.addEventListener("mousedown", (event) => seek(event.clientX));
  bar.addEventListener("touchstart", (event) => {
    seek(event.touches[0].clientX);
  }, { passive: true });

  audio.addEventListener("timeupdate", sync);
  audio.addEventListener("loadedmetadata", sync);
  audio.addEventListener("play", () => {
    currentAudio = audio;
    showMini(item);
    sync();
  });
  audio.addEventListener("pause", sync);
  audio.addEventListener("ended", () => {
    hideMini();
  });

  sync();
}

function showMini(item) {
  mini.classList.remove("mini--hidden");
  miniTitle.textContent = item.title;
  syncMini();
}

function hideMini() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = null;
  mini.classList.add("mini--hidden");
  miniPlay.textContent = "Play";
}

function syncMini() {
  if (!currentAudio) {
    mini.classList.add("mini--hidden");
    return;
  }
  const duration = currentAudio.duration || 0;
  const pct = duration ? (currentAudio.currentTime / duration) * 100 : 0;
  miniProg.style.width = `${pct}%`;
  miniPlay.textContent = currentAudio.paused ? "Play" : "Pause";
}

miniPlay.addEventListener("click", () => {
  if (!currentAudio) return;
  if (currentAudio.paused) {
    currentAudio.play();
  } else {
    currentAudio.pause();
  }
  syncMini();
});

miniClose.addEventListener("click", hideMini);
miniBar.addEventListener("click", (event) => {
  if (!currentAudio || !currentAudio.duration) return;
  const rect = miniBar.getBoundingClientRect();
  currentAudio.currentTime = ((event.clientX - rect.left) / rect.width) * currentAudio.duration;
});

/* ============================================
   SEARCH + FILTERS
   ============================================ */
q.addEventListener("input", filterList);
$$(".filter").forEach((button) => button.addEventListener("click", () => {
  $$(".filter").forEach((other) => other.setAttribute("aria-pressed", "false"));
  button.setAttribute("aria-pressed", "true");
  filterList();
}));

/* ============================================
   GATE (secret key)
   ============================================ */
const gate = $("#gate");
const pass = $("#pass");
const enter = $("#enter");
const hint = $("#hint");
const msg = $("#msg");

function showGate() {
  if (!gate) return;
  gate.hidden = false;
  gate.removeAttribute("hidden");
  gate.style.display = "";
  if (msg) msg.textContent = "";
  if (pass) pass.value = "";
  if (pass) pass.focus();
}

enter.addEventListener("click", () => {
  const input = pass.value.trim();
  if (!input) {
    msg.textContent = "Type the key.";
    return;
  }
  if (hashLike(input) === hashLike(SECRET_PLAIN)) {
    gate.hidden = true;
    gate.setAttribute("hidden", "");
    pass.value = "";
    msg.textContent = "";
  } else {
    msg.textContent = "Wrong key. Try again.";
    pass.select();
  }
});

if (hint) {
  hint.addEventListener("click", () => {
    alert(HINT);
  });
}

pass.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    enter.click();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  filterList();
  showGate();
});
