/**
 * UNNATURAL ORDER // WebGL GLSL Fluted-Glass & Concrete Optical Aperture
 * Analytical SDF of the 4-bar diagonally-sliced U/O monolith rendered through
 * procedural weathered concrete, vertical fluted architectural glass refraction,
 * halftone pixel-dissolve bleed, and interactive diagonal fracture physics.
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
uniform float uFracture;   // 0.0 -> 1.0 (hold-to-overthrow or scroll fracture)
uniform float uScroll;     // 0.0 -> 1.0 hero scroll progress
uniform float uVelocity;   // pointer/scroll motion energy

// Hash & 2D Value Noise for organic concrete + darkroom silver-halide grain
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.04 + vec2(13.1, 7.7);
    a *= 0.5;
  }
  return v;
}

// Signed Distance Function for a beveled axis-aligned box
float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// SDF for a 2D capsule / stadium segment
float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

/**
 * Analytical Signed Distance Field of Unnatural Order's 4-bar sliced U/O Monolith
 * Coordinates normalized around origin (0,0), height ~ [-0.62, 0.62], width ~ [-0.34, 0.34]
 */
float sdMonolith(vec2 p, float fracture) {
  // Exact diagonal cut plane passing through the inner stems (slope ~ 0.62)
  float cutLine = p.y - (p.x * 0.62 - 0.085);
  float cutHalfWidth = 0.022 + fracture * 0.038;

  // Physically shear upper & lower halves along the diagonal cut vector when fractured
  vec2 diagDir = normalize(vec2(1.0, 0.62));
  vec2 q = p;
  if (cutLine > 0.0) {
    q -= diagDir * fracture * 0.095;
  } else {
    q += diagDir * fracture * 0.095;
  }

  // 1. Outer-left beveled vertical bar
  float dOuterL = sdBox(q - vec2(-0.245, 0.0), vec2(0.032, 0.42));
  // 45-deg top/bottom chamfers on outer-left bar
  float chamLTop = (q.y - (q.x + 0.245) - 0.39);
  float chamLBot = (-q.y - (q.x + 0.245) - 0.39);
  dOuterL = max(dOuterL, max(chamLTop, chamLBot) * 0.707);

  // 2. Outer-right beveled vertical bar
  float dOuterR = sdBox(q - vec2(0.245, 0.0), vec2(0.032, 0.42));
  float chamRTop = (q.y + (q.x - 0.245) - 0.39);
  float chamRBot = (-q.y + (q.x - 0.245) - 0.39);
  dOuterR = max(dOuterR, max(chamRTop, chamRBot) * 0.707);

  // 3. Inner U-loop (two vertical stems joined by a curved bottom U)
  // Upper stems extend from y = -0.36 to y = +0.56
  float dStemL = sdBox(q - vec2(-0.102, 0.10), vec2(0.036, 0.46));
  float dStemR = sdBox(q - vec2(0.102, 0.10), vec2(0.036, 0.46));

  // Bottom U curve centered at (0.0, -0.36) with radius 0.102 and thickness 0.036
  vec2 pu = q - vec2(0.0, -0.36);
  float dArc = abs(length(pu) - 0.102) - 0.036;
  dArc = max(dArc, pu.y); // keep only bottom half of ring

  float dInner = min(min(dStemL, dStemR), dArc);

  // Top bevels on inner stems
  float topCutL = (q.y - (q.x + 0.102) - 0.54) * 0.707;
  float topCutR = (q.y + (q.x - 0.102) - 0.54) * 0.707;
  dInner = max(dInner, max(topCutL, topCutR));

  // Carve the signature diagonal slash straight through BOTH inner stems
  float qCut = abs(q.y - (q.x * 0.62 - 0.085));
  float dSlash = -(qCut - cutHalfWidth);
  dInner = max(dInner, dSlash);

  return min(min(dOuterL, dOuterR), dInner);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(1.0, uResolution.y);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);

  // Subtle vertical fluted architectural glass ribs (echoing IG vertical-slit reels)
  float isPortrait = smoothstep(0.95, 0.58, aspect);
  float ribFreq = mix(42.0, 20.0, isPortrait);
  float ribPhase = uv.x * ribFreq;
  float ribFract = fract(ribPhase) - 0.5;
  // Optical cylindrical lens refraction per rib, stronger near cursor & scroll
  float cursorDist = length(p - m);
  float lensInfluence = smoothstep(0.62, 0.0, cursorDist) * 0.85 + 0.18 + uVelocity * 0.35;
  float refractX = ribFract * 0.011 * lensInfluence;
  float ribSpec = pow(max(0.0, 1.0 - abs(ribFract) * 2.1), 5.0);

  // Coordinate for monolith with portrait-aware scaling so outer bars breathe on phones
  float monoScale = mix(1.48, 2.08, isPortrait);
  vec2 mp = (p + vec2(refractX, uScroll * 0.16)) * monoScale;

  // Evaluate SDF + subtle optical chromatic glass dispersion strictly at fluted edges
  float fracAmt = clamp(uFracture + uScroll * 0.55, 0.0, 1.0);
  float dCenter = sdMonolith(mp, fracAmt);
  float disp = 0.0022 + uFracture * 0.0065 + uVelocity * 0.004;
  float dR = sdMonolith(mp + vec2(disp, 0.0), fracAmt);
  float dB = sdMonolith(mp - vec2(disp, 0.0), fracAmt);

  // Anti-aliased monolith masks
  float aa = 2.2 / max(1.0, uResolution.y);
  float maskC = smoothstep(aa, -aa, dCenter);
  float maskR = smoothstep(aa, -aa, dR);
  float maskB = smoothstep(aa, -aa, dB);

  // Leftward halftone pixel-dissolve bleed (signature look from @unnatural_order_uk pinned reel)
  float rowId = floor(uv.y * uResolution.y * 0.35);
  float rowRand = hash21(vec2(rowId, floor(uTime * 1.6)));
  float bleedReach = (0.04 + rowRand * 0.13) * (0.45 + smoothstep(0.45, 0.0, abs(p.y - m.y)) * 0.9 + uFracture * 1.2);
  float dBleed = sdMonolith(mp + vec2(bleedReach, 0.0), fracAmt);
  float halftoneDot = step(0.48, fract(uv.x * uResolution.x * 0.18));
  float bleedMask = smoothstep(aa * 2.0, -aa, dBleed) * (1.0 - maskC) * halftoneDot * step(0.42, rowRand) * 0.24;

  // Procedural raw dark concrete texture
  float stoneLarge = fbm(p * 3.8 + vec2(uTime * 0.012, 0.0));
  float stoneFine = fbm(p * 19.0 + stoneLarge * 1.4);
  float concrete = mix(stoneLarge, stoneFine, 0.45);

  // Hanging industrial cables silhouette along far-left margin (from EP sleeve)
  float wireSway = sin(uTime * 0.55 + uv.y * 3.2) * 0.004;
  float w1 = smoothstep(0.0022, 0.0004, abs(uv.x - (0.125 + wireSway)));
  float w2 = smoothstep(0.0016, 0.0003, abs(uv.x - (0.136 - wireSway * 0.7)));
  float w3 = smoothstep(0.0026, 0.0005, abs(uv.x - (0.148 + wireSway * 1.1)));
  float wires = (w1 * 0.18 + w2 * 0.13 + w3 * 0.10);

  // Studio chiaroscuro vertical light slit following the pointer behind the fluted glass
  float slitLight = exp(-pow((p.x - m.x) * 2.6, 2.0)) * exp(-pow((p.y - m.y) * 1.5, 2.0));
  float ambientBeam = exp(-pow(p.x * 1.75, 2.0)) * 0.35;
  float lighting = 0.22 + ambientBeam + slitLight * 0.72;

  // Base obsidian concrete backdrop (pure black periphery, sculptural stone center)
  vec3 bgCol = vec3(0.012, 0.012, 0.014) + vec3(concrete * 0.045) * lighting;
  // Crisp fluted glass specular reflection lines catching the studio slit
  bgCol += vec3(0.11, 0.11, 0.12) * ribSpec * (0.16 + slitLight * 0.65);
  // Subtle hanging wire highlights
  bgCol += vec3(0.26, 0.26, 0.28) * wires * (0.45 + slitLight * 0.6);

  // Concrete-textured monolith material with carved inner rim highlight
  float bevel = smoothstep(-0.022, -0.002, dCenter) * maskC;
  float monoGrain = 0.52 + stoneFine * 0.48;
  // Fine vertical halftone lines inside the carved monolith
  float innerHalftone = 0.84 + 0.16 * step(0.32, fract(uv.x * uResolution.x * 0.25));
  vec3 monoTone = vec3(0.35, 0.35, 0.34) * monoGrain * innerHalftone * (0.55 + lighting * 0.62);
  monoTone += vec3(0.20) * bevel * (0.45 + slitLight);

  // Surgical dried-crimson chiaroscuro emerges ONLY inside the diagonal fracture void & bevel when held/fractured
  float diagVoid = smoothstep(0.06, 0.0, abs(mp.y - (mp.x * 0.62 - 0.085))) * smoothstep(0.32, 0.0, abs(mp.x));
  vec3 fractureLight = vec3(0.84, 0.09, 0.12) * diagVoid * uFracture * (0.45 + ribSpec * 0.7);

  // Compose optical monolith with subtle fluted-glass chromatic edge dispersion
  vec3 monoLayer = vec3(
    monoTone.r * maskR,
    monoTone.g * maskC,
    monoTone.b * maskB
  );

  // Subtle shift of bevel tint toward crimson strictly during active fracture
  monoLayer += vec3(0.55, 0.04, 0.06) * bevel * uFracture * 0.65;

  vec3 col = mix(bgCol, monoLayer, max(maskC, max(maskR, maskB) * 0.45));
  col += vec3(0.68, 0.68, 0.66) * bleedMask * (0.5 + lighting * 0.6);
  col += fractureLight;

  // Vignette into pure #000000 edges so hero integrates seamlessly into the page
  float vig = smoothstep(1.05, 0.28, length(p * vec2(0.85, 1.05)));
  col *= mix(0.18, 1.0, vig);

  // Bottom fade cleanly to pitch black
  float bottomFade = smoothstep(0.0, 0.22, uv.y);
  col *= bottomFade;

  // Fine organic 35mm darkroom film grain
  float grain = (hash21(uv * uResolution + fract(uTime * 17.0)) - 0.5) * 0.032;
  col = max(vec3(0.0), col + grain);

  gl_FragColor = vec4(col, 1.0);
}
`;

export class WebGLAperture {
  constructor(canvas, onFractureChange) {
    this.canvas = canvas;
    this.onFractureChange = onFractureChange || (() => {});
    this.gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });

    this.mouse = { x: 0.5, y: 0.5 };
    this.targetMouse = { x: 0.5, y: 0.5 };
    this.velocity = 0;
    this.fracture = 0;
    this.isHolding = false;
    this.scrollProgress = 0;
    this.startTime = performance.now();

    if (!this.gl) {
      this._initFallback2D();
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
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
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
      this._initFallback2D();
      return;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);
    this.program = prog;

    // Full-screen quad
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

    this.uniforms = {
      uResolution: gl.getUniformLocation(prog, 'uResolution'),
      uMouse: gl.getUniformLocation(prog, 'uMouse'),
      uTime: gl.getUniformLocation(prog, 'uTime'),
      uFracture: gl.getUniformLocation(prog, 'uFracture'),
      uScroll: gl.getUniformLocation(prog, 'uScroll'),
      uVelocity: gl.getUniformLocation(prog, 'uVelocity'),
    };
  }

  setHolding(holding) {
    this.isHolding = holding;
  }

  setScrollProgress(val) {
    this.scrollProgress = Math.max(0, Math.min(1, val));
  }

  _bindEvents() {
    window.addEventListener('resize', () => this.resize());

    window.addEventListener(
      'mousemove',
      (e) => {
        const nx = e.clientX / Math.max(1, window.innerWidth);
        const ny = 1.0 - e.clientY / Math.max(1, window.innerHeight);
        const dist = Math.hypot(nx - this.targetMouse.x, ny - this.targetMouse.y);
        this.velocity = Math.min(1.0, this.velocity + dist * 4.5);
        this.targetMouse.x = nx;
        this.targetMouse.y = ny;
      },
      { passive: true }
    );
  }

  resize() {
    if (!this.gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const w = Math.max(320, Math.floor(rect.width * dpr));
    const h = Math.max(480, Math.floor(rect.height * dpr));
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
  }

  _loop() {
    if (!this.gl) return;
    const gl = this.gl;
    const t = (performance.now() - this.startTime) * 0.001;

    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.075;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.075;
    this.velocity *= 0.92;

    const targetFrac = this.isHolding ? 1.0 : 0.0;
    this.fracture += (targetFrac - this.fracture) * (this.isHolding ? 0.065 : 0.09);
    this.onFractureChange(this.fracture);

    gl.uniform2f(this.uniforms.uResolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.uniforms.uMouse, this.mouse.x, this.mouse.y);
    gl.uniform1f(this.uniforms.uTime, t);
    gl.uniform1f(this.uniforms.uFracture, this.fracture);
    gl.uniform1f(this.uniforms.uScroll, this.scrollProgress);
    gl.uniform1f(this.uniforms.uVelocity, this.velocity);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(() => this._loop());
  }

  _initFallback2D() {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
