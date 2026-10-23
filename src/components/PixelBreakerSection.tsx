import { useCallback, useEffect, useRef, useState } from 'react';

const CELL_EMPTY = 0;
const CELL_STANDING = 1;
const CELL_BROKEN = 2;
const GLYPH_W = 5;
const GLYPH_H = 7;
const LETTER_GAP = 1;
const LINE_GAP = 3;
const REGROW_DELAY = 1.4;

const PIXEL_FONT: Record<string, string> = {
  A: '.###./#...#/#...#/#####/#...#/#...#/#...#',
  B: '####./#...#/#...#/####./#...#/#...#/####.',
  C: '.####/#..../#..../#..../#..../#..../.####',
  D: '####./#...#/#...#/#...#/#...#/#...#/####.',
  E: '#####/#..../#..../####./#..../#..../#####',
  F: '#####/#..../#..../####./#..../#..../#....',
  G: '.###./#...#/#..../#..##/#...#/#...#/.###.',
  H: '#...#/#...#/#...#/#####/#...#/#...#/#...#',
  I: '#####/..#../..#../..#../..#../..#../#####',
  J: '..###/...#./...#./...#./...#./#..#./.##..',
  K: '#...#/#..#./#.#../##.../#.#../#..#./#...#',
  L: '#..../#..../#..../#..../#..../#..../#####',
  M: '#...#/##.##/#.#.#/#...#/#...#/#...#/#...#',
  N: '#...#/##..#/#.#.#/#..##/#...#/#...#/#...#',
  O: '.###./#...#/#...#/#...#/#...#/#...#/.###.',
  P: '####./#...#/#...#/####./#..../#..../#....',
  Q: '.###./#...#/#...#/#...#/#.#.#/#..#./.##.#',
  R: '####./#...#/#...#/####./#.#../#..#./#...#',
  S: '.####/#..../#..../.###./....#/....#/####.',
  T: '#####/..#../..#../..#../..#../..#../..#..',
  U: '#...#/#...#/#...#/#...#/#...#/#...#/.###.',
  V: '#...#/#...#/#...#/#...#/#...#/.#.#./..#..',
  W: '#...#/#...#/#...#/#...#/#.#.#/##.##/#...#',
  X: '#...#/#...#/.#.#./..#../.#.#./#...#/#...#',
  Y: '#...#/#...#/.#.#./..#../..#../..#../..#..',
  Z: '#####/....#/...#./..#../.#.../#..../#####',
  '0': '.###./#...#/#..##/#.#.#/##..#/#...#/.###.',
  '1': '..#../.##../..#../..#../..#../..#../.###.',
  '2': '.###./#...#/....#/...#./..#../.#.../#####',
  '3': '#####/...#./..#../...#./....#/#...#/.###.',
  '4': '...#./..##./.#.#./#..#./#####/...#./...#.',
  '5': '#####/#..../####./....#/....#/#...#/.###.',
  '6': '..##./.#.../#..../####./#...#/#...#/.###.',
  '7': '#####/....#/...#./..#../.#.../.#.../.#...',
  '8': '.###./#...#/#...#/.###./#...#/#...#/.###.',
  '9': '.###./#...#/#...#/.####/....#/...#./.##..',
  '.': '...../...../...../...../...../.##../.##..',
  ',': '...../...../...../...../.##../.##../#....',
  '!': '..#../..#../..#../..#../..#../...../..#..',
  '?': '.###./#...#/....#/..##./..#../...../..#..',
  '-': '...../...../...../#####/...../...../.....',
  "'": '..#../..#../...../...../...../...../.....',
  '&': '.##../#..#./#..#./.##../#.#.#/#..#./.##.#',
  '/': '....#/....#/...#./..#../.#.../#..../#....',
  '+': '...../..#../..#../#####/..#../..#../.....',
  ':': '...../..#../..#../...../..#../..#../.....',
};

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const linePixelWidth = (str: string) =>
  Math.max(0, str.length * 6 - LETTER_GAP);

const blockMetrics = (lines: string[]) => ({
  w: Math.max(1, ...lines.map(linePixelWidth)),
  h: lines.length * GLYPH_H + (lines.length - 1) * LINE_GAP,
});

function buildBrickGrid(
  lines: string[],
  cols: number,
  rows: number,
  verticalAnchorRatio: number,
): Uint8Array {
  const grid = new Uint8Array(cols * rows);
  const startRow = Math.max(
    0,
    Math.round(rows * verticalAnchorRatio - blockMetrics(lines).h / 2),
  );

  lines.forEach((line, lineIdx) => {
    const startCol = Math.round((cols - linePixelWidth(line)) / 2);
    const rowOffset = startRow + lineIdx * 10;

    Array.from(line.toUpperCase()).forEach((ch, charIdx) => {
      const pattern = PIXEL_FONT[ch];
      if (!pattern) return;
      const colOffset = startCol + charIdx * 6;
      pattern.split('/').forEach((rowStr, r) => {
        for (let c = 0; c < GLYPH_W; c++) {
          if (rowStr[c] !== '#') continue;
          const gx = colOffset + c;
          const gy = rowOffset + r;
          if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
            grid[gy * cols + gx] = CELL_STANDING;
          }
        }
      });
    });
  });

  return grid;
}

interface GameState {
  width: number;
  height: number;
  cell: number;
  cols: number;
  rows: number;
  grid: Uint8Array;
  standing: number;
  ox: number;
  oy: number;
  gap: number;
  accent: string;
  layer: HTMLCanvasElement;
  layerCtx: CanvasRenderingContext2D;
  layerDirty: boolean;
  radius: number;
  paddle: { x: number; w: number; h: number; y: number };
  ball: { x: number; y: number; vx: number; vy: number };
  baseSpeed: number;
  serving: boolean;
  serveDelay: number;
  lives: number;
  phase: 'idle' | 'attract' | 'playing' | 'won' | 'over';
  clock: number;
  regrow: { cell: number; at: number }[];
  last: number;
  acc: number;
}

interface PixelBreakerProps {
  lines?: string[];
  caption?: string;
  startingLives?: number;
  autoPlay?: boolean;
  speed?: number;
  className?: string;
  panelClassName?: string;
  onWin?: () => void;
}

export function PixelBreaker({
  lines = ['DESIGN', 'BUILD AI'],
  caption = 'Break it if you can. Design + AI + Code.',
  startingLives = 3,
  autoPlay = true,
  speed = 1,
  className = '',
  panelClassName = 'aspect-[5/6] sm:aspect-[4/3] lg:aspect-[16/9]',
  onWin,
}: PixelBreakerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controlsRef = useRef<{
    launch: () => void;
    movePaddleTo: (x: number) => void;
    nudgePaddle: (dx: number) => void;
  } | null>(null);
  const stateRef = useRef<GameState | null>(null);

  const joinedKey = lines.join('\n');
  const linesRef = useRef(lines);
  const onWinRef = useRef(onWin);

  useEffect(() => {
    linesRef.current = lines;
    onWinRef.current = onWin;
  }, [lines, onWin]);

  const [phase, setPhase] = useState<GameState['phase']>('idle');
  const [lives, setLives] = useState(startingLives);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!container || !canvas || !ctx) return;

    let rafId = 0;
    let lastDims = '';
    let docVisible = true;
    let inView = false;

    const redrawLayer = () => {
      const st = stateRef.current;
      if (!st) return;
      const { layerCtx, cell, gap, cols, rows, grid, ox, oy } = st;
      layerCtx.clearRect(0, 0, st.width, st.height);
      const brickSize = cell - gap;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const val = grid[r * cols + c];
          if (val !== CELL_EMPTY) {
            layerCtx.fillStyle =
              val === CELL_STANDING ? '#f2efe9' : 'rgba(242,239,233,0.07)';
            layerCtx.fillRect(ox + c * cell, oy + r * cell, brickSize, brickSize);
          }
        }
      }
      st.layerDirty = false;
    };

    const render = () => {
      const st = stateRef.current;
      if (!st) return;
      if (st.layerDirty) redrawLayer();
      ctx.clearRect(0, 0, st.width, st.height);
      ctx.drawImage(st.layer, 0, 0, st.width, st.height);
      if (st.phase !== 'playing' && st.phase !== 'attract') return;

      const { paddle, ball, radius } = st;
      ctx.fillStyle = st.accent;
      const px = paddle.x - paddle.w / 2;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(px, paddle.y, paddle.w, paddle.h, paddle.h / 2);
        ctx.fill();
      } else {
        ctx.fillRect(px, paddle.y, paddle.w, paddle.h);
      }
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const initBoard = () => {
      const box = container.getBoundingClientRect();
      const w = Math.round(box.width);
      const h = Math.round(box.height);
      if (w < 40 || h < 40) return;
      lastDims = `${w}x${h}`;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const attractActive = autoPlay && !prefersReducedMotion();
      const currentLines = linesRef.current;
      const bm = blockMetrics(currentLines);
      const rawCell = Math.min(
        (w * (w < 520 ? 0.94 : 0.88)) / bm.w,
        (h * 0.56) / bm.h,
      );
      const invDpr = 1 / dpr;
      const cell = clamp(Math.floor(rawCell / invDpr) * invDpr, 4, 26);
      const cols = Math.floor(w / cell);
      const rows = Math.floor(h / cell);
      const grid = buildBrickGrid(
        currentLines,
        cols,
        rows,
        clamp(0.3 + (h / w) * 0.12, 0.3, 0.44),
      );

      let standing = 0;
      for (let i = 0; i < grid.length; i++) {
        if (grid[i] === CELL_STANDING) standing += 1;
      }

      const layerCanvas = document.createElement('canvas');
      layerCanvas.width = canvas.width;
      layerCanvas.height = canvas.height;
      const layerCtx = layerCanvas.getContext('2d');
      if (!layerCtx) return;
      layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const initialPhase = attractActive ? 'attract' : 'idle';
      stateRef.current = {
        width: w,
        height: h,
        cell,
        cols,
        rows,
        grid,
        standing,
        ox: (w - cols * cell) / 2,
        oy: (h - rows * cell) / 2,
        gap: Math.max(1, Math.round(cell * 0.22)),
        accent:
          getComputedStyle(container).getPropertyValue('--accent').trim() ||
          '#e8e4dc',
        layer: layerCanvas,
        layerCtx,
        layerDirty: true,
        radius: clamp(cell * 0.5, 4, 9),
        paddle: {
          x: w / 2,
          w: clamp(w * 0.26, 64, 200),
          h: clamp(cell * 0.8, 5, 14),
          y: h - Math.max(26, cell * 2.4),
        },
        ball: { x: w / 2, y: 0, vx: 0, vy: 0 },
        baseSpeed: clamp(h * 0.46, 150, 420) * speed,
        serving: true,
        serveDelay: attractActive ? 0.6 : Infinity,
        lives: startingLives,
        phase: initialPhase,
        clock: 0,
        regrow: [],
        last: 0,
        acc: 0,
      };

      setPhase(initialPhase);
      setLives(startingLives);
      render();
    };

    const hitCells = () => {
      const st = stateRef.current!;
      const { ball, radius, cell, cols, rows, ox, oy, grid } = st;
      const c0 = Math.floor((ball.x - radius - ox) / cell);
      const c1 = Math.floor((ball.x + radius - ox) / cell);
      const r0 = Math.floor((ball.y - radius - oy) / cell);
      const r1 = Math.floor((ball.y + radius - oy) / cell);
      const hits: number[] = [];
      for (let r = Math.max(0, r0); r <= Math.min(rows - 1, r1); r++) {
        for (let c = Math.max(0, c0); c <= Math.min(cols - 1, c1); c++) {
          if (grid[r * cols + c] === CELL_STANDING) {
            hits.push(r * cols + c);
          }
        }
      }
      return hits;
    };

    const stepAxis = (axis: 'x' | 'y', dt: number) => {
      const st = stateRef.current!;
      const { ball } = st;
      if (axis === 'x') ball.x += ball.vx * dt;
      else ball.y += ball.vy * dt;

      const hits = hitCells();
      if (!hits.length) return;
      const isAttract = st.phase === 'attract';
      hits.forEach((idx) => {
        st.grid[idx] = CELL_BROKEN;
        st.standing -= 1;
        if (isAttract) {
          st.regrow.push({ cell: idx, at: st.clock + REGROW_DELAY });
        }
      });
      st.layerDirty = true;
      if (axis === 'x') {
        ball.x -= ball.vx * dt;
        ball.vx = -ball.vx;
      } else {
        ball.y -= ball.vy * dt;
        ball.vy = -ball.vy;
      }
    };

    const resetServe = () => {
      const st = stateRef.current!;
      st.serving = true;
      st.serveDelay = 0.8;
      st.ball.vx = 0;
      st.ball.vy = 0;
    };

    const transitionPhase = (next: GameState['phase']) => {
      if (!stateRef.current) return;
      stateRef.current.phase = next;
      setPhase(next);
      if (next === 'won') onWinRef.current?.();
    };

    const stepPhysics = (dt: number) => {
      const st = stateRef.current!;
      const { ball, paddle, radius } = st;
      const isAttract = st.phase === 'attract';
      st.clock += dt;

      while (st.regrow.length && st.regrow[0].at <= st.clock) {
        const item = st.regrow.shift()!;
        if (st.grid[item.cell] === CELL_BROKEN) {
          st.grid[item.cell] = CELL_STANDING;
          st.standing += 1;
          st.layerDirty = true;
        }
      }

      if (isAttract && !st.serving) {
        paddle.x = clamp(
          paddle.x + (ball.x - paddle.x) * Math.min(1, dt * 7),
          paddle.w / 2,
          st.width - paddle.w / 2,
        );
      }

      if (st.serving) {
        ball.x = paddle.x;
        ball.y = paddle.y - radius - 1;
        if (Number.isFinite(st.serveDelay)) {
          st.serveDelay -= dt;
          if (st.serveDelay <= 0) {
            st.serving = false;
            ball.vx = st.baseSpeed * 0.35 * (Math.random() < 0.5 ? -1 : 1);
            ball.vy = -st.baseSpeed;
          }
        }
        return;
      }

      stepAxis('x', dt);
      stepAxis('y', dt);

      if (ball.x - radius < 0) {
        ball.x = radius;
        ball.vx = Math.abs(ball.vx);
      }
      if (ball.x + radius > st.width) {
        ball.x = st.width - radius;
        ball.vx = -Math.abs(ball.vx);
      }
      if (ball.y - radius < 0) {
        ball.y = radius;
        ball.vy = Math.abs(ball.vy);
      }

      const withinX = Math.abs(ball.x - paddle.x) <= paddle.w / 2 + radius;
      const withinY =
        ball.vy > 0 &&
        ball.y + radius >= paddle.y &&
        ball.y - radius <= paddle.y + paddle.h;

      if (withinX && withinY) {
        const hitAngle =
          clamp((ball.x - paddle.x) / (paddle.w / 2), -1, 1) * 1.05;
        const nextSpeed = Math.min(
          Math.hypot(ball.vx, ball.vy) * 1.008,
          st.baseSpeed * 1.45,
        );
        ball.vx = Math.sin(hitAngle) * nextSpeed;
        ball.vy = -Math.cos(hitAngle) * nextSpeed;
        ball.y = paddle.y - radius - 0.5;
      }

      if (ball.y - radius > st.height) {
        if (isAttract) {
          resetServe();
        } else {
          st.lives -= 1;
          setLives(st.lives);
          if (st.lives <= 0) {
            transitionPhase('over');
          } else {
            resetServe();
          }
        }
      }

      if (!isAttract && st.standing === 0) {
        transitionPhase('won');
      }
    };

    const FIXED_DT = 1 / 120;
    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      const st = stateRef.current;
      if (!st) return;
      const elapsed = st.last
        ? Math.min((now - st.last) / 1000, 4 * FIXED_DT)
        : 0;
      st.last = now;
      if (st.phase === 'playing' || st.phase === 'attract') {
        st.acc += elapsed;
        let subSteps = 0;
        while (st.acc >= FIXED_DT && subSteps < 4) {
          stepPhysics(FIXED_DT);
          st.acc -= FIXED_DT;
          subSteps += 1;
        }
        if (subSteps === 4) st.acc = 0;
      }
      render();
    };

    const canRun = () => docVisible && inView;
    const startLoop = () => {
      if (!rafId && canRun()) {
        if (stateRef.current) {
          stateRef.current.last = 0;
          stateRef.current.acc = 0;
        }
        rafId = requestAnimationFrame(loop);
      }
    };
    const stopLoop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    controlsRef.current = {
      launch: () => {
        let st = stateRef.current;
        if (!st) return;
        if (st.phase !== 'playing') {
          initBoard();
          st = stateRef.current!;
        }
        st.phase = 'playing';
        setPhase('playing');
        if (st.serving) {
          st.ball.x = st.paddle.x;
          st.ball.y = st.paddle.y - st.radius - 1;
          st.serving = false;
          st.serveDelay = Infinity;
          st.ball.vx = st.baseSpeed * 0.35;
          st.ball.vy = -st.baseSpeed;
        }
        startLoop();
      },
      movePaddleTo: (x: number) => {
        const st = stateRef.current;
        if (st) {
          st.paddle.x = clamp(x, st.paddle.w / 2, st.width - st.paddle.w / 2);
        }
      },
      nudgePaddle: (dx: number) => {
        const st = stateRef.current;
        if (st) {
          st.paddle.x = clamp(
            st.paddle.x + dx,
            st.paddle.w / 2,
            st.width - st.paddle.w / 2,
          );
        }
      },
    };

    initBoard();
    startLoop();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const box = container.getBoundingClientRect();
        if (`${Math.round(box.width)}x${Math.round(box.height)}` !== lastDims) {
          initBoard();
        }
      }, 180);
    });
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (canRun()) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 },
    );
    io.observe(container);

    const onVisibility = () => {
      docVisible = document.visibilityState === 'visible';
      if (canRun()) startLoop();
      else stopLoop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stopLoop();
      clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      controlsRef.current = null;
    };
  }, [joinedKey, startingLives, autoPlay, speed]);

  const wakeFromAttract = useCallback(() => {
    if (stateRef.current?.phase === 'attract') {
      controlsRef.current?.launch();
      return true;
    }
    return false;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (container) {
        wakeFromAttract();
        controlsRef.current?.movePaddleTo(
          e.clientX - container.getBoundingClientRect().left,
        );
      }
    },
    [wakeFromAttract],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const step = (stateRef.current?.cell ?? 8) * 4;
      if (e.key === 'ArrowLeft') {
        wakeFromAttract();
        controlsRef.current?.nudgePaddle(-step);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        wakeFromAttract();
        controlsRef.current?.nudgePaddle(step);
        e.preventDefault();
      } else if (e.key === ' ' || e.key === 'Enter') {
        controlsRef.current?.launch();
        e.preventDefault();
      }
    },
    [wakeFromAttract],
  );

  const statusText =
    phase === 'won'
      ? 'Cleared'
      : phase === 'over'
        ? 'Out of balls'
        : phase === 'playing'
          ? 'Playing'
          : 'Ready';

  return (
    <div className={`relative ${className}`}>
      {caption && (
        <p className="mb-5 inline-block pb-1 border-b-2 border-[var(--accent)] text-xs sm:text-sm font-medium tracking-wide text-white/80">
          {caption}
        </p>
      )}

      <div
        ref={containerRef}
        role="application"
        aria-roledescription="brick breaker"
        aria-label={`${lines.join(' ')} — a playable headline. Arrow keys move the paddle, space launches the ball.`}
        tabIndex={0}
        onPointerMove={onPointerMove}
        onPointerDown={() => controlsRef.current?.launch()}
        onKeyDown={onKeyDown}
        style={{ touchAction: phase === 'playing' ? 'none' : 'auto' }}
        className={`relative w-full ${panelClassName} select-none outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${
          phase === 'playing' ? 'cursor-none' : 'cursor-pointer'
        }`}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="block w-full h-full"
        />
        <h2 className="sr-only">{lines.join(' ')}</h2>
        <p aria-live="polite" className="sr-only">
          {statusText}
        </p>

        {phase === 'playing' && (
          <div
            className="absolute top-3 right-3 flex gap-1.5"
            aria-hidden="true"
          >
            {Array.from({ length: startingLives }).map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx < lives ? 'bg-[var(--accent)]' : 'bg-white/15'
                }`}
              />
            ))}
          </div>
        )}

        {phase !== 'playing' && (
          <div className="absolute bottom-4 right-4 flex items-center gap-4 pointer-events-none">
            {(phase === 'over' || phase === 'won') && (
              <span
                className={`bg-[#050505] px-2 py-1 text-xs sm:text-sm tracking-widest uppercase ${
                  phase === 'won' ? 'text-[var(--accent)]' : 'text-white/50'
                }`}
              >
                {statusText}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                controlsRef.current?.launch();
              }}
              className="pointer-events-auto cursor-pointer px-5 py-2 bg-[#050505] border border-[var(--accent)]/50 text-[var(--accent)] text-xs sm:text-sm tracking-[0.3em] uppercase transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-contrast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {phase === 'over' || phase === 'won' ? 'Again' : 'Play'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function PixelBreakerSection() {
  return (
    <section
      id="play"
      className="bg-[#050505] text-white py-24 md:py-32 px-4 sm:px-6 md:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <PixelBreaker
          lines={['DESIGN', 'BUILD AI']}
          caption="Break it if you can. Design + AI + Code."
          panelClassName="aspect-[5/6] sm:aspect-[4/3] lg:aspect-[16/9]"
        />
      </div>
    </section>
  );
}
