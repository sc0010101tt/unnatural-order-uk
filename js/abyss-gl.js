/**
 * UNNATURAL ORDER // UO_OS v0.93 — WebGL Decaying Desktop & Technical Abyss Engine
 * Renders an authentic late-90s dithered oxidized-teal workstation desktop skin
 * actively delaminating via jagged pixel-block bitrot into a deep technical abyss:
 * wireframe data strata, falling hex bit-rain, fluted darkroom refraction, and the
 * analytical 4-bar diagonally-sliced U/O monolith shearing with dried-crimson light.
 */

const VERTEX_SRC = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;
uniform float uDecay;      // 0.0 -> 1.0 global system decay
uniform float uFracture;   // 0.0 -> 1.0 active overthrow fracture
uniform float uVelocity;   // pointer / drag energy
uniform float uGlitch;     // transient sync-tear shockwave

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.03 + vec2(11.7, 8.3);
    a *= 0.5;
  }
  return v;
}

// 4x4 ordered Bayer dithering threshold
float bayer4(vec2 px) {
  vec2 c = mod(floor(px), 4.0);
  int x = int(c.x);
  int y = int(c.y);
  int idx = y * 4 + x;
  if (idx == 0) return 0.0 / 16.0;
  if (idx == 1) return 8.0 / 16.0;
  if (idx == 2) return 2.0 / 16.0;
  if (idx == 3) return 10.0 / 16.0;
  if (idx == 4) return 12.0 / 16.0;
  if (idx == 5) return 4.0 / 16.0;
  if (idx == 6) return 14.0 / 16.0;
  if (idx == 7) return 6.0 / 16.0;
  if (idx == 8) return 3.0 / 16.0;
  if (idx == 9) return 11.0 / 16.0;
  if (idx == 10) return 1.0 / 16.0;
  if (idx == 11) return 9.0 / 16.0;
  if (idx == 12) return 15.0 / 16.0;
  if (idx == 13) return 7.0 / 16.0;
  if (idx == 14) return 13.0 / 16.0;
  return 5.0 / 16.0;
}

float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// Exact 4-bar diagonally-sliced U/O Monolith SDF
float sdMonolith(vec2 p, float fracture) {
  float cutLine = p.y - (p.x * 0.62 - 0.085);
  float cutHalfWidth = 0.022 + fracture * 0.044;

  vec2 diagDir = normalize(vec2(1.0, 0.62));
  vec2 q = p;
  if (cutLine > 0.0) {
    q -= diagDir * fracture * 0.11;
  } else {
    q += diagDir * fracture * 0.11;
  }

  float dOuterL = sdBox(q - vec2(-0.245, 0.0), vec2(0.032, 0.42));
  float chamLTop = (q.y - (q.x + 0.245) - 0.39);
  float chamLBot = (-q.y - (q.x + 0.245) - 0.39);
  dOuterL = max(dOuterL, max(chamLTop, chamLBot) * 0.707);

  float dOuterR = sdBox(q - vec2(0.245, 0.0), vec2(0.032, 0.42));
  float chamRTop = (q.y + (q.x - 0.245) - 0.39);
  float chamRBot = (-q.y + (q.x - 0.245) - 0.39);
  dOuterR = max(dOuterR, max(chamRTop, chamRBot) * 0.707);

  float dStemL = sdBox(q - vec2(-0.102, 0.10), vec2(0.036, 0.46));
  float dStemR = sdBox(q - vec2(0.102, 0.10), vec2(0.036, 0.46));

  vec2 pu = q - vec2(0.0, -0.36);
  float dArc = abs(length(pu) - 0.102) - 0.036;
  dArc = max(dArc, pu.y);

  float dInner = min(min(dStemL, dStemR), dArc);
  float topCutL = (q.y - (q.x + 0.102) - 0.54) * 0.707;
  float topCutR = (q.y + (q.x - 0.102) - 0.54) * 0.707;
  dInner = max(dInner, max(topCutL, topCutR));

  float qCut = abs(q.y - (q.x * 0.62 - 0.085));
  float dSlash = -(qCut - cutHalfWidth);
  dInner = max(dInner, dSlash);

  return min(min(dOuterL, dOuterR), dInner);
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 uv = vUv;
  float aspect = uResolution.x / max(1.0, uResolution.y);

  // Subtle horizontal CRT sync tear when glitch or high decay fires
  float rowBlock = floor(uv.y * 46.0);
  float tearRnd = hash21(vec2(rowBlock, floor(uTime * 9.0)));
  float tearChance = smoothstep(0.96 - uDecay * 0.10 - uGlitch * 0.45, 1.0, tearRnd);
  float tearShift = (hash21(vec2(rowBlock + 7.1, floor(uTime * 14.0))) - 0.5) * 0.045 * tearChance * (uDecay + uGlitch);
  vec2 uvTorn = vec2(uv.x + tearShift, uv.y);

  vec2 p = (uvTorn - 0.5) * vec2(aspect, 1.0);
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);
  float cursorDist = length(p - m);

  // =========================================================================
  // LAYER 1: OLD CORRODED DESKTOP SURFACE (GHOST OF WIN95/NT WORKSTATION)
  // =========================================================================
  float bayer = bayer4(px * 0.5);
  // Cold dead oxidized slate-teal desktop bitmap with subtle 2px checkerboard dither
  vec2 check = mod(floor(px * 0.5), 2.0);
  float checker = mod(check.x + check.y, 2.0);
  vec3 deadTealA = vec3(0.086, 0.118, 0.126);
  vec3 deadTealB = vec3(0.072, 0.098, 0.106);
  vec3 desktopCol = mix(deadTealA, deadTealB, checker);

  // Subtle corporate OS blueprint grid etched onto wallpaper
  vec2 gridPx = mod(px, 32.0);
  float minorGrid = (step(gridPx.x, 1.0) + step(gridPx.y, 1.0)) * 0.025;
  vec2 majorPx = mod(px, 128.0);
  float majorGrid = (step(majorPx.x, 1.0) + step(majorPx.y, 1.0)) * 0.045;
  desktopCol += vec3(0.18, 0.24, 0.25) * (minorGrid + majorGrid);

  // Oxidation & moisture water-damage staining across old screen surface
  float stain = fbm(p * 2.4 + vec2(3.1, 1.7));
  desktopCol *= 0.82 + stain * 0.34;

  // Quantized dither bands around pointer (like 16-color VGA degradation)
  float vgaGlow = exp(-cursorDist * 3.2) * 0.09;
  desktopCol += vec3(0.14, 0.19, 0.20) * step(bayer, vgaGlow * 3.5) * 0.28;

  // =========================================================================
  // LAYER 2: THE TECHNICAL ABYSS (EXPOSED BENEATH THE ROTTING DESKTOP SKIN)
  // =========================================================================
  // Perspective abyssal wireframe pit receding infinitely toward center
  vec2 abyssP = p;
  float depthZ = 0.22 / (max(0.04, abs(abyssP.y * 0.85) + abs(abyssP.x * 0.38)));
  float scrollZ = depthZ + uTime * (0.45 + uDecay * 0.65);
  float strata = smoothstep(0.92, 0.99, fract(scrollZ * 0.75)) * smoothstep(0.06, 0.6, length(abyssP));
  float radial = smoothstep(0.95, 0.995, abs(sin(atan(abyssP.y, abyssP.x) * 14.0))) * smoothstep(0.12, 0.9, length(abyssP));

  // Falling quantized bit-rain data columns deep inside the abyss
  float colX = floor(uvTorn.x * 110.0);
  float colSpeed = 0.4 + hash21(vec2(colX, 3.7)) * 1.4;
  float colDrop = fract(uvTorn.y * 16.0 + uTime * colSpeed + hash21(vec2(colX, 9.1)) * 12.0);
  float bitFlicker = step(0.52, hash21(vec2(colX, floor(uvTorn.y * 55.0 + uTime * 3.0))));
  float dataRain = smoothstep(0.86, 1.0, colDrop) * bitFlicker * step(0.62, hash21(vec2(colX, 1.2)));

  // Fluted architectural glass ribs inside the abyss chamber
  float ribPhase = uvTorn.x * 46.0;
  float ribFract = fract(ribPhase) - 0.5;
  float refractX = ribFract * 0.011 * (0.35 + uDecay * 0.65 + uVelocity * 0.3);
  float ribSpec = pow(max(0.0, 1.0 - abs(ribFract) * 2.1), 5.0);

  // Monumental 4-bar U/O Monolith SDF looming inside the abyss
  float isPortrait = smoothstep(0.95, 0.58, aspect);
  float monoScale = mix(1.42, 1.98, isPortrait);
  float fracAmt = clamp(uFracture + uDecay * 0.42, 0.0, 1.0);
  vec2 mp = (p + vec2(refractX, 0.0)) * monoScale;

  float dCenter = sdMonolith(mp, fracAmt);
  float disp = 0.0028 + fracAmt * 0.009 + uGlitch * 0.012;
  float dR = sdMonolith(mp + vec2(disp, 0.0), fracAmt);
  float dB = sdMonolith(mp - vec2(disp, 0.0), fracAmt);

  float aa = 2.4 / max(1.0, uResolution.y);
  float maskC = smoothstep(aa, -aa, dCenter);
  float maskR = smoothstep(aa, -aa, dR);
  float maskB = smoothstep(aa, -aa, dB);

  // Horizontal halftone pixel-dissolve bleed off the monolith
  float rowId = floor(uvTorn.y * uResolution.y * 0.35);
  float rowRand = hash21(vec2(rowId, floor(uTime * 2.2)));
  float bleedReach = (0.04 + rowRand * 0.14) * (0.4 + uDecay * 0.8 + uFracture * 1.1);
  float dBleed = sdMonolith(mp + vec2(bleedReach, 0.0), fracAmt);
  float halftoneDot = step(0.46, fract(uvTorn.x * uResolution.x * 0.18));
  float bleedMask = smoothstep(aa * 2.0, -aa, dBleed) * (1.0 - maskC) * halftoneDot * step(0.40, rowRand) * 0.30;

  // Abyssal concrete stone texture
  float stone = mix(fbm(p * 4.2 + uTime * 0.015), fbm(p * 18.0), 0.45);
  float slitLight = exp(-pow((p.x - m.x) * 2.4, 2.0)) * exp(-pow((p.y - m.y) * 1.8, 2.0));
  float ambientBeam = exp(-pow(p.x * 1.8, 2.0)) * 0.38;
  float lighting = 0.18 + ambientBeam + slitLight * 0.72;

  vec3 abyssCol = vec3(0.012, 0.013, 0.016) + vec3(stone * 0.042) * lighting;
  // Wireframe pit strata & faint crimson/ash data rain
  abyssCol += vec3(0.08, 0.10, 0.11) * (strata * 0.55 + radial * 0.22);
  abyssCol += mix(vec3(0.18, 0.22, 0.24), vec3(0.72, 0.08, 0.11), uDecay * 0.75 + uFracture * 0.5) * dataRain * 0.42;
  abyssCol += vec3(0.11, 0.11, 0.12) * ribSpec * (0.12 + slitLight * 0.55);

  // Monolith material + surgical dried-crimson fracture glow
  float bevel = smoothstep(-0.025, -0.002, dCenter) * maskC;
  vec3 monoTone = vec3(0.32, 0.33, 0.34) * (0.55 + stone * 0.45) * (0.55 + lighting * 0.65);
  monoTone += vec3(0.22) * bevel * (0.45 + slitLight);

  vec3 monoLayer = vec3(monoTone.r * maskR, monoTone.g * maskC, monoTone.b * maskB);
  float crimsonEnergy = clamp(uFracture * 0.95 + smoothstep(0.35, 1.0, uDecay) * 0.65, 0.0, 1.0);
  float diagVoid = smoothstep(0.075, 0.0, abs(mp.y - (mp.x * 0.62 - 0.085))) * smoothstep(0.36, 0.0, abs(mp.x));
  vec3 fractureLight = vec3(0.88, 0.09, 0.13) * diagVoid * crimsonEnergy * (0.55 + ribSpec * 0.75);
  monoLayer += vec3(0.62, 0.05, 0.07) * bevel * crimsonEnergy * 0.68;

  abyssCol = mix(abyssCol, monoLayer, max(maskC, max(maskR, maskB) * 0.5));
  abyssCol += vec3(0.62, 0.62, 0.60) * bleedMask * (0.5 + lighting * 0.55);
  abyssCol += fractureLight;

  // =========================================================================
  // LAYER 3: BLOCKY BITROT EROSION MASK (PEELS DESKTOP INTO THE ABYSS)
  // =========================================================================
  // Quantized pixel blocks so decay eats the desktop in stepped retro bitmap chunks!
  float blockSize = mix(10.0, 6.0, uDecay);
  vec2 qUv = floor(px / blockSize) * blockSize / uResolution;
  vec2 qP = (qUv - 0.5) * vec2(aspect, 1.0);

  float rotNoise = fbm(qP * 3.1 + vec2(0.0, uTime * 0.025));
  float fineRot = hash21(floor(px / 4.0) + floor(uTime * 0.4) * 0.0);

  // Decay eats in from:
  // 1) Center void (monolith breaching upward through the desktop)
  // 2) Bottom edge (abyss rising beneath the taskbar)
  // 3) Cursor magnet (peeling back the screen skin near the pointer)
  float centerBreach = smoothstep(0.95, 0.05, length(qP * vec2(0.95, 1.15)));
  float bottomPit = smoothstep(0.48, 0.0, qUv.y) * 0.95;
  float cornerRot = smoothstep(0.65, 1.15, length(qP)) * 0.45;
  float cursorPeel = smoothstep(0.32, 0.0, length(qP - m)) * (0.28 + uVelocity * 0.35 + uDecay * 0.25);

  float erosionField = rotNoise * 0.72 + fineRot * 0.14 + centerBreach * 0.52 + bottomPit * 0.48 + cornerRot + cursorPeel;
  // Threshold driven by uDecay + uFracture
  float threshold = 1.48 - (uDecay * 1.12 + uFracture * 0.55);

  // Crisp stepped erosion mask + glowing oxidized/crimson corrupted seam edge!
  float inAbyss = step(threshold, erosionField);
  float edgeBand = step(threshold - 0.055, erosionField) * (1.0 - inAbyss);
  float innerRim = step(threshold, erosionField) * (1.0 - step(threshold + 0.035, erosionField));

  // Dead corrupted VRAM artifact blocks randomly scattered along the fracture seam
  vec2 vramCell = floor(px / vec2(18.0, 6.0));
  float vramRnd = hash21(vramCell + floor(uTime * 1.8));
  float vramBlock = edgeBand * step(0.76 - uDecay * 0.22, vramRnd);

  vec3 col = mix(desktopCol, abyssCol, inAbyss);

  // Corroded oxidized rust / bevel tear edge along the boundary where GUI dies into abyss
  vec3 seamCol = mix(vec3(0.42, 0.34, 0.24), vec3(0.84, 0.10, 0.13), clamp(uDecay * 0.85 + uFracture, 0.0, 1.0));
  col = mix(col, seamCol * (0.55 + bayer * 0.45), edgeBand * 0.55);
  col += vec3(0.02, 0.02, 0.03) * innerRim;
  // Occasional bright corrupted RGB memory artifacts along the rotting edge
  vec3 artifactCol = mix(vec3(0.85, 0.12, 0.15), vec3(0.86, 0.88, 0.84), step(0.5, hash21(vramCell + 4.1)));
  col = mix(col, artifactCol, vramBlock * 0.72);

  // Subtle CRT scanline mask & phosphor vignette
  float scan = 0.94 + 0.06 * sin(px.y * 3.14159);
  col *= scan;

  float vig = smoothstep(1.38, 0.35, length(p * vec2(0.82, 1.02)));
  col *= mix(0.45, 1.0, vig);

  // Fine darkroom static grain
  float grain = (hash21(px + fract(uTime * 23.0) * 100.0) - 0.5) * (0.024 + uDecay * 0.028);
  col = max(vec3(0.0), col + grain);

  gl_FragColor = vec4(col, 1.0);
}
`;

export class AbyssRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });

    this.mouse = { x: 0.5, y: 0.5 };
    this.targetMouse = { x: 0.5, y: 0.5 };
    this.velocity = 0;
    this.decay = 0.38;
    this.targetDecay = 0.38;
    this.fracture = 0;
    this.isFracturing = false;
    this.glitch = 0;
    this.startTime = performance.now();
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.onFractureUpdate = null;

    if (!this.gl) {
      this._fallback2D();
      return;
    }

    this._initGL();
    this._bindEvents();
    this.resize();
    this._loop();
  }

  _compile(type, src) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Abyss shader error:', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  _initGL() {
    const gl = this.gl;
    const vs = this._compile(gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = this._compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) {
      this.gl = null;
      this._fallback2D();
      return;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);
    this.program = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    this.u = {
      uResolution: gl.getUniformLocation(prog, 'uResolution'),
      uMouse: gl.getUniformLocation(prog, 'uMouse'),
      uTime: gl.getUniformLocation(prog, 'uTime'),
      uDecay: gl.getUniformLocation(prog, 'uDecay'),
      uFracture: gl.getUniformLocation(prog, 'uFracture'),
      uVelocity: gl.getUniformLocation(prog, 'uVelocity'),
      uGlitch: gl.getUniformLocation(prog, 'uGlitch'),
    };
  }

  setDecay(val) {
    this.targetDecay = Math.max(0, Math.min(1, val));
  }

  setFracturing(active) {
    this.isFracturing = Boolean(active);
  }

  pulseGlitch(strength = 0.85) {
    this.glitch = Math.max(this.glitch, Math.min(1, strength));
  }

  _bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener(
      'mousemove',
      (e) => {
        const nx = e.clientX / Math.max(1, window.innerWidth);
        const ny = 1.0 - e.clientY / Math.max(1, window.innerHeight);
        const dist = Math.hypot(nx - this.targetMouse.x, ny - this.targetMouse.y);
        this.velocity = Math.min(1.0, this.velocity + dist * 3.8);
        this.targetMouse.x = nx;
        this.targetMouse.y = ny;
      },
      { passive: true }
    );
  }

  resize() {
    if (!this.gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(320, Math.floor(window.innerWidth * dpr));
    const h = Math.max(320, Math.floor(window.innerHeight * dpr));
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
  }

  _loop() {
    if (!this.gl) return;
    const gl = this.gl;
    const t = this.reducedMotion ? 1.2 : (performance.now() - this.startTime) * 0.001;

    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.08;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.08;
    this.velocity *= 0.91;
    this.decay += (this.targetDecay - this.decay) * 0.06;
    this.glitch *= 0.89;

    const targetFrac = this.isFracturing ? 1.0 : 0.0;
    this.fracture += (targetFrac - this.fracture) * (this.isFracturing ? 0.06 : 0.085);
    if (this.onFractureUpdate) {
      this.onFractureUpdate(this.fracture);
    }

    gl.uniform2f(this.u.uResolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.u.uMouse, this.mouse.x, this.mouse.y);
    gl.uniform1f(this.u.uTime, t);
    gl.uniform1f(this.u.uDecay, this.decay);
    gl.uniform1f(this.u.uFracture, this.fracture);
    gl.uniform1f(this.u.uVelocity, this.velocity);
    gl.uniform1f(this.u.uGlitch, this.glitch);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(() => this._loop());
  }

  _fallback2D() {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f1416';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
