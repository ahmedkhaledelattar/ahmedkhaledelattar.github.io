import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';

const computeCellSize = (width: number) => Math.min(6, Math.max(3.5, width / 200));
const DUST_RATIO = 0.07;
const ATLAS_WIDTH = 1024;
const ATLAS_HEIGHT = 640;
const WINDOW_SIZE = 56;

const VERTEX_SHADER = `#version 300 es
precision highp float;

in vec2 aHome;    // 0..1 inside the anchor rect
in vec3 aAir;     // x,y 0..1 over the canvas, z = depth (0 near, 1 far)
in vec4 aInfo;    // brightness, delay, duration, phase
in vec3 aCell;    // atlas window origin (uv), kind (0 tile, 1 dust)

uniform vec2 uRes;        // canvas, CSS px
uniform vec4 uRect;       // anchor x, y, w, h in canvas CSS px
uniform float uCell;      // tile pitch, CSS px
uniform float uDpr;
uniform float uTime;      // seconds, always running
uniform float uReveal;    // seconds since play
uniform float uScatter;   // 0 = face, 1 = blown back into the air
uniform vec2 uMouse;      // CSS px, far away when absent

out vec2 vCell;
out float vBright;
out float vLand;
out float vAlpha;
out float vPhase;

float inOut(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
  float bright = aInfo.x;
  float delay  = aInfo.y;
  float dur    = aInfo.z;
  float phase  = aInfo.w;
  float depth  = aAir.z;
  bool dust    = aCell.z > 0.5;

  // Air position: a slow float, nearer specks drift further.
  vec2 drift = vec2(sin(uTime * 0.31 + phase * 6.283), cos(uTime * 0.23 + phase * 9.1))
             * (6.0 + 22.0 * (1.0 - depth));
  vec2 air  = aAir.xy * uRes + drift;
  vec2 home = uRect.xy + aHome * uRect.zw;

  // Reveal: fade in as a speck (staggered), then fly home.
  float appear = smoothstep(0.0, 0.8, uReveal - delay * 0.35);
  float fly    = dust ? 0.0 : clamp((uReveal - delay) / dur, 0.0, 1.0);
  float e      = inOut(fly);

  // Scroll: tiles leave in a ragged order rather than all at once.
  float q = clamp(uScatter * 1.7 - phase * 0.7, 0.0, 1.0);
  q = q * q;

  float k = e * (1.0 - q); // 1 = sitting in the face
  vec2 pos = mix(air, home, k);

  // A curved path reads as gathered, a straight one as tweened.
  vec2 d = home - air;
  pos += vec2(-d.y, d.x) * 0.18 * sin(3.14159 * k) * (phase - 0.5);

  // The pointer parts the tiles it passes over.
  vec2 m = pos - uMouse;
  float ml = length(m);
  pos += (ml > 0.001 ? m / ml : vec2(0.0)) * smoothstep(110.0, 0.0, ml) * 16.0 * k;

  float land  = smoothstep(0.55, 1.0, k);
  float speck = mix(2.2, 0.9, depth);
  float tile  = uCell * (0.25 + 0.7 * bright);
  float size  = mix(speck, tile, land);

  float dustA = dust ? mix(0.55, 0.22, smoothstep(2.0, 4.0, uReveal)) : 1.0;
  vAlpha  = appear * mix(0.25 + 0.55 * (1.0 - depth), 1.0, land) * dustA;
  vBright = bright;
  vLand   = land;
  vCell   = aCell.xy;
  vPhase  = phase;

  vec2 clip = pos / uRes * 2.0 - 1.0;
  gl_Position  = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = max(size * uDpr, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uAtlas;
uniform vec2 uWin;     // window size in atlas uv
uniform float uTime;

in vec2 vCell;
in float vBright;
in float vLand;
in float vAlpha;
in float vPhase;
out vec4 outColor;

void main() {
  vec3 c = texture(uAtlas, vCell + gl_PointCoord * uWin).rgb;
  // Hue from the screenshot, value from the portrait: normalise the sample to
  // full brightness (a dark UI grey becomes white, a dim blue a vivid one),
  // keep some of its real detail, then let the face decide how bright it is.
  float peak = max(max(c.r, c.g), max(c.b, 0.06));
  vec3 hue = c / peak;
  vec3 tile = mix(hue, min(c * 1.8, 1.0), 0.35);
  tile = mix(tile, vec3(1.0), 0.15);
  float twinkle = 0.9 + 0.1 * sin(uTime * 1.6 + vPhase * 47.0);
  tile *= (0.1 + 0.95 * vBright) * twinkle;

  vec3 speck = vec3(0.9, 0.92, 1.0);
  vec3 rgb = mix(speck, tile, vLand);
  outColor = vec4(rgb * vAlpha, vAlpha);
}
`;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create WebGL shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile error');
  }
  return shader;
}

const ATLAS_CROPS: [number, number, number, number][] = [
  [0.26, 0.17, 0.48, 0.37],
  [0.53, 0.08, 0.15, 0.55],
  [0.4, 0.14, 0.16, 0.72],
  [0.2, 0.22, 0.4, 0.4],
];

function buildAtlasCanvas(images: HTMLImageElement[]): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_WIDTH;
  canvas.height = ATLAS_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const halfW = ATLAS_WIDTH / 2;
  const halfH = ATLAS_HEIGHT / 2;
  images.slice(0, 4).forEach((img, idx) => {
    const [sx, sy, sw, sh] = ATLAS_CROPS[idx] ?? [0, 0, 1, 1];
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    ctx.drawImage(
      img,
      sx * nw,
      sy * nh,
      sw * nw,
      sh * nh,
      (idx % 2) * halfW,
      Math.floor(idx / 2) * halfH,
      halfW,
      halfH,
    );
  });
  return canvas;
}

function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function samplePortraitMosaic(
  img: HTMLImageElement,
  targetWidth: number,
  visibleRatio: number,
) {
  const cell = computeCellSize(targetWidth);
  const cols = Math.max(20, Math.round(targetWidth / cell));
  const rows = Math.round((cols * img.naturalHeight) / img.naturalWidth);
  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return {
      settle: 0,
      cell,
      count: 0,
      home: new Float32Array(0),
      air: new Float32Array(0),
      info: new Float32Array(0),
      cellAttr: new Float32Array(0),
    };
  }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, cols, rows);
  const data = ctx.getImageData(0, 0, cols, rows).data;

  const home: number[] = [];
  const air: number[] = [];
  const info: number[] = [];
  const cellAttr: number[] = [];
  const winU = WINDOW_SIZE / ATLAS_WIDTH;
  const winV = WINDOW_SIZE / ATLAS_HEIGHT;
  let maxSettle = 0;

  const pushPoint = (hx: number, hy: number, bright: number, isDust: boolean) => {
    home.push(hx, hy);
    air.push(Math.random() * 1.2 - 0.1, Math.random() * 1.2 - 0.1, Math.random());
    const delay = 0.35 + Math.random() * 1 + hy * 0.45;
    const dur = 1.35 + Math.random() * 0.55;
    if (!isDust) maxSettle = Math.max(maxSettle, delay + dur);
    info.push(bright, delay, dur, Math.random());
    cellAttr.push(
      Math.random() * (1 - winU),
      Math.random() * (1 - winV),
      isDust ? 1 : 0,
    );
  };

  const lum = new Float32Array(cols * rows);
  for (let i = 0; i < cols * rows; i++) {
    const k = i * 4;
    lum[i] =
      ((0.2126 * data[k] + 0.7152 * data[k + 1] + 0.0722 * data[k + 2]) / 255) *
      (data[k + 3] / 255);
  }

  const nonBlack = Array.from(lum)
    .filter((v) => v >= 0.035)
    .sort((a, b) => a - b);
  const low = nonBlack[Math.floor(nonBlack.length * 0.02)] ?? 0;
  const high = nonBlack[Math.floor(nonBlack.length * 0.97)] ?? 1;
  const maxRow = Math.min(rows, Math.ceil(rows * visibleRatio));

  for (let r = 0; r < maxRow; r++) {
    for (let c = 0; c < cols; c++) {
      const val = lum[r * cols + c];
      if (val < 0.035 || (val < 0.08 && Math.random() < 0.45)) continue;
      const norm = Math.min(1, Math.max(0, (val - low) / (high - low || 1)));
      const bright = 0.2 * norm + 0.8 * smoothStep(0.1, 0.55, norm);
      pushPoint((c + 0.5) / cols, (r + 0.5) / rows, bright, false);
    }
  }

  const tileCount = home.length / 2;
  for (let i = 0; i < Math.round(tileCount * DUST_RATIO); i++) {
    pushPoint(0.5, 0.5, 0.3, true);
  }

  return {
    settle: maxSettle,
    cell,
    count: home.length / 2,
    home: new Float32Array(home),
    air: new Float32Array(air),
    info: new Float32Array(info),
    cellAttr: new Float32Array(cellAttr),
  };
}

export interface HeroMosaicCanvasProps {
  src: string;
  thumbs: string[];
  anchorRef: RefObject<HTMLImageElement | null>;
  play: boolean;
  label: string;
  className?: string;
}

export function HeroMosaicCanvas({
  src,
  thumbs,
  anchorRef,
  play,
  label,
  className = '',
}: HeroMosaicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (play && playStartTimeRef.current === null) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      playStartTimeRef.current = performance.now() / 1000 - (reduced ? 100 : 0);
    }
  }, [play]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const anchor = anchorRef.current;
    if (!canvas || !anchor) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });

    const fallbackToStatic = () => {
      anchor.style.visibility = 'visible';
      anchor.style.opacity = '0.9';
      canvas.style.display = 'none';
    };

    if (!gl) {
      fallbackToStatic();
      return;
    }

    let disposed = false;
    let tickerActive = false;
    let inViewport = true;
    let pointCount = 0;
    let cellPitch = 6;
    let settleDuration = 0;

    const setStateAttr = (state: string) => {
      if (canvas.dataset.state !== state) {
        canvas.dataset.state = state;
      }
    };
    setStateAttr('idle');

    let lastAnchorW = -1;
    let loadedPortrait: HTMLImageElement | null = null;
    const bootTime = performance.now() / 1000;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    let program: WebGLProgram;
    try {
      const p = gl.createProgram();
      if (!p) throw new Error('createProgram failed');
      program = p;
      gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
      gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? 'link error');
      }
    } catch (err) {
      console.error(err);
      fallbackToStatic();
      return;
    }

    gl.useProgram(program);

    const loc = (name: string) => gl.getUniformLocation(program, name);
    const uniforms = {
      res: loc('uRes'),
      rect: loc('uRect'),
      cell: loc('uCell'),
      dpr: loc('uDpr'),
      time: loc('uTime'),
      reveal: loc('uReveal'),
      scatter: loc('uScatter'),
      mouse: loc('uMouse'),
      atlas: loc('uAtlas'),
      win: loc('uWin'),
    };

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const attribNames = ['aHome', 'aAir', 'aInfo', 'aCell'] as const;
    const attribSizes = [2, 3, 4, 3];
    const buffers = attribNames.map((name, idx) => {
      const buf = gl.createBuffer();
      const attrLoc = gl.getAttribLocation(program, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(attrLoc);
      gl.vertexAttribPointer(attrLoc, attribSizes[idx], gl.FLOAT, false, 0, 0);
      return buf;
    });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(uniforms.win, WINDOW_SIZE / ATLAS_WIDTH, WINDOW_SIZE / ATLAS_HEIGHT);

    const rebuildGeometry = () => {
      const anchorBox = anchor.getBoundingClientRect();
      const w = anchorBox.width;
      if (!loadedPortrait || w < 10 || Math.abs(w - lastAnchorW) < 1) return;
      lastAnchorW = w;
      const canvasBox = canvas.getBoundingClientRect();
      const visibleRatio = Math.max(
        0,
        Math.min(1, (canvasBox.bottom - anchorBox.top) / anchorBox.height),
      );
      const sampled = samplePortraitMosaic(loadedPortrait, w, visibleRatio);
      pointCount = sampled.count;
      cellPitch = sampled.cell;
      settleDuration = sampled.settle;

      const arrays = [sampled.home, sampled.air, sampled.info, sampled.cellAttr];
      arrays.forEach((arr, idx) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers[idx]);
        gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
      });
    };

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const onPointerMove = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - box.left;
      mouse.ty = e.clientY - box.top;
      if (mouse.x < -999) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
    };
    const onPointerLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const renderFrame = () => {
      if (!pointCount || playStartTimeRef.current === null) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cBox = canvas.getBoundingClientRect();
      const pixelW = Math.round(cBox.width * dpr);
      const pixelH = Math.round(cBox.height * dpr);
      if (canvas.width !== pixelW || canvas.height !== pixelH) {
        canvas.width = pixelW;
        canvas.height = pixelH;
      }
      rebuildGeometry();

      const aBox = anchor.getBoundingClientRect();
      const now = performance.now() / 1000;
      const scatter = reducedMotion
        ? 0
        : Math.min(1, Math.max(0, -cBox.top / (cBox.height * 0.7)));

      mouse.x += (mouse.tx - mouse.x) * 0.18;
      mouse.y += (mouse.ty - mouse.y) * 0.18;

      gl.viewport(0, 0, pixelW, pixelH);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(uniforms.res, cBox.width, cBox.height);
      gl.uniform4f(
        uniforms.rect,
        aBox.left - cBox.left,
        aBox.top - cBox.top,
        aBox.width,
        aBox.height,
      );
      gl.uniform1f(uniforms.cell, cellPitch);
      gl.uniform1f(uniforms.dpr, dpr);
      gl.uniform1f(uniforms.time, now - bootTime);
      gl.uniform1f(uniforms.reveal, now - playStartTimeRef.current);
      gl.uniform1f(uniforms.scatter, scatter);

      setStateAttr(
        scatter >= 1
          ? 'gone'
          : scatter > 0
            ? 'scattering'
            : now - playStartTimeRef.current < settleDuration
              ? 'gathering'
              : 'formed',
      );

      gl.uniform2f(uniforms.mouse, mouse.x, mouse.y);
      gl.drawArrays(gl.POINTS, 0, pointCount);
    };

    const setTicker = (shouldRun: boolean) => {
      if (shouldRun !== tickerActive) {
        tickerActive = shouldRun;
        if (shouldRun) {
          gsap.ticker.add(renderFrame);
        } else {
          gsap.ticker.remove(renderFrame);
        }
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      setTicker(inViewport && pointCount > 0);
    });
    io.observe(canvas);

    Promise.all([loadImage(src), Promise.all(thumbs.map(loadImage))])
      .then(([portraitImg, thumbImgs]) => {
        if (disposed) return;
        loadedPortrait = portraitImg;
        const tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          buildAtlasCanvas(thumbImgs),
        );
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(uniforms.atlas, 0);
        rebuildGeometry();
        setTicker(inViewport && pointCount > 0);
      })
      .catch((err) => {
        console.error(err);
        fallbackToStatic();
      });

    if (finePointer) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerleave', onPointerLeave);
    }

    return () => {
      disposed = true;
      setTicker(false);
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      buffers.forEach((b) => gl.deleteBuffer(b));
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, [src, thumbs, anchorRef]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
