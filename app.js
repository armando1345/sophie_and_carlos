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

(and here is the magic emoji trident hahaha: 😘🫂❤️)`
  },
  {
    id: "image_2026",
    type: "image",
    title: "¡2026 is here!",
    date: "2026-01-01",
    src: "https://res.cloudinary.com/dul66qlpq/image/upload/v1767224560/2026_nl0suo.png",
    cover: "https://res.cloudinary.com/dul66qlpq/image/upload/v1767224560/2026_nl0suo.png",
    caption: "Maybe this year we will be like in that image"
  },
  {
    id: "video_sophie_carlos_2026",
    type: "video",
    title: "This wasnt my best animation",
    date: "2026-01-01",
    src: "https://res.cloudinary.com/dul66qlpq/video/upload/v1767224562/soph_y_yo_eqo1ql.mp4",
    cover: "https://res.cloudinary.com/dul66qlpq/image/upload/v1767224850/ojos_cerrados_md3m20.png",
    caption: "I still hope you love it 😘"
  }
];

/* ============================================
   CONSTANTS & HELPERS
   ============================================ */
const TYPE_LABELS = {
  text: "LETTER",
  image: "IMAGE",
  audio: "AUDIO",
  video: "VIDEO"
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeVideo = null;
let activeVideoFrame = null;
let activeImageFrame = null;

function spawnHearts({ x, y, count = 16 }) {
  if (prefersReducedMotion) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i += 1) {
    const span = document.createElement("span");
    span.className = "particle-heart";
    const size = 18 + Math.random() * 12;
    span.style.width = `${size}px`;
    span.style.height = `${size}px`;
    const dx = (Math.random() - 0.5) * 120;
    const dy = -100 - Math.random() * 120;
    const duration = 1100 + Math.random() * 700;
    const delay = Math.random() * 80;
    span.animate([
      { transform: "translate(0,0) scale(1)", opacity: 0.95 },
      { transform: `translate(${dx}px, ${dy}px) scale(${0.8 + Math.random() * 0.4})`, opacity: 0 }
    ], {
      duration,
      delay,
      easing: "cubic-bezier(.22,1,.36,1)",
      fill: "forwards"
    });
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    frag.appendChild(span);
    setTimeout(() => span.remove(), duration + delay + 40);
  }
  document.body.appendChild(frag);
}

function requestFullscreenFor(element) {
  if (!element) return false;
  const request = element.requestFullscreen || element.webkitRequestFullscreen || element.msRequestFullscreen;
  if (request) {
    request.call(element);
    return true;
  }
  if (element.webkitEnterFullscreen) {
    element.webkitEnterFullscreen();
    return true;
  }
  return false;
}

function exitFullscreen() {
  const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
  if (exit) exit.call(document);
}

function enterVideoMode(frame) {
  if (!overlay) return;
  overlay.classList.add("video-mode");
  if (frame) frame.classList.add("video-frame--active");
}

function exitVideoMode(video, frame) {
  if (!overlay) return;
  overlay.classList.remove("video-mode");
  if (frame) frame.classList.remove("video-frame--active");
  if (video && !video.paused) {
    video.pause();
  }
}

function exitImageMode(frame) {
  if (frame) frame.classList.remove("image-frame--active");
}

function toggleImageFullscreen(frame) {
  if (!frame) return;
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
  if (fullscreenElement) {
    exitFullscreen();
    return;
  }
  if (frame.classList.contains("image-frame--active")) {
    frame.classList.remove("image-frame--active");
    return;
  }
  const started = requestFullscreenFor(frame);
  if (!started) {
    frame.classList.add("image-frame--active");
  }
}

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

// Gate (light privacy).
const SECRET_PLAIN = "SMDD+CARM";

function hashLike(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0; // 32-bit signed
  }
  return (hash >>> 0).toString(16).slice(0, 16);
}


function letterBodyText(item) {
  const safeTitle = String(item.title || "").trim().toLowerCase();
  const lines = String(item.text || "").split("\n").map((line) => line.trimEnd());
  if (lines.length && lines[0].trim().toLowerCase() === safeTitle) {
    lines.shift();
  }
  return lines.join("\n").trim();
}

function letterBodyMarkup(item) {
  const body = letterBodyText(item);
  if (!body) return "";
  const blocks = body.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return blocks.map((block) => {
    const lines = block.split(/\n/).map((line) => line.trim()).filter(Boolean);
    const isList = lines.every((line) => /^[-\u2022]/.test(line));
    if (isList) {
      const items = lines.map((line) => `<li>${line.replace(/^[-\u2022]\s*/, "")}</li>`).join("");
      return `<ul class="letter-list">${items}</ul>`;
    }
    return `<p>${lines.join("<br>")}</p>`;
  }).join("");
}
function createTagPills(tags = []) {
  if (!tags.length) return "";
  return `<div class="card-tags">${tags.map((tag) => `<button type="button" class="pill pill--tag" data-tag="${tag}">${tag}</button>`).join("")}</div>`;
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
const hero = $("#hero");
const readProgress = $("#readProgress");

function buildTextCard(item, tagsMarkup) {
  const typeLabel = tagLabel(item.type);
  const safeTitle = String(item.title || "");
  const ariaTitle = safeTitle.replace(/"/g, "&quot;");
  const coverSrc = item.cover || "";
  const dateISO = item.date || "";
  const dateLabel = item.date ? fmtDate(item.date) : "";

  return `
    <article class="card card--text" data-id="${item.id}" data-type="${item.type}" data-tags="${(item.tags || []).join(",")}" tabindex="0" role="button" aria-label="Read letter ${ariaTitle}">
      <span class="tag">${typeLabel}</span>
      <div class="content">
        ${coverSrc ? `<figure class="card-hero"><img src="${coverSrc}" alt="" loading="lazy"></figure>` : ""}
        <div class="card-head">
          <span class="card-head__label">Letter</span>
        </div>
        <h3 class="title">${safeTitle}</h3>
        ${dateLabel ? `<div class="card-meta"><time datetime="${dateISO}">${dateLabel}</time></div>` : ""}
        <div class="card-foot">
          ${tagsMarkup}
          <span class="cta" aria-hidden="true">Read letter<span class="cta-icon">&#8599;</span></span>
        </div>
      </div>
    </article>`;
}

function cardTemplate(item) {
  const tagsMarkup = createTagPills(item.tags);
  const safeTitle = String(item.title || "");
  const ariaTitle = safeTitle.replace(/"/g, "&quot;");

  if (item.type === "text") {
    return buildTextCard(item, tagsMarkup);
  }

  const typeLabel = tagLabel(item.type);
  const dateLabel = item.date ? fmtDate(item.date) : "";
  const coverSrc = item.type === "image" ? item.cover || item.src : item.cover || "";
  const typeLabelLower = typeLabel.toLowerCase();
  const isVisual = item.type === "image" || item.type === "video";

  if (isVisual) {
    return `
      <article class="card card--media" data-id="${item.id}" data-type="${item.type}" data-tags="${(item.tags || []).join(",")}" tabindex="0" role="button" aria-label="Open ${typeLabelLower} ${ariaTitle}">
        <span class="tag">${typeLabel}</span>
        <img class="cover" src="${coverSrc}" alt="" loading="lazy">
        ${item.type === "video" ? `<span class="media-play" aria-hidden="true">Play</span>` : ""}
        <div class="media-overlay">
          <div class="media-plate">
            ${dateLabel ? `<span class="media-meta">${dateLabel}</span>` : ""}
            <h3 class="media-title">${safeTitle}</h3>
            ${item.caption ? `<p class="media-sub">${item.caption}</p>` : ""}
          </div>
        </div>
      </article>`;
  }

  const meta = `${fmtDate(item.date)}${item.tags && item.tags.length ? ` &bull; ${(item.tags || []).join(" &bull; ")}` : ""}`;

  return `
    <article class="card" data-id="${item.id}" data-type="${item.type}" data-tags="${(item.tags || []).join(",")}" tabindex="0" role="button" aria-label="Open ${typeLabelLower} ${ariaTitle}">
      <span class="tag">${typeLabel}</span>
      <img class="cover" src="${coverSrc}" alt="">
      <div class="content">
        <h3 class="title">${safeTitle}</h3>
        <p class="meta">${meta}</p>
      </div>
    </article>`;
}

function render(list) {
  const sorted = [...list].sort(byNew);
  const count = sorted.length;
  countChip.textContent = `${count} ${count === 1 ? "memory" : "memories"}`;
  if (!count) {
    grid.innerHTML = `
      <div class="empty">
        <div class="empty__body">
          <p class="empty__title">We still don’t have memories in this section</p>
          <p class="empty__text">Let’s make some!</p>
          <div class="empty__actions">
            <button id="resetFilters" class="btn">Clear search & filters</button>
            <button id="surpriseGrid" class="btn btn-ghost">Surprise us</button>
          </div>
        </div>
      </div>`;
    return;
  }
  grid.innerHTML = sorted.map(cardTemplate).join("");
  $$(".card", grid).forEach((card) => {
    card.classList.add("card-pop");
    card.style.animationDelay = `${Math.random() * 0.08 + 0.02}s`;
    setTimeout(() => card.classList.remove("card-pop"), 260);
  });
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
  if (event.target.id === "resetFilters") {
    q.value = "";
    $$(".filter").forEach((button) => button.setAttribute("aria-pressed", button.dataset.type === "all" ? "true" : "false"));
    filterList();
    return;
  }
  if (event.target.id === "surpriseGrid") {
    surpriseUs();
    return;
  }
  const tagButton = event.target.closest(".pill--tag");
  if (tagButton) {
    event.stopImmediatePropagation();
    applyTagFilter(tagButton.dataset.tag);
    return;
  }
  const card = event.target.closest(".card");
  if (!card) return;
  const item = findEntry(card.dataset.id);
  if (item) {
    const rect = card.getBoundingClientRect();
    openModal(item, { origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } });
  }
});

grid.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key !== "Enter" && key !== " " && key !== "Spacebar") return;
  const tagButton = event.target.closest(".pill--tag");
  if (tagButton) {
    event.preventDefault();
    applyTagFilter(tagButton.dataset.tag);
    return;
  }
  const card = event.target.closest(".card");
  if (!card) return;
  const item = findEntry(card.dataset.id);
  if (item) {
    event.preventDefault();
    const rect = card.getBoundingClientRect();
    openModal(item, { origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } });
  }
});

/* ============================================
   MODAL + CONTENT TYPES
   ============================================ */
const overlay = $("#overlay");
const modal = $(".modal", overlay);
const modalTitle = $("#modalTitle");
const modalBody = $("#modalBody");
const modalFoot = $("#modalFoot");
const closeButton = $("#close");
const FOCUSABLE_SELECTOR = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
let lastFocusedElement = null;
let isLetterOpen = false;

function updateReadProgress() {
  if (!modal || !readProgress) return;
  if (!isLetterOpen) {
    readProgress.style.setProperty("--progress", "0%");
    readProgress.style.setProperty("opacity", "0");
    return;
  }
  const max = modal.scrollHeight - modal.clientHeight;
  const pct = max > 0 ? (modal.scrollTop / max) * 100 : 0;
  readProgress.style.setProperty("--progress", `${pct}%`);
  readProgress.style.setProperty("opacity", pct > 0 ? "1" : "0.9");
}

function openModal(item, options = {}) {
  const origin = options.origin || null;
  lastFocusedElement = document.activeElement;
  activeImageFrame = null;
  modalTitle.textContent = item.title;
  isLetterOpen = item.type === "text";
  if (readProgress) {
    readProgress.style.setProperty("opacity", isLetterOpen ? "1" : "0");
    readProgress.style.setProperty("--progress", "0%");
  }

  const metaInfo = `${fmtDate(item.date)}${item.tags && item.tags.length ? ` &bull; ${(item.tags || []).join(" &bull; ")}` : ""}`;

  if (item.type === "text") {
    const dateISO = item.date || "";
    const dateLabel = item.date ? fmtDate(item.date) : "";
    const tagsMarkup = createTagPills(item.tags);
    modalBody.innerHTML = `
      <article class="letter">
        <header class="letter-header">
          <span class="letter-label">Letter</span>
          ${dateLabel ? `<time class="letter-date" datetime="${dateISO}">${dateLabel}</time>` : ""}
        </header>
        <div class="letter-body">${letterBodyMarkup(item)}</div>
      </article>`;
    modalFoot.innerHTML = tagsMarkup ? `<div class="letter-tags">${tagsMarkup}</div>` : "";
  } else if (item.type === "image") {
    modalBody.innerHTML = `<figure class="media-frame image-frame" tabindex="0" role="button" aria-label="View image fullscreen"><img src="${item.src}" alt="${item.caption || ""}"></figure><figcaption class="meta" style="margin-top:8px">${item.caption || ""}</figcaption>`;
    modalFoot.innerHTML = metaInfo ? `<span class="meta">${metaInfo}</span>` : "";
    const frame = $(".image-frame", modalBody);
    activeImageFrame = frame;
    if (frame) {
      frame.addEventListener("click", () => {
        toggleImageFullscreen(frame);
      });
      frame.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
          event.preventDefault();
          toggleImageFullscreen(frame);
        }
      });
    }
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
      <div class="media-frame video-frame">
        <button class="video-back" type="button" aria-label="Back">Back</button>
        <video controls playsinline preload="metadata" src="${item.src}"></video>
        <span class="video-sparkle" aria-hidden="true"></span>
      </div>
      <p class="meta" style="margin-top:8px">${item.caption || ""}</p>`;
    modalFoot.innerHTML = `${metaInfo ? `<span class="meta">${metaInfo}</span>` : ""}<a class="btn" href="${item.src}" download>Download</a>`;
    const video = $("video", modalBody);
    const frame = $(".video-frame", modalBody);
    const back = $(".video-back", modalBody);
    activeVideo = video;
    activeVideoFrame = frame;
    if (video) {
      video.addEventListener("play", () => {
        enterVideoMode(frame);
        requestFullscreenFor(frame || video);
      });
      video.addEventListener("ended", () => {
        exitVideoMode(video, frame);
      });
    }
    if (back) {
      back.addEventListener("click", () => {
        exitFullscreen();
        exitVideoMode(video, frame);
      });
    }
  } else {
    modalBody.innerHTML = "";
    modalFoot.innerHTML = metaInfo ? `<span class="meta">${metaInfo}</span>` : "";
  }

  overlay.classList.add("show");
  document.body.classList.add("modal-open");
  if (readProgress) {
    readProgress.style.setProperty("--progress", isLetterOpen ? "0%" : "0%");
  }
  if (modal) {
    modal.scrollTop = 0;
    requestAnimationFrame(() => {
      modal.scrollTop = 0;
      if (closeButton) {
        closeButton.focus();
      }
      updateReadProgress();
    });
  }
  if (origin) {
    spawnHearts({ x: origin.x, y: origin.y, count: 10 });
  }
}

function closeModal() {
  overlay.classList.remove("show");
  document.body.classList.remove("modal-open");
  exitFullscreen();
  exitVideoMode(activeVideo, activeVideoFrame);
  exitImageMode(activeImageFrame);
  activeVideo = null;
  activeVideoFrame = null;
  activeImageFrame = null;
  if (readProgress) {
    readProgress.style.setProperty("--progress", "0%");
    readProgress.style.setProperty("opacity", "0");
  }
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

if (closeButton) {
  closeButton.addEventListener("click", closeModal);
}

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeModal();
  }
});

if (modal) {
  modal.addEventListener("scroll", () => {
    updateReadProgress();
  });
}

overlay.addEventListener("keydown", (event) => {
  if (event.key !== "Tab" || !overlay.classList.contains("show")) return;
  const focusables = Array.from(overlay.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => !el.disabled && el.offsetParent !== null);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && overlay.classList.contains("show")) {
    closeModal();
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    exitVideoMode(activeVideo, activeVideoFrame);
  }
});
document.addEventListener("webkitfullscreenchange", () => {
  if (!document.webkitFullscreenElement) {
    exitVideoMode(activeVideo, activeVideoFrame);
  }
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
    play.classList.add("is-playing");
    sync();
  });
  audio.addEventListener("pause", () => {
    play.classList.remove("is-playing");
    sync();
  });
  audio.addEventListener("ended", () => {
    play.classList.remove("is-playing");
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
   TAG SHORTCUTS + SURPRISE
   ============================================ */
function applyTagFilter(tag) {
  if (!tag) return;
  q.value = tag;
  $$(".filter").forEach((button) => button.setAttribute("aria-pressed", button.dataset.type === "all" ? "true" : "false"));
  filterList();
  if (hero) {
    hero.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  closeModal();
}

function randomEntry() {
  if (!ENTRIES.length) return null;
  const idx = Math.floor(Math.random() * ENTRIES.length);
  return ENTRIES[idx];
}

function surpriseUs() {
  const pick = randomEntry();
  if (pick) {
    const origin = { x: window.innerWidth / 2, y: window.innerHeight - 40 };
    openModal(pick, { origin });
  }
}

modalFoot.addEventListener("click", (event) => {
  const tagButton = event.target.closest(".pill--tag");
  if (tagButton) {
    applyTagFilter(tagButton.dataset.tag);
  }
});

const randomBtn = $("#randomBtn");
if (randomBtn) {
  randomBtn.addEventListener("click", surpriseUs);
}

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
const msg = $("#msg");

function setGateMessage(text = "", variant = "info") {
  if (!msg) return;
  msg.textContent = text;
  msg.classList.remove("gate-msg--error");
  if (!text) return;
  if (variant === "error") {
    msg.classList.add("gate-msg--error");
  }
}

function showGate() {
  if (!gate) return;
  gate.hidden = false;
  gate.removeAttribute("hidden");
  gate.style.display = "";
  setGateMessage("");
  if (pass) pass.value = "";
  if (pass) pass.focus();
}

enter.addEventListener("click", () => {
  const input = pass.value.trim();
  if (!input) {
    setGateMessage("Type our key.", "error");
    return;
  }
  if (hashLike(input) === hashLike(SECRET_PLAIN)) {
    enter.classList.add("gate-enter--success");
    const rect = gate.getBoundingClientRect();
    spawnHearts({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, count: 12 });
    gate.hidden = true;
    gate.setAttribute("hidden", "");
    pass.value = "";
    setGateMessage("");
    setTimeout(() => enter.classList.remove("gate-enter--success"), 600);
  } else {
    setGateMessage("Wrong key. Try again.", "error");
    pass.select();
  }
});

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
