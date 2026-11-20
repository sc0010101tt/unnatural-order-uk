/**
 * UNNATURAL ORDER // Interactive Choreography Controller
 * Coordinates the WebGL Fluted-Glass Monolith, Hold-to-Fracture Physics,
 * 3D Specular Vinyl Gatefold, Scroll-Pinned Venetian Fracture Chamber,
 * Bloodstock Cinema Curtain, Blueprint Studio, and Elastic Barcode.
 */

import { WebGLAperture } from './webgl-aperture.js';

const BLUEPRINT_COPY = {
  front:
    'Oversized heavyweight black tees & hoodies printed with the UNNATURAL ORDER wordmark across the chest.',
  back:
    'Full-back distressed U/O monolith screenprint paired with OBSERVE//INFILTRATE transmission typography.',
  tin:
    'Brushed raw-steel hinged pocket tin and matte-black U/O custom picks crafted alongside @thepickshouse.',
};

/* ==========================================================================
   1. WEBGL FLUTED-GLASS MONOLITH & HOLD-TO-FRACTURE INTERACTION
   ========================================================================== */
function initHeroAperture() {
  const canvas = document.getElementById('apertureCanvas');
  const hero = document.getElementById('heroSection');
  const holdBtn = document.getElementById('fractureHoldBtn');
  const ringProg = document.getElementById('holdRingProgress');
  const wordmarkPlate = document.getElementById('wordmarkPlate');
  if (!canvas || !hero) return null;

  const CIRCUMFERENCE = 2 * Math.PI * 15; // r = 15

  const aperture = new WebGLAperture(canvas, (fractureVal) => {
    if (ringProg) {
      ringProg.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - fractureVal));
    }
    if (wordmarkPlate) {
      const skew = fractureVal * -3.5;
      const trackScale = 1 + fractureVal * 0.025;
      wordmarkPlate.style.transform = `skewX(${skew.toFixed(2)}deg) scale(${trackScale.toFixed(3)})`;
    }
  });

  const startHold = () => aperture.setHolding(true);
  const endHold = () => aperture.setHolding(false);

  if (holdBtn) {
    holdBtn.addEventListener('pointerdown', startHold);
    holdBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') startHold();
    });
    holdBtn.addEventListener('keyup', endHold);
  }

  // Pressing & holding anywhere on the hero canvas (not on a link) also fractures the monolith
  hero.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a')) return;
    startHold();
  });
  window.addEventListener('pointerup', endHold);
  window.addEventListener('pointercancel', endHold);
  window.addEventListener('blur', endHold);

  return aperture;
}

/* ==========================================================================
   2. 3D SPECULAR-LIT CONCRETE VINYL GATEFOLD
   ========================================================================== */
function initVinylGatefold() {
  const stage = document.getElementById('jacketStage');
  const jacket = document.getElementById('outerJacket');
  const specular = document.getElementById('jacketSpecular');
  if (!stage || !jacket || window.matchMedia('(pointer: coarse)').matches) return;

  stage.addEventListener('mousemove', (e) => {
    const r = stage.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;

    const rotY = nx * 13;
    const rotX = -ny * 11;
    jacket.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

    if (specular) {
      specular.style.transform = `translate(${(nx * 55).toFixed(1)}%, ${(ny * 55).toFixed(1)}%)`;
    }
  });

  stage.addEventListener('mouseleave', () => {
    jacket.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* ==========================================================================
   3. INTERACTIVE TYPOGRAPHIC TRACK SPECIMEN
   ========================================================================== */
function initTrackSpecimen() {
  const list = document.getElementById('specimenList');
  const specIdx = document.getElementById('specIndex');
  const specFmt = document.getElementById('specFormat');
  const specTitle = document.getElementById('specTitle');
  const specNote = document.getElementById('specNote');
  if (!list) return;

  const items = list.querySelectorAll('li');
  const activate = (li) => {
    items.forEach((el) => el.classList.toggle('is-active', el === li));
    if (specIdx) specIdx.textContent = li.dataset.idx || '';
    if (specFmt) specFmt.textContent = li.dataset.format || '';
    if (specTitle) specTitle.textContent = li.dataset.title || '';
    if (specNote) specNote.textContent = li.dataset.note || '';
  };

  items.forEach((li) => {
    li.addEventListener('mouseenter', () => activate(li));
    li.querySelector('button')?.addEventListener('click', () => activate(li));
  });
}

/* ==========================================================================
   4. BLOODSTOCK CINEMA CURTAIN (LAZY-LOADS REAL LIVE FOOTAGE ON CLICK)
   ========================================================================== */
function initBloodstockCinema() {
  const playBtn = document.getElementById('cinemaPlayBtn');
  const cover = document.getElementById('cinemaCover');
  const player = document.getElementById('cinemaPlayer');
  if (!playBtn || !cover || !player) return;

  playBtn.addEventListener('click', () => {
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
  });
}

/* ==========================================================================
   5. SCROLL-PINNED VENETIAN-BLIND FRACTURE CHAMBER + SPINE TELEMETRY
   ========================================================================== */
function initScrollChoreography(aperture) {
  const hero = document.getElementById('heroSection');
  const heroStage = document.getElementById('heroStage');

  const chamber = document.getElementById('fracture');
  const blinds = document.getElementById('fractureBlinds');
  const seam = document.getElementById('fractureSeam');
  const line1 = document.getElementById('fLine1');
  const line2 = document.getElementById('fLine2');
  const cleaveTop = document.getElementById('fCleaveTop');
  const cleaveBot = document.getElementById('fCleaveBot');

  const spineAct = document.getElementById('spineAct');
  const spineProg = document.getElementById('spineProgress');
  const actSections = document.querySelectorAll('[data-act]');

  const update = () => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    const totalPct = Math.min(1, Math.max(0, scrollY / maxScroll));

    if (spineProg) {
      spineProg.textContent = `${String(Math.round(totalPct * 100)).padStart(2, '0')}%`;
    }

    // Update current Act label on right spine
    if (spineAct) {
      let current = '00 / MONOLITH';
      actSections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= vh * 0.45) {
          current = sec.dataset.act || current;
        }
      });
      spineAct.textContent = current;
    }

    // Hero scroll parallax & monolith scroll fracture
    if (hero) {
      const heroProg = Math.min(1, Math.max(0, scrollY / Math.max(1, hero.offsetHeight)));
      if (aperture) aperture.setScrollProgress(heroProg);
      if (heroStage) {
        heroStage.style.transform = `translateY(${(heroProg * -48).toFixed(1)}px)`;
        heroStage.style.opacity = String(Math.max(0, 1 - heroProg * 1.35));
      }
    }

    // Pinned Venetian-Blind Fracture Chamber
    if (chamber) {
      const rect = chamber.getBoundingClientRect();
      const travel = Math.max(1, chamber.offsetHeight - vh);
      const p = Math.min(1, Math.max(0, -rect.top / travel));

      // Progressively widen venetian blind slits from 1px -> 14px
      if (blinds) {
        const slitPx = 1 + p * 13;
        blinds.style.setProperty('--slit-open', `${slitPx.toFixed(1)}px`);
      }

      // Staggered typographic arrival
      if (line1) {
        const a1 = Math.min(1, p / 0.28);
        line1.style.opacity = String(0.18 + a1 * 0.82);
        line1.style.transform = `translateY(${((1 - a1) * 26).toFixed(1)}px)`;
      }
      if (line2) {
        const a2 = Math.min(1, Math.max(0, (p - 0.16) / 0.28));
        line2.style.opacity = String(0.14 + a2 * 0.86);
        line2.style.transform = `translateY(${((1 - a2) * 28).toFixed(1)}px)`;
      }

      // Diagonal fracture cleave of "OVERTHROW" from p = 0.42 -> 1.0
      const cleaveP = Math.min(1, Math.max(0, (p - 0.38) / 0.52));
      const easeCleave = 1 - Math.pow(1 - cleaveP, 3);
      if (cleaveTop && cleaveBot) {
        const shiftX = easeCleave * 24;
        const shiftY = easeCleave * 6;
        cleaveTop.style.transform = `translate(${(-shiftX).toFixed(1)}px, ${(-shiftY).toFixed(1)}px)`;
        cleaveBot.style.transform = `translate(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px)`;
      }
      if (seam) {
        seam.style.opacity = String(easeCleave * 0.85);
        seam.style.transform = `rotate(-16deg) scaleX(${(0.2 + easeCleave * 0.8).toFixed(3)})`;
      }
    }
  };

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    },
    { passive: true }
  );

  update();
}

/* ==========================================================================
   6. INTERACTIVE MERCH BLUEPRINT STUDIO
   ========================================================================== */
function initBlueprintStudio() {
  const tabs = document.querySelectorAll('.bp-tab');
  const panels = document.querySelectorAll('[data-bp-panel]');
  const desc = document.getElementById('blueprintDesc');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
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

/* ==========================================================================
   7. ELASTIC OPTICAL-COMB INTERACTIVE BARCODE & NEWSLETTER
   ========================================================================== */
function initInteractiveBarcode() {
  const stage = document.getElementById('barcodeStage');
  const svg = document.getElementById('barcodeSvg');
  if (!svg || !stage) return;

  const seed = 'UNNATURAL-ORDER-UK-OBSERVE-INFILTRATE-WE-WILL-OVERTHROW';
  let x = 6;
  let idx = 0;
  const bars = [];

  while (x < 1194) {
    const code = seed.charCodeAt(idx % seed.length);
    const barW = ((code + idx * 5) % 4) * 1.85 + 1.7;
    const gapW = ((code * 3 + idx * 7) % 4) * 2.1 + 2.1;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x.toFixed(1));
    rect.setAttribute('y', '12');
    rect.setAttribute('width', barW.toFixed(1));
    rect.setAttribute('height', '52');
    rect.setAttribute('fill', '#ECECE7');
    svg.appendChild(rect);

    bars.push({ el: rect, cx: (x + barW * 0.5) / 1200 });
    x += barW + gapW;
    idx++;
  }

  stage.addEventListener('mousemove', (e) => {
    const r = stage.getBoundingClientRect();
    const nx = (e.clientX - r.left) / Math.max(1, r.width);

    bars.forEach((b) => {
      const dist = Math.abs(b.cx - nx);
      if (dist < 0.095) {
        const prox = 1 - dist / 0.095;
        const scaleY = 1 + prox * prox * 0.42;
        b.el.style.transform = `scaleY(${scaleY.toFixed(3)})`;
        b.el.setAttribute('fill', prox > 0.65 ? '#D81920' : '#FFFFFF');
      } else {
        b.el.style.transform = 'scaleY(1)';
        b.el.setAttribute('fill', '#ECECE7');
      }
    });
  });

  stage.addEventListener('mouseleave', () => {
    bars.forEach((b) => {
      b.el.style.transform = 'scaleY(1)';
      b.el.setAttribute('fill', '#ECECE7');
    });
  });
}

function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const input = document.getElementById('emailInput');
  const feedback = document.getElementById('newsletterFeedback');
  if (!form || !input || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email) return;
    feedback.textContent = `SUBSCRIBED — ${email.toUpperCase()}`;
    input.value = '';
  });
}

/* ==========================================================================
   8. EDITORIAL REVEALS & MOBILE MENU
   ========================================================================== */
function initRevealsAndMenu() {
  const nodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    nodes.forEach((n) => obs.observe(n));
  } else {
    nodes.forEach((n) => n.classList.add('is-visible'));
  }

  const btn = document.getElementById('menuToggle');
  const sheet = document.getElementById('mobileSheet');
  if (!btn || !sheet) return;

  const setOpen = (open) => {
    btn.classList.toggle('is-open', open);
    sheet.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    sheet.setAttribute('aria-hidden', String(!open));
  };

  btn.addEventListener('click', () => setOpen(!sheet.classList.contains('is-open')));
  sheet.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
}

/* ==========================================================================
   INIT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const aperture = initHeroAperture();
  initVinylGatefold();
  initTrackSpecimen();
  initBloodstockCinema();
  initScrollChoreography(aperture);
  initBlueprintStudio();
  initInteractiveBarcode();
  initNewsletter();
  initRevealsAndMenu();
});
