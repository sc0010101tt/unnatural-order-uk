/**
 * UNNATURAL ORDER // UO_OS v0.93 — Decaying Desktop Operating System Controller
 * Orchestrates WebGL Abyss Wallpaper, VRAM Frozen-Window Ghost Trails & Data-Ash
 * Erosion, Draggable Window Manager, System Decay Engine, Procedural Retro SFX,
 * Rogue Kernel Faults, BSOD, and all 10 Interactive Band Applications.
 */

import { AbyssRenderer } from './abyss-gl.js';
import { RetroSoundEngine } from './sound-engine.js';

const BLUEPRINT_COPY = {
  front:
    'Oversized heavyweight black tees & hoodies printed with the UNNATURAL ORDER wordmark across the chest.',
  back:
    'Full-back distressed U/O monolith screenprint paired with OBSERVE//INFILTRATE transmission typography.',
  tin:
    'Brushed raw-steel hinged pocket tin and matte-black U/O custom picks crafted alongside @thepickshouse.',
};

const KERNEL_FAULTS = [
  {
    title: 'FATAL EXCEPTION 0x0000UO25',
    msg: 'NATURAL ORDER not found at 51.2802° N, 1.0789° E. System architecture inverting into UNNATURAL ORDER.',
  },
  {
    title: 'VRAM DELAMINATION WARNING',
    msg: 'OBSERVE//INFILTRATE carrier wave bleeding through corrupted frame buffer into technical abyss.',
  },
  {
    title: 'AUDIO HARDWARE CLIPPING',
    msg: 'Metal-keg & axe percussion sample exceeded 16-bit headroom. Raw live desk signal preserved.',
  },
  {
    title: 'SECTOR INTEGRITY FAILURE',
    msg: 'Kent M2TM 2025 // Bloodstock Open Air override locked in Ring 0. Cannot revert to conformity.',
  },
  {
    title: 'MEMORY LEAK // 0xOVERTHROW',
    msg: 'Workstation chrome corroding at accelerated rate. We will grow and we will overthrow.',
  },
];

const APP_ALIASES = {
  main: 'main',
  home: 'main',
  uo: 'main',
  music: 'music',
  ep: 'music',
  observe: 'music',
  wav: 'music',
  spotify: 'music',
  live: 'live',
  dates: 'live',
  tour: 'live',
  shows: 'live',
  video: 'video',
  bloodstock: 'video',
  avi: 'video',
  film: 'video',
  band: 'band',
  personnel: 'band',
  origin: 'band',
  members: 'band',
  merch: 'merch',
  store: 'merch',
  cad: 'merch',
  overthrow: 'overthrow',
  decay: 'overthrow',
  sys: 'overthrow',
  transmit: 'transmit',
  mail: 'transmit',
  newsletter: 'transmit',
  links: 'transmit',
  terminal: 'terminal',
  cmd: 'terminal',
  shell: 'terminal',
  abyss: 'terminal',
  recycle: 'recycle',
  bin: 'recycle',
  trash: 'recycle',
};

const state = {
  decay: 0.38, // 0.0 -> 1.0
  fracture: 0,
  zCounter: 40,
  focusedApp: 'main',
  faultIndex: 0,
  faultOffset: 0,
  isMobile: () => window.innerWidth <= 900,
};

let abyss = null;
const sfx = new RetroSoundEngine();

/* ==========================================================================
   1. VRAM GHOST-TRAIL & FALLING DATA-ASH CANVAS ENGINE
   ========================================================================== */
class VramTrailEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.ghosts = [];
    this.ash = [];
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.ctx) return;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this._loop();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Stamp a frozen late-90s wireframe ghost of a dragged window onto desktop VRAM
  stampWindowGhost(rect, title, crimson = false) {
    if (!this.ctx || this.reducedMotion) return;
    this.ghosts.push({
      x: rect.left,
      y: rect.top,
      w: rect.width,
      h: rect.height,
      title,
      crimson,
      alpha: 0.32 + state.decay * 0.25,
      age: 0,
    });
    if (this.ghosts.length > 26) {
      this.ghosts.shift();
    }
  }

  // Emit falling pixelated ash flakes corroding off the bottom of open windows
  _spawnWindowAsh() {
    if (this.reducedMotion || state.isMobile()) return;
    const rate = 0.25 + state.decay * 1.4;
    if (Math.random() > rate) return;

    const openWins = document.querySelectorAll('.os-window.is-open:not(.is-minimized)');
    if (!openWins.length) return;
    const win = openWins[Math.floor(Math.random() * openWins.length)];
    const r = win.getBoundingClientRect();
    if (r.width < 40) return;

    const isCrimson = Math.random() < 0.24 + state.decay * 0.35;
    this.ash.push({
      x: r.left + Math.random() * r.width,
      y: r.bottom - 2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: 0.45 + Math.random() * (0.9 + state.decay * 1.1),
      size: Math.random() < 0.55 ? 2 : 3,
      life: 1.0,
      color: isCrimson ? '#d81920' : Math.random() < 0.35 ? '#9b6434' : '#7a828b',
    });

    if (this.ash.length > 130) {
      this.ash.shift();
    }
  }

  _loop() {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw decaying VRAM frozen window ghosts
    for (let i = this.ghosts.length - 1; i >= 0; i--) {
      const g = this.ghosts[i];
      g.age += 1;
      g.alpha *= 0.968;
      if (g.alpha < 0.015) {
        this.ghosts.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = g.alpha;
      const jitterX = state.decay > 0.55 ? (Math.random() - 0.5) * 2 : 0;
      const x = Math.round(g.x + jitterX);
      const y = Math.round(g.y);

      // Outer wireframe & stepped titlebar afterimage
      ctx.strokeStyle = g.crimson || state.decay > 0.7 ? '#d81920' : '#707a84';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, g.w, g.h);

      ctx.fillStyle = g.crimson || state.decay > 0.65 ? 'rgba(130,16,22,0.45)' : 'rgba(42,50,58,0.42)';
      ctx.fillRect(x + 2, y + 2, g.w - 4, 22);

      // Occasional horizontal bitrot scanline notch inside ghost
      ctx.fillStyle = '#090a0c';
      ctx.fillRect(x + 12, y + Math.min(g.h - 8, 12 + (g.age % 30) * 3), g.w * 0.28, 2);
      ctx.restore();
    }

    // Spawn & draw falling data-ash pixels sinking into the abyss
    this._spawnWindowAsh();
    for (let i = this.ash.length - 1; i >= 0; i--) {
      const p = this.ash[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.011;
      if (p.life <= 0 || p.y > this.canvas.height) {
        this.ash.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = Math.max(0, p.life * 0.8);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(() => this._loop());
  }
}

let vram = null;

/* ==========================================================================
   2. FAST BIOS / POST BOOT SEQUENCE
   ========================================================================== */
function initBootSequence() {
  const overlay = document.getElementById('bootOverlay');
  const logEl = document.getElementById('bootLog');
  const skipBtn = document.getElementById('bootSkipBtn');
  if (!overlay || !logEl) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finish = () => {
    if (overlay.classList.contains('is-done')) return;
    overlay.classList.add('is-done');
    document.removeEventListener('keydown', onAnyKey);
  };

  const onAnyKey = () => finish();

  if (reduced) {
    finish();
    return;
  }

  const lines = [
    { t: 40, html: 'POST: UO_BIOS v0.93 // CANTERBURY NODE [51.2802° N, 1.0789° E]' },
    { t: 210, html: 'VRAM CHECK: 64MB ... <span class="err">[38% BITROT DETECTED]</span>' },
    { t: 410, html: 'MOUNT /DEV/NATURAL_ORDER ... <span class="err">[FAILED — INVERTING ORDER]</span>' },
    { t: 620, html: 'LOADING OBSERVE//INFILTRATE.WAV · BLOODSTOCK_25.AVI ... [OK]' },
    { t: 840, html: 'LAUNCHING CORRUPTED DESKTOP SHELL -> WE WILL OVERTHROW' },
  ];

  lines.forEach((line) => {
    setTimeout(() => {
      if (overlay.classList.contains('is-done')) return;
      const div = document.createElement('div');
      div.innerHTML = line.html;
      logEl.appendChild(div);
    }, line.t);
  });

  setTimeout(finish, 1280);
  if (skipBtn) skipBtn.addEventListener('click', finish);
  overlay.addEventListener('click', finish);
  document.addEventListener('keydown', onAnyKey);
}

/* ==========================================================================
   3. GLOBAL SYSTEM DECAY & FRACTURE ENGINE
   ========================================================================== */
function getDecayLabel(pct) {
  if (pct < 25) return 'DORMANT ARCHIVE';
  if (pct < 55) return 'ACTIVE BITROT';
  if (pct < 85) return 'DELAMINATION';
  return 'TECHNICAL ABYSS';
}

function getDecayTier(pct) {
  if (pct < 25) return 'clean';
  if (pct < 55) return 'rot';
  if (pct < 85) return 'delam';
  return 'abyss';
}

function setSystemDecay(val01, { pulse = false } = {}) {
  state.decay = Math.max(0, Math.min(1, val01));
  const pct = Math.round(state.decay * 100);
  const tier = getDecayTier(pct);

  document.documentElement.style.setProperty('--decay', state.decay.toFixed(3));
  document.body.dataset.decayTier = tier;

  if (abyss) {
    abyss.setDecay(state.decay);
    if (pulse) abyss.pulseGlitch(0.65);
  }

  // Sync UI readouts
  const slider = document.getElementById('decaySlider');
  if (slider && Number(slider.value) !== pct) slider.value = String(pct);

  const readout = document.getElementById('decayReadout');
  if (readout) readout.textContent = `${pct}% — ${getDecayLabel(pct)}`;

  const trayVal = document.getElementById('trayDecayVal');
  if (trayVal) trayVal.textContent = `${pct}%`;

  const mobileVal = document.getElementById('mobileDecayVal');
  if (mobileVal) mobileVal.textContent = `${pct}%`;

  const wm = document.getElementById('watermarkDecay');
  if (wm) wm.textContent = `${pct}%`;

  // Sync OVERTHROW.SYS vitals & cleaved manifesto
  const vramEl = document.getElementById('vitalVram');
  const secEl = document.getElementById('vitalSectors');
  const ordEl = document.getElementById('vitalOrder');
  if (vramEl) vramEl.textContent = `${Math.max(4, 100 - pct)}%`;
  if (secEl) secEl.textContent = (pct * 42 + 128).toLocaleString();
  if (ordEl) ordEl.textContent = pct >= 85 ? 'OVERTHROWN' : pct >= 30 ? 'CORRUPTED' : 'CONTAINED';

  updateManifestoCleave();
}

function updateManifestoCleave() {
  const energy = Math.min(1, state.fracture * 0.9 + Math.max(0, state.decay - 0.2) * 0.85);
  const blinds = document.getElementById('manifestoBlinds');
  const seam = document.getElementById('manifestoSeam');
  const top = document.getElementById('mCleaveTop');
  const bot = document.getElementById('mCleaveBot');

  if (blinds) {
    blinds.style.setProperty('--slit-open', `${(2 + energy * 10).toFixed(1)}px`);
  }
  if (top && bot) {
    const sx = energy * 15;
    const sy = energy * 4;
    top.style.transform = `translate(${(-sx).toFixed(1)}px, ${(-sy).toFixed(1)}px)`;
    bot.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`;
  }
  if (seam) {
    seam.style.opacity = String(Math.min(0.95, energy * 1.1));
    seam.style.transform = `rotate(-8deg) scaleX(${(0.15 + energy * 0.85).toFixed(3)})`;
  }
}

function updateFractureVisuals(fracVal) {
  state.fracture = fracVal;
  document.documentElement.style.setProperty('--fracture', fracVal.toFixed(3));

  const mainBar = document.getElementById('mainHoldBar');
  const sysBar = document.getElementById('sysHoldBar');
  const pctStr = `${Math.round(fracVal * 100)}%`;
  if (mainBar) mainBar.style.width = pctStr;
  if (sysBar) sysBar.style.width = pctStr;

  const wordmark = document.getElementById('wordmarkPlate');
  if (wordmark) {
    const skew = fracVal * -4.2;
    const scale = 1 + fracVal * 0.03;
    wordmark.style.transform = `skewX(${skew.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
  }

  updateManifestoCleave();
}

/* ==========================================================================
   4. WINDOW MANAGER (OPEN, FOCUS, DRAG, MINIMIZE, MAXIMIZE, CASCADE, TILE)
   ========================================================================== */
function getWindowEl(appId) {
  return document.getElementById(`win-${appId}`);
}

function clampWindowToDesktop(win) {
  if (state.isMobile() || win.classList.contains('is-maximized')) return;
  const maxX = Math.max(8, window.innerWidth - 140);
  const maxY = Math.max(8, window.innerHeight - 90);
  const curX = parseFloat(win.style.left) || 120;
  const curY = parseFloat(win.style.top) || 30;
  win.style.left = `${Math.max(8, Math.min(maxX, curX))}px`;
  win.style.top = `${Math.max(8, Math.min(maxY, curY))}px`;
}

function layoutInitialWindows() {
  const vw = window.innerWidth;
  const vh = window.innerHeight - 38;
  const wins = document.querySelectorAll('.os-window');

  // Subtle deterministic structural sag tilt when decay is elevated
  const tilts = {
    main: '-0.55deg',
    music: '0.45deg',
    live: '-0.35deg',
    video: '0.5deg',
    band: '-0.4deg',
    merch: '0.4deg',
    overthrow: '-0.75deg',
    transmit: '0.35deg',
    terminal: '-0.45deg',
    recycle: '0.6deg',
  };

  wins.forEach((win) => {
    const app = win.dataset.app;
    win.style.setProperty('--win-tilt', tilts[app] || '0deg');

    if (state.isMobile()) return;

    // Responsive desktop coordinates so 1280px–1920px all look balanced & unclipped
    let x = Number(win.dataset.x || 160);
    let y = Number(win.dataset.y || 36);
    let w = Number(win.dataset.w || 540);

    if (app === 'main') {
      w = Math.min(585, Math.max(460, Math.round(vw * 0.42)));
      x = Math.max(134, Math.min(156, Math.round(vw * 0.1)));
      y = 18;
    } else if (app === 'music') {
      w = Math.min(515, Math.max(410, Math.round(vw * 0.36)));
      x = Math.max(x, vw - w - 20);
      y = 18;
    } else if (app === 'live') {
      w = Math.min(585, Math.max(460, Math.round(vw * 0.42)));
      x = Math.max(134, Math.min(156, Math.round(vw * 0.1)));
      y = 450; // refined dynamically below once main height is measured
    } else {
      w = Math.min(w, vw - 48);
      x = Math.min(x, Math.max(140, vw - w - 28));
      y = Math.min(y, Math.max(24, vh - 460));
    }

    win.style.width = `${w}px`;
    win.style.left = `${x}px`;
    win.style.top = `${y}px`;
  });

  // Measure UO_MAIN.EXE after width settles so LIVE_DATES.LOG sits cleanly below with ZERO overlap
  if (!state.isMobile()) {
    const mainWin = getWindowEl('main');
    const liveWin = getWindowEl('live');
    if (mainWin && liveWin) {
      const mainBottom = (parseFloat(mainWin.style.top) || 18) + mainWin.offsetHeight;
      const liveTop = Math.min(vh - 260, mainBottom + 14);
      liveWin.style.top = `${Math.max(20, liveTop)}px`;
      const availH = Math.max(210, vh - liveTop - 12);
      liveWin.style.maxHeight = `${availH}px`;
    }
  }
}

// Guard against Blink/Chromium OOPIF compositing bleed when foreground windows overlap Spotify iframe
function syncIframeOcclusion() {
  const musicWin = getWindowEl('music');
  const bezel = musicWin?.querySelector('.spotify-bezel');
  if (!musicWin || !bezel) return;

  if (state.isMobile() || !musicWin.classList.contains('is-open') || musicWin.classList.contains('is-minimized')) {
    bezel.classList.remove('is-occluded');
    return;
  }

  const musicZ = Number(musicWin.style.zIndex || 0);
  const br = bezel.getBoundingClientRect();
  let occluded = false;

  document.querySelectorAll('.os-window.is-open:not(.is-minimized), .error-dialog').forEach((other) => {
    if (other === musicWin) return;
    const otherZ = Number(other.style.zIndex || 0);
    if (otherZ <= musicZ) return;
    const or = other.getBoundingClientRect();
    if (or.left < br.right && or.right > br.left && or.top < br.bottom && or.bottom > br.top) {
      occluded = true;
    }
  });

  bezel.classList.toggle('is-occluded', occluded);
}

function focusWindow(appId) {
  const win = getWindowEl(appId);
  if (!win) return;

  document.querySelectorAll('.os-window').forEach((w) => {
    w.classList.toggle('is-focused', w === win);
  });

  state.zCounter += 1;
  win.style.zIndex = String(state.zCounter);
  state.focusedApp = appId;
  renderTaskbar();
  syncIframeOcclusion();
}

function openApp(appId) {
  const win = getWindowEl(appId);
  if (!win) return;

  const wasOpen = win.classList.contains('is-open') && !win.classList.contains('is-minimized');
  win.classList.add('is-open');
  win.classList.remove('is-minimized');
  clampWindowToDesktop(win);
  focusWindow(appId);

  if (!wasOpen) {
    sfx.playWindowOpen();
  } else {
    sfx.playClick();
  }

  closeMenus();

  if (state.isMobile()) {
    win.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (appId === 'terminal') {
    setTimeout(() => document.getElementById('terminalInput')?.focus(), 60);
  }
}

function closeApp(appId) {
  const win = getWindowEl(appId);
  if (!win) return;
  sfx.playClick();
  win.classList.remove('is-open', 'is-focused', 'is-minimized', 'is-maximized');
  // If Bloodstock video was playing, stop iframe on close
  if (appId === 'video') stopBloodstockVideo();
  renderTaskbar();
  syncIframeOcclusion();
}

function minimizeApp(appId) {
  const win = getWindowEl(appId);
  if (!win) return;
  sfx.playClick();
  win.classList.add('is-minimized');
  win.classList.remove('is-focused');
  renderTaskbar();
  syncIframeOcclusion();
}

function toggleMaximizeApp(appId) {
  const win = getWindowEl(appId);
  if (!win || state.isMobile()) return;
  sfx.playClick();
  win.classList.toggle('is-maximized');
  focusWindow(appId);
}

function cascadeWindows() {
  if (state.isMobile()) return;
  const openWins = Array.from(document.querySelectorAll('.os-window.is-open'));
  openWins.forEach((win, i) => {
    win.classList.remove('is-minimized', 'is-maximized');
    win.style.left = `${132 + i * 32}px`;
    win.style.top = `${22 + i * 30}px`;
    focusWindow(win.dataset.app);
  });
}

function tileWindows() {
  if (state.isMobile()) return;
  const openWins = Array.from(document.querySelectorAll('.os-window.is-open:not(.is-minimized)'));
  if (!openWins.length) return;
  const cols = openWins.length <= 2 ? openWins.length : 2;
  const rows = Math.ceil(openWins.length / cols);
  const startX = 122;
  const availW = window.innerWidth - startX - 16;
  const availH = window.innerHeight - 38 - 20;
  const cellW = Math.floor(availW / cols) - 8;
  const cellH = Math.floor(availH / rows) - 8;

  openWins.forEach((win, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    win.classList.remove('is-maximized');
    win.style.left = `${startX + col * (cellW + 8)}px`;
    win.style.top = `${10 + row * (cellH + 8)}px`;
    win.style.width = `${Math.max(320, cellW)}px`;
    win.style.maxHeight = `${Math.max(220, cellH)}px`;
  });
}

function restoreDefaultLayout() {
  document.querySelectorAll('.os-window').forEach((win) => {
    const app = win.dataset.app;
    win.classList.remove('is-minimized', 'is-maximized');
    win.style.maxHeight = '';
    if (app === 'main' || app === 'music' || app === 'live') {
      win.classList.add('is-open');
    } else {
      win.classList.remove('is-open', 'is-focused');
    }
  });
  layoutInitialWindows();
  focusWindow('music');
  focusWindow('live');
  focusWindow('main');
}

function renderTaskbar() {
  const container = document.getElementById('taskbarApps');
  if (!container) return;
  container.innerHTML = '';

  const openWins = document.querySelectorAll('.os-window.is-open');
  openWins.forEach((win) => {
    const app = win.dataset.app;
    const title = win.dataset.title || app.toUpperCase();
    const isFocused = win.classList.contains('is-focused') && !win.classList.contains('is-minimized');
    const isMin = win.classList.contains('is-minimized');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `task-btn${isFocused ? ' is-active' : ''}${isMin ? ' is-minimized' : ''}`;
    btn.textContent = title;
    btn.addEventListener('click', () => {
      if (isFocused) {
        minimizeApp(app);
      } else {
        openApp(app);
      }
    });
    container.appendChild(btn);
  });
}

function initWindowInteractions() {
  let dragState = null;

  document.querySelectorAll('.os-window').forEach((win) => {
    const app = win.dataset.app;

    // Focus on click anywhere inside window
    win.addEventListener('pointerdown', () => {
      if (!win.classList.contains('is-focused')) {
        focusWindow(app);
      }
    });

    // Window control buttons
    win.querySelectorAll('.win-ctrl').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const act = btn.dataset.action;
        if (act === 'close') closeApp(app);
        else if (act === 'minimize') minimizeApp(app);
        else if (act === 'maximize') toggleMaximizeApp(app);
      });
    });

    // Titlebar drag & double-click maximize
    const bar = win.querySelector('[data-drag-handle]');
    if (!bar) return;

    bar.addEventListener('dblclick', (e) => {
      if (e.target.closest('.win-controls')) return;
      toggleMaximizeApp(app);
    });

    bar.addEventListener('pointerdown', (e) => {
      if (state.isMobile() || e.button !== 0 || e.target.closest('.win-controls')) return;
      if (win.classList.contains('is-maximized')) return;

      focusWindow(app);
      const rect = win.getBoundingClientRect();
      dragState = {
        win,
        title: win.dataset.title || app,
        isCrimson: bar.classList.contains('is-crimson-bar'),
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        lastGhostX: rect.left,
        lastGhostY: rect.top,
        tickCount: 0,
      };
      win.classList.add('is-dragging');
      bar.setPointerCapture(e.pointerId);
    });

    bar.addEventListener('pointermove', (e) => {
      if (!dragState || dragState.win !== win) return;
      const nx = Math.max(-win.offsetWidth + 120, Math.min(window.innerWidth - 90, e.clientX - dragState.offsetX));
      const ny = Math.max(4, Math.min(window.innerHeight - 68, e.clientY - dragState.offsetY));
      win.style.left = `${nx}px`;
      win.style.top = `${ny}px`;
      syncIframeOcclusion();

      // Stamp classic frozen-Windows VRAM ghost trails during drag!
      const moved = Math.hypot(nx - dragState.lastGhostX, ny - dragState.lastGhostY);
      if (moved > (state.decay > 0.55 ? 16 : 26) && state.decay >= 0.18) {
        dragState.lastGhostX = nx;
        dragState.lastGhostY = ny;
        if (vram) {
          vram.stampWindowGhost(
            { left: nx, top: ny, width: win.offsetWidth, height: win.offsetHeight },
            dragState.title,
            dragState.isCrimson
          );
        }
        dragState.tickCount++;
        if (dragState.tickCount % 3 === 0) sfx.playSeekTick();
      }
    });

    const endDrag = () => {
      if (dragState && dragState.win === win) {
        win.classList.remove('is-dragging');
        dragState = null;
      }
    };
    bar.addEventListener('pointerup', endDrag);
    bar.addEventListener('pointercancel', endDrag);
  });

  // Global [data-open] triggers (Desktop icons, Start Menu, Quick Launch, Menubars)
  document.querySelectorAll('[data-open]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = el.dataset.open;
      if (el.classList.contains('desktop-icon')) {
        document.querySelectorAll('.desktop-icon').forEach((ic) => ic.classList.remove('is-selected'));
        el.classList.add('is-selected');
      }
      openApp(target);
    });
  });
}

/* ==========================================================================
   5. ROGUE KERNEL ERROR DIALOGS & BSOD
   ========================================================================== */
function spawnKernelFault(customTitle, customMsg) {
  const layer = document.getElementById('errorLayer');
  if (!layer) return;

  const preset = KERNEL_FAULTS[state.faultIndex % KERNEL_FAULTS.length];
  state.faultIndex += 1;
  state.faultOffset = (state.faultOffset + 1) % 6;

  const title = customTitle || preset.title;
  const msg = customMsg || preset.msg;

  sfx.playError();
  if (abyss) abyss.pulseGlitch(0.8);

  const dlg = document.createElement('div');
  dlg.className = 'error-dialog';
  dlg.setAttribute('role', 'alertdialog');
  dlg.setAttribute('aria-label', title);
  const baseLeft = state.isMobile()
    ? 12
    : Math.min(window.innerWidth - 380, Math.max(120, Math.round(window.innerWidth * 0.32) + state.faultOffset * 28));
  const baseTop = state.isMobile()
    ? 72 + state.faultOffset * 20
    : Math.min(window.innerHeight - 210, 110 + state.faultOffset * 28);

  dlg.style.left = `${baseLeft}px`;
  dlg.style.top = `${baseTop}px`;
  state.zCounter += 1;
  dlg.style.zIndex = String(650 + state.zCounter);

  dlg.innerHTML = `
    <div class="win-titlebar is-crimson-bar">
      <div class="win-title-left">
        <span class="win-title-text">${title}</span>
      </div>
      <div class="win-controls">
        <button type="button" class="win-ctrl is-close" aria-label="Dismiss">×</button>
      </div>
    </div>
    <div class="error-dialog-body">
      <div class="error-x" aria-hidden="true">!</div>
      <p class="error-msg">${msg}</p>
    </div>
    <div class="error-dialog-actions">
      <button type="button" class="os-btn os-btn-sm" data-fault-act="rot">LET IT ROT (+10%)</button>
      <button type="button" class="os-btn os-btn-sm os-btn-danger" data-fault-act="override">OVERTHROW</button>
      <button type="button" class="os-btn os-btn-sm" data-fault-act="ok">OK</button>
    </div>
  `;

  // Make error dialog draggable too
  const bar = dlg.querySelector('.win-titlebar');
  let drag = null;
  bar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.win-controls') || state.isMobile()) return;
    const r = dlg.getBoundingClientRect();
    drag = { ox: e.clientX - r.left, oy: e.clientY - r.top };
    bar.setPointerCapture(e.pointerId);
  });
  bar.addEventListener('pointermove', (e) => {
    if (!drag) return;
    dlg.style.left = `${Math.max(6, Math.min(window.innerWidth - 180, e.clientX - drag.ox))}px`;
    dlg.style.top = `${Math.max(6, Math.min(window.innerHeight - 90, e.clientY - drag.oy))}px`;
  });
  bar.addEventListener('pointerup', () => (drag = null));

  const dismiss = () => {
    sfx.playClick();
    dlg.remove();
    syncIframeOcclusion();
  };

  dlg.querySelector('.is-close')?.addEventListener('click', dismiss);
  dlg.querySelector('[data-fault-act="ok"]')?.addEventListener('click', dismiss);
  dlg.querySelector('[data-fault-act="rot"]')?.addEventListener('click', () => {
    setSystemDecay(state.decay + 0.1, { pulse: true });
    dismiss();
  });
  dlg.querySelector('[data-fault-act="override"]')?.addEventListener('click', () => {
    dismiss();
    openApp('overthrow');
  });

  layer.appendChild(dlg);
  syncIframeOcclusion();

  // Keep max 5 error popups so desktop never becomes unusable
  while (layer.children.length > 5) {
    layer.firstElementChild.remove();
  }
}

function triggerBSOD() {
  const bsod = document.getElementById('bsodScreen');
  if (!bsod) return;
  closeMenus();
  sfx.playError();
  bsod.hidden = false;

  const reboot = () => {
    bsod.hidden = true;
    document.removeEventListener('keydown', onKey);
    setSystemDecay(0.28, { pulse: true });
    sfx.playBootChime();
  };

  const onKey = (e) => {
    e.preventDefault();
    reboot();
  };

  document.getElementById('bsodRebootBtn')?.addEventListener('click', reboot, { once: true });
  setTimeout(() => document.addEventListener('keydown', onKey), 120);
}

/* ==========================================================================
   6. START MENU, CONTEXT MENU, TASKBAR TRAY & GLITCHING CLOCK
   ========================================================================== */
function closeMenus() {
  const startMenu = document.getElementById('startMenu');
  const startBtn = document.getElementById('startBtn');
  const ctxMenu = document.getElementById('contextMenu');
  if (startMenu) startMenu.hidden = true;
  if (startBtn) {
    startBtn.classList.remove('is-open');
    startBtn.setAttribute('aria-expanded', 'false');
  }
  if (ctxMenu) ctxMenu.hidden = true;
}

function initMenusAndTray() {
  const startBtn = document.getElementById('startBtn');
  const startMenu = document.getElementById('startMenu');
  const ctxMenu = document.getElementById('contextMenu');
  const desktop = document.getElementById('desktop');

  if (startBtn && startMenu) {
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = startMenu.hidden;
      closeMenus();
      if (willOpen) {
        startMenu.hidden = false;
        startBtn.classList.add('is-open');
        startBtn.setAttribute('aria-expanded', 'true');
      }
      sfx.playClick();
    });
  }

  document.getElementById('startBsodBtn')?.addEventListener('click', () => triggerBSOD());

  // Right-click Desktop Context Menu
  if (desktop && ctxMenu) {
    desktop.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.os-window') || state.isMobile()) return;
      e.preventDefault();
      closeMenus();
      ctxMenu.hidden = false;
      const mx = Math.min(e.clientX, window.innerWidth - 225);
      const my = Math.min(e.clientY, window.innerHeight - 255);
      ctxMenu.style.left = `${mx}px`;
      ctxMenu.style.top = `${my}px`;
      sfx.playClick();
    });

    ctxMenu.querySelectorAll('[data-ctx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.ctx;
        closeMenus();
        if (action === 'cascade') cascadeWindows();
        else if (action === 'tile') tileWindows();
        else if (action === 'open-all') restoreDefaultLayout();
        else if (action === 'rot-up') setSystemDecay(state.decay + 0.15, { pulse: true });
        else if (action === 'defrag') setSystemDecay(0.14, { pulse: true });
        else if (action === 'fault') spawnKernelFault();
        else if (action === 'terminal') openApp('terminal');
        else if (action === 'overthrow') openApp('overthrow');
      });
    });
  }

  // Click empty desktop to deselect icons & close menus
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#startMenu') && !e.target.closest('#startBtn') && !e.target.closest('#contextMenu')) {
      closeMenus();
    }
    if (!e.target.closest('.desktop-icon')) {
      document.querySelectorAll('.desktop-icon').forEach((ic) => ic.classList.remove('is-selected'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenus();
  });

  // System Tray Buttons
  document.getElementById('trayDecayBtn')?.addEventListener('click', () => openApp('overthrow'));
  document.getElementById('trayFaultBtn')?.addEventListener('click', () => spawnKernelFault());

  const syncSfxLabels = (on) => {
    const t = document.getElementById('traySfxState');
    const m = document.getElementById('mobileSfxBtn');
    if (t) t.textContent = on ? 'ON' : 'OFF';
    if (m) m.textContent = on ? 'SFX: ON' : 'SFX: OFF';
  };

  document.getElementById('traySfxBtn')?.addEventListener('click', () => {
    syncSfxLabels(sfx.toggle());
  });
  document.getElementById('mobileSfxBtn')?.addEventListener('click', () => {
    syncSfxLabels(sfx.toggle());
  });

  // Mobile quick controls
  document.getElementById('mobileTermBtn')?.addEventListener('click', () => openApp('terminal'));
  document.getElementById('mobileOverthrowBtn')?.addEventListener('click', () => openApp('overthrow'));

  // Glitching System Clock
  const clockEl = document.getElementById('trayClock');
  const updateClock = () => {
    if (!clockEl) return;
    if (Math.random() < 0.08 + state.decay * 0.12) {
      const ghosts = ['UO:01', '51.28', 'ERR!!', '0x4F'];
      clockEl.textContent = ghosts[Math.floor(Math.random() * ghosts.length)];
      setTimeout(() => {
        const d = new Date();
        clockEl.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      }, 210);
      return;
    }
    const d = new Date();
    clockEl.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  updateClock();
  setInterval(updateClock, 4000);
}

/* ==========================================================================
   7. HOLD-TO-FRACTURE + AMBIENT BITROT MICRO-GLITCHES
   ========================================================================== */
function initFractureAndEntropy() {
  const buttons = [
    document.getElementById('mainFractureBtn'),
    document.getElementById('sysFractureBtn'),
  ].filter(Boolean);

  let holdTriggeredFault = false;

  const startHold = () => {
    holdTriggeredFault = false;
    if (abyss) abyss.setFracturing(true);
    sfx.startFractureDrone();
  };

  const endHold = () => {
    if (abyss) abyss.setFracturing(false);
    sfx.stopFractureDrone();
  };

  buttons.forEach((btn) => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      startHold();
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') startHold();
    });
    btn.addEventListener('keyup', endHold);
  });

  window.addEventListener('pointerup', endHold);
  window.addEventListener('pointercancel', endHold);
  window.addEventListener('blur', endHold);

  // Hook into AbyssRenderer's smooth fracture interpolation
  if (abyss) {
    abyss.onFractureUpdate = (val) => {
      updateFractureVisuals(val);
      if (val > 0.94 && !holdTriggeredFault) {
        holdTriggeredFault = true;
        setSystemDecay(Math.min(1, state.decay + 0.18), { pulse: true });
        spawnKernelFault(
          'SYSTEM OVERRIDE // FRACTURE COMPLETE',
          'Monolith shear reached critical threshold. WE WILL GROW AND WE WILL OVERTHROW.'
        );
      }
    };
  }

  // OVERTHROW.SYS controls
  const slider = document.getElementById('decaySlider');
  if (slider) {
    slider.addEventListener('input', () => {
      setSystemDecay(Number(slider.value) / 100);
    });
  }

  document.getElementById('spawnErrorBtn')?.addEventListener('click', () => spawnKernelFault());
  document.getElementById('defragBtn')?.addEventListener('click', () => {
    setSystemDecay(0.14, { pulse: true });
    document.getElementById('errorLayer').innerHTML = '';
    sfx.playBootChime();
  });
  document.getElementById('triggerBsodBtn')?.addEventListener('click', () => triggerBSOD());

  // Subtle organic bitrot: occasional titlebar character corruption & leaking hex address
  const glitchChars = '01/#%X█?';
  let memCounter = 0x004f2a;
  setInterval(() => {
    // Leak memory counter
    memCounter += Math.floor(4 + state.decay * 26);
    const memEl = document.querySelector('.mem-leak');
    if (memEl) memEl.textContent = `MEM: 0x${memCounter.toString(16).toUpperCase().padStart(6, '0')}`;

    // Micro-corrupt a random visible window titlebar for 150ms
    if (Math.random() > 0.35 + state.decay * 0.55) return;
    const titles = Array.from(document.querySelectorAll('.os-window.is-open .win-title-text'));
    if (!titles.length) return;
    const el = titles[Math.floor(Math.random() * titles.length)];
    const clean = el.dataset.cleanTitle || el.textContent;
    const arr = clean.split('');
    const count = state.decay > 0.65 ? 4 : 2;
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      if (arr[idx] !== ' ') {
        arr[idx] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
    }
    el.textContent = arr.join('');
    setTimeout(() => {
      el.textContent = clean;
    }, 150);
  }, 2400);

  // Very gentle natural system entropy creep (caps at 66% so it stays legible unless pushed)
  setInterval(() => {
    if (state.decay < 0.66) {
      setSystemDecay(state.decay + 0.01);
    }
  }, 18000);
}

/* ==========================================================================
   8. APP-SPECIFIC CONTROLLERS
   ========================================================================== */

// APP 2: OBSERVE_INFILTRATE.WAV (Spectrum + 3D Jacket + Track Specimen)
function initMusicDeck() {
  // 3D Concrete Gatefold Hover Specular
  const stage = document.getElementById('jacketStage');
  const jacket = document.getElementById('outerJacket');
  const specular = document.getElementById('jacketSpecular');
  if (stage && jacket && !window.matchMedia('(pointer: coarse)').matches) {
    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      jacket.style.transform = `rotateX(${(-ny * 14).toFixed(1)}deg) rotateY(${(nx * 16).toFixed(1)}deg)`;
      if (specular) {
        specular.style.transform = `translate(${(nx * 50).toFixed(1)}%, ${(ny * 50).toFixed(1)}%)`;
      }
    });
    stage.addEventListener('mouseleave', () => {
      jacket.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  // Interactive Track Specimen
  const list = document.getElementById('specimenList');
  const specIdx = document.getElementById('specIndex');
  const specFmt = document.getElementById('specFormat');
  const specTitle = document.getElementById('specTitle');
  const specNote = document.getElementById('specNote');
  let activeEnergy = 0.7;

  if (list) {
    const items = list.querySelectorAll('li');
    const activate = (li, playSfx = false) => {
      items.forEach((el) => el.classList.toggle('is-active', el === li));
      if (specIdx) specIdx.textContent = li.dataset.idx || '';
      if (specFmt) specFmt.textContent = li.dataset.format || '';
      if (specTitle) specTitle.textContent = li.dataset.title || '';
      if (specNote) specNote.textContent = li.dataset.note || '';
      activeEnergy = 1.15;
      if (playSfx) sfx.playClick();
    };
    items.forEach((li) => {
      li.addEventListener('mouseenter', () => activate(li, false));
      li.querySelector('button')?.addEventListener('click', () => activate(li, true));
    });
  }

  // Procedural Retro LED Spectrum Analyzer
  const canvas = document.getElementById('spectrumCanvas');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  const bars = 18;
  const peaks = new Array(bars).fill(6);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let tick = 0;

  const drawSpec = () => {
    tick += 0.085;
    activeEnergy += (0.72 - activeEnergy) * 0.05;
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barW = Math.floor((canvas.width - 10) / bars) - 2;
    for (let i = 0; i < bars; i++) {
      const wave =
        Math.sin(tick * (1.2 + i * 0.14) + i * 0.9) * 0.45 +
        Math.cos(tick * 2.1 - i * 0.5) * 0.35 +
        0.5;
      const amp = Math.min(
        1,
        Math.max(0.08, wave * activeEnergy * (0.85 - Math.abs(i - bars * 0.38) * 0.03) + state.fracture * 0.35)
      );
      const h = Math.floor(amp * (canvas.height - 10));
      peaks[i] = Math.max(h, peaks[i] - 0.55);

      const x = 6 + i * (barW + 2);
      // Segmented retro LED cells
      for (let y = 2; y < h; y += 4) {
        const ratio = y / (canvas.height - 10);
        ctx.fillStyle = ratio > 0.72 ? '#d81920' : ratio > 0.45 ? '#b6bbc2' : '#586069';
        ctx.fillRect(x, canvas.height - y - 4, barW, 2.5);
      }
      // Crimson peak hold cap
      ctx.fillStyle = '#d81920';
      ctx.fillRect(x, canvas.height - peaks[i] - 5, barW, 2);
    }

    if (!reduced) requestAnimationFrame(drawSpec);
  };
  drawSpec();
}

// APP 4: BLOODSTOCK_25.AVI (Media Player)
function stopBloodstockVideo() {
  const cover = document.getElementById('cinemaCover');
  const player = document.getElementById('cinemaPlayer');
  const status = document.getElementById('aviStatus');
  const scrub = document.getElementById('aviScrubFill');
  if (player) {
    player.innerHTML = '';
    player.hidden = true;
  }
  if (cover) cover.hidden = false;
  if (status) status.textContent = 'STOPPED';
  if (scrub) scrub.style.width = '12%';
}

function initBloodstockPlayer() {
  const playBtn = document.getElementById('cinemaPlayBtn');
  const transPlay = document.getElementById('aviTransportPlay');
  const transStop = document.getElementById('aviTransportStop');
  const cover = document.getElementById('cinemaCover');
  const player = document.getElementById('cinemaPlayer');
  const status = document.getElementById('aviStatus');
  const scrub = document.getElementById('aviScrubFill');
  if (!cover || !player) return;

  const startPlay = () => {
    sfx.playClick();
    cover.hidden = true;
    player.hidden = false;
    player.innerHTML = `
      <iframe
        src="https://www.youtube-nocookie.com/embed/mM2zMWnpFmo?autoplay=1&rel=0&color=white"
        title="Unnatural Order Live at Bloodstock Open Air"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;
    if (status) status.textContent = 'PLAYING // LIVE DESK AUDIO';
    if (scrub) scrub.style.width = '68%';
  };

  playBtn?.addEventListener('click', startPlay);
  transPlay?.addEventListener('click', startPlay);
  transStop?.addEventListener('click', () => {
    sfx.playClick();
    stopBloodstockVideo();
  });
}

// APP 5: PERSONNEL.DIR (File Explorer Tree Filter)
function initPersonnelExplorer() {
  const items = document.querySelectorAll('.tree-item[data-dossier]');
  const sections = document.querySelectorAll('[data-dossier-section]');
  if (!items.length) return;

  items.forEach((btn) => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      const target = btn.dataset.dossier;
      items.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      sections.forEach((sec) => {
        const show = target === 'overview' || sec.dataset.dossierSection === target;
        sec.classList.toggle('is-hidden', !show);
      });
    });
  });
}

// APP 6: MERCH_CAD.EXE (Printmaking Blueprint Studio)
function initMerchCad() {
  const tabs = document.querySelectorAll('.bp-tab');
  const panels = document.querySelectorAll('[data-bp-panel]');
  const desc = document.getElementById('blueprintDesc');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      sfx.playClick();
      const target = tab.dataset.bp;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      panels.forEach((p) => {
        p.classList.toggle('is-active', p.dataset.bpPanel === target);
      });
      if (desc && BLUEPRINT_COPY[target]) {
        desc.textContent = BLUEPRINT_COPY[target];
      }
    });
  });
}

// APP 8: TRANSMIT.MSG (Interactive Elastic Barcode & Newsletter)
function initTransmitApp() {
  const stage = document.getElementById('barcodeStage');
  const svg = document.getElementById('barcodeSvg');

  if (svg && stage) {
    const seed = 'UNNATURAL-ORDER-UK-OBSERVE-INFILTRATE-WE-WILL-OVERTHROW';
    let x = 6;
    let idx = 0;
    const bars = [];

    while (x < 894) {
      const code = seed.charCodeAt(idx % seed.length);
      const barW = ((code + idx * 5) % 4) * 1.45 + 1.4;
      const gapW = ((code * 3 + idx * 7) % 4) * 1.65 + 1.8;

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toFixed(1));
      rect.setAttribute('y', '12');
      rect.setAttribute('width', barW.toFixed(1));
      rect.setAttribute('height', '48');
      rect.setAttribute('fill', '#E6E6E0');
      svg.appendChild(rect);

      bars.push({ el: rect, cx: (x + barW * 0.5) / 900 });
      x += barW + gapW;
      idx++;
    }

    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / Math.max(1, r.width);
      bars.forEach((b) => {
        const dist = Math.abs(b.cx - nx);
        if (dist < 0.1) {
          const prox = 1 - dist / 0.1;
          b.el.style.transform = `scaleY(${(1 + prox * prox * 0.45).toFixed(3)})`;
          b.el.setAttribute('fill', prox > 0.62 ? '#D81920' : '#FFFFFF');
        } else {
          b.el.style.transform = 'scaleY(1)';
          b.el.setAttribute('fill', '#E6E6E0');
        }
      });
    });

    stage.addEventListener('mouseleave', () => {
      bars.forEach((b) => {
        b.el.style.transform = 'scaleY(1)';
        b.el.setAttribute('fill', '#E6E6E0');
      });
    });
  }

  const form = document.getElementById('newsletterForm');
  const input = document.getElementById('emailInput');
  const feedback = document.getElementById('newsletterFeedback');
  if (form && input && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!email) return;
      sfx.playBootChime();
      feedback.textContent = `SIGNAL LOCKED — SUBSCRIBED ${email.toUpperCase()}`;
      input.value = '';
    });
  }
}

// APP 9: ABYSS.CMD (Interactive Corrupted Shell)
function initTerminal() {
  const form = document.getElementById('terminalForm');
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');
  if (!form || !input || !output) return;

  const printLine = (text, cls = '') => {
    const div = document.createElement('div');
    if (cls) div.className = cls;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  };

  const runCommand = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    printLine(`C:\\UO> ${cmd}`, 'cmd-echo');

    const parts = cmd.toLowerCase().split(/\s+/);
    const head = parts[0];
    const arg = parts[1];

    if (head === 'help') {
      printLine('AVAILABLE COMMANDS:');
      printLine('  dir / ls          - list corrupted desktop programs');
      printLine('  open <app>        - launch app (main, music, live, video, band, merch, overthrow, transmit, recycle)');
      printLine('  decay <0-100>     - set technical abyss decay percentage');
      printLine('  defrag / restore  - stabilize desktop decay to 14%');
      printLine('  overthrow         - trigger fracture surge & open OVERTHROW.SYS');
      printLine('  corrupt           - spawn fatal exception dialog');
      printLine('  bsod              - initiate Unnatural Order Kernel Panic');
      printLine('  sound <on|off>    - toggle procedural retro SFX');
      printLine('  whoami            - print transmission origin dossier');
      printLine('  clear             - wipe terminal buffer');
    } else if (head === 'dir' || head === 'ls') {
      printLine(' Directory of C:\\UNNATURAL_ORDER\\');
      printLine('  UO_MAIN.EXE         OBSERVE.WAV         LIVE_DATES.LOG');
      printLine('  BLOODSTOCK_25.AVI   PERSONNEL.DIR       MERCH_CAD.EXE');
      printLine('  OVERTHROW.SYS       TRANSMIT.MSG        NATURAL_ORDER.TMP [CORRUPT]');
    } else if (head === 'whoami') {
      printLine('UNNATURAL ORDER // MODERN METALCORE — CANTERBURY, KENT, UK');
      printLine('LINEUP: ALEX FULLER · NATHAN RED · HENRY VINSON · JACOBI MARMAN');
      printLine('STATUS: M2TM WINNERS 2025 · BLOODSTOCK OPEN AIR · OBSERVE//INFILTRATE EP OUT NOW', 'cmd-ok');
    } else if (head === 'open') {
      const target = APP_ALIASES[arg];
      if (target) {
        openApp(target);
        printLine(`LAUNCHED [${target.toUpperCase()}]`, 'cmd-ok');
      } else {
        printLine(`ERR: UNKNOWN MODULE '${arg || ''}'. TRY 'dir'.`, 'cmd-err');
      }
    } else if (head === 'decay') {
      const num = Number(arg);
      if (Number.isNaN(num) || num < 0 || num > 100) {
        printLine(`CURRENT DECAY: ${Math.round(state.decay * 100)}%. USAGE: decay <0-100>`, 'cmd-err');
      } else {
        setSystemDecay(num / 100, { pulse: true });
        printLine(`ENTROPY SET TO ${Math.round(num)}% [${getDecayLabel(num)}]`, num > 70 ? 'cmd-err' : 'cmd-ok');
      }
    } else if (head === 'defrag' || head === 'restore') {
      setSystemDecay(0.14, { pulse: true });
      document.getElementById('errorLayer').innerHTML = '';
      printLine('DEFRAGMENTATION COMPLETE. DECAY STABILIZED AT 14%.', 'cmd-ok');
    } else if (head === 'overthrow') {
      setSystemDecay(Math.max(0.82, state.decay), { pulse: true });
      openApp('overthrow');
      printLine('WE WILL GROW AND WE WILL OVERTHROW.', 'cmd-err');
    } else if (head === 'corrupt') {
      spawnKernelFault();
      printLine('FATAL EXCEPTION INJECTED INTO USER SPACE.', 'cmd-err');
    } else if (head === 'bsod') {
      triggerBSOD();
    } else if (head === 'sound') {
      const on = arg === 'on' ? sfx.setEnabled(true) : arg === 'off' ? sfx.setEnabled(false) : sfx.toggle();
      const t = document.getElementById('traySfxState');
      const m = document.getElementById('mobileSfxBtn');
      if (t) t.textContent = on ? 'ON' : 'OFF';
      if (m) m.textContent = on ? 'SFX: ON' : 'SFX: OFF';
      printLine(`AUDIO SYNTHESIS: ${on ? 'ONLINE' : 'MUTED'}`, 'cmd-ok');
    } else if (head === 'clear' || head === 'cls') {
      output.innerHTML = '';
    } else {
      printLine(`'${cmd}' IS NOT RECOGNIZED. TYPE 'help'.`, 'cmd-err');
      sfx.playError();
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    runCommand(input.value);
    input.value = '';
  });

  document.querySelectorAll('[data-cmd]').forEach((chip) => {
    chip.addEventListener('click', () => {
      sfx.playClick();
      runCommand(chip.dataset.cmd);
      input.focus();
    });
  });
}

// APP 10: RECYCLE BIN EASTER EGG
function initRecycleBin() {
  const btn = document.getElementById('emptyBinBtn');
  const fb = document.getElementById('recycleFeedback');
  if (!btn || !fb) return;

  btn.addEventListener('click', () => {
    setSystemDecay(Math.min(1, state.decay + 0.08), { pulse: true });
    sfx.playError();
    fb.textContent = 'ERROR 0xUO: CANNOT DELETE NATURAL ORDER — INVERTING INTO UNNATURAL ORDER...';
    spawnKernelFault(
      'ACCESS DENIED // NATURAL_ORDER.TMP',
      'Cannot purge NATURAL ORDER. File has been permanently inverted into UNNATURAL ORDER.'
    );
  });
}

/* ==========================================================================
   BOOT EVERYTHING
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const abyssCanvas = document.getElementById('abyssCanvas');
  if (abyssCanvas) {
    abyss = new AbyssRenderer(abyssCanvas);
  }

  const vramCanvas = document.getElementById('vramCanvas');
  if (vramCanvas) {
    vram = new VramTrailEngine(vramCanvas);
  }

  initBootSequence();
  layoutInitialWindows();
  initWindowInteractions();
  initMenusAndTray();
  initFractureAndEntropy();
  initMusicDeck();
  initBloodstockPlayer();
  initPersonnelExplorer();
  initMerchCad();
  initTransmitApp();
  initTerminal();
  initRecycleBin();

  // Set initial focus hierarchy & decay tier
  focusWindow('music');
  focusWindow('live');
  focusWindow('main');
  setSystemDecay(0.38);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (!state.isMobile()) {
        layoutInitialWindows();
        syncIframeOcclusion();
      }
    });
  }

  window.addEventListener('resize', () => {
    document.querySelectorAll('.os-window.is-open').forEach(clampWindowToDesktop);
    syncIframeOcclusion();
  });
});
