/**
 * ByteCityPoster — the no-WebGL Byte City.
 *
 * A hand-authored isometric SVG skyline in navy tones with one blue data
 * path and the central Core glyph. Serves mobile/tablet/reduced-motion,
 * WebGL fallback and the dynamic-import loading state. Pure markup —
 * safe to server-render, no client hooks.
 */

const S = 27; // iso unit scale
const CX = 300;
const CY = 225;

/** Isometric projection: world (x, y, z) → SVG screen coords. */
function iso(x: number, y: number, z: number): [number, number] {
  return [CX + (x - y) * 0.866 * S, CY + (x + y) * 0.5 * S - z * S];
}

function pts(points: [number, number][]): string {
  return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

/** x, y (grid), half-width, half-depth, height, tall flag */
type PrismDef = [number, number, number, number, number, boolean];

/* 18 prisms: 13 filler blocks + 5 taller signal structures. */
const CITY: PrismDef[] = [
  [-4.2, -1.0, 0.45, 0.45, 1.1, false],
  [-3.0, -2.2, 0.5, 0.5, 1.7, true],
  [-2.2, 0.8, 0.45, 0.45, 0.9, false],
  [-3.4, 1.8, 0.5, 0.5, 1.4, false],
  [-1.2, -3.2, 0.45, 0.45, 1.2, false],
  [0.4, -3.8, 0.5, 0.5, 2.1, true],
  [2.0, -3.0, 0.45, 0.45, 1.5, false],
  [3.4, -1.6, 0.5, 0.5, 2.4, true],
  [4.2, 0.2, 0.45, 0.45, 1.3, false],
  [3.2, 1.6, 0.5, 0.5, 1.9, false],
  [1.8, 3.0, 0.45, 0.45, 1.1, false],
  [0.0, 3.8, 0.5, 0.5, 1.6, false],
  [-1.8, 3.2, 0.45, 0.45, 2.0, true],
  [1.6, -1.4, 0.55, 0.55, 2.9, true],
  [-2.0, -1.2, 0.55, 0.55, 2.6, true],
  [1.9, 1.1, 0.55, 0.55, 3.1, true],
  [-2.6, -0.2, 0.4, 0.4, 0.8, false],
  [2.6, 0.6, 0.4, 0.4, 1.0, false],
];

/** Painter's order: farther (smaller x+y) first. */
const CITY_SORTED = [...CITY].sort((a, b) => a[0] + a[1] - (b[0] + b[1]));

/** Data path node sequence: tall structures, routed through the Core. */
const PATH_NODES: [number, number, number][] = [
  [-3.0, -2.2, 1.7],
  [0.4, -3.8, 2.1],
  [1.6, -1.4, 2.9],
  [3.4, -1.6, 2.4],
  [1.9, 1.1, 3.1],
  [0, 0, 1.5], // the Core
  [-2.0, -1.2, 2.6],
  [-1.8, 3.2, 2.0],
];

const DATA_PATH_D = PATH_NODES.map(([x, y, z], i) => {
  const [px, py] = iso(x, y, z + 0.08);
  return `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
}).join(' ');

/* Floor grid lines */
const GRID_LINES: string[] = (() => {
  const lines: string[] = [];
  for (let k = -5; k <= 5; k++) {
    const [x1, y1] = iso(k, -5.5, 0);
    const [x2, y2] = iso(k, 5.5, 0);
    lines.push(`M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`);
    const [x3, y3] = iso(-5.5, k, 0);
    const [x4, y4] = iso(5.5, k, 0);
    lines.push(`M ${x3.toFixed(1)} ${y3.toFixed(1)} L ${x4.toFixed(1)} ${y4.toFixed(1)}`);
  }
  return lines;
})();

function Prism({ def }: { def: PrismDef }) {
  const [x, y, wx, wy, h, tall] = def;
  const A = iso(x - wx, y - wy, h);
  const B = iso(x + wx, y - wy, h);
  const C = iso(x + wx, y + wy, h);
  const D = iso(x - wx, y + wy, h);
  const Bb = iso(x + wx, y - wy, 0);
  const Cb = iso(x + wx, y + wy, 0);
  const Db = iso(x - wx, y + wy, 0);

  return (
    <g>
      {/* +y face (darkest, away from key light) */}
      <polygon points={pts([C, Cb, Db, D])} fill="#0A1830" />
      {/* +x face */}
      <polygon points={pts([B, Bb, Cb, C])} fill="#0F2440" />
      {/* top face (lit from upper-left) with a faint blue rim */}
      <polygon points={pts([A, B, C, D])} fill={tall ? '#1D3E63' : '#16304F'} stroke="#4C92FF" strokeOpacity={0.14} strokeWidth={0.8} />
    </g>
  );
}

export function ByteCityPoster({ className = '' }: { className?: string }) {
  const [coreX, coreY] = iso(0, 0, 1.5);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden bg-gradient-to-b from-bytes-ink via-bytes-midnight to-bytes-ink ${className}`}
    >
      <svg
        viewBox="0 0 600 420"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="presentation"
        focusable="false"
      >
        <defs>
          <radialGradient id="bytes-poster-horizon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bytes-poster-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4C92FF" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#2F6BFF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bytes-poster-fog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#02050C" stopOpacity="0.55" />
            <stop offset="30%" stopColor="#02050C" stopOpacity="0" />
            <stop offset="72%" stopColor="#071426" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#071426" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* horizon glow behind the skyline */}
        <ellipse cx={CX} cy={CY} rx={280} ry={150} fill="url(#bytes-poster-horizon)" />

        {/* isometric floor grid */}
        {GRID_LINES.map((d, i) => (
          <path key={i} d={d} stroke="#4C92FF" strokeOpacity={0.05} strokeWidth={1} fill="none" />
        ))}

        {/* the city, back to front */}
        {CITY_SORTED.map((def, i) => (
          <Prism key={i} def={def} />
        ))}

        {/* data path: soft under-stroke as glow, crisp line on top */}
        <path d={DATA_PATH_D} stroke="#2F6BFF" strokeOpacity={0.18} strokeWidth={6} fill="none" strokeLinejoin="round" />
        <path d={DATA_PATH_D} stroke="#4C92FF" strokeOpacity={0.9} strokeWidth={2} fill="none" strokeLinejoin="round" />
        {PATH_NODES.map(([x, y, z], i) => {
          const [px, py] = iso(x, y, z + 0.08);
          return <circle key={i} cx={px} cy={py} r={2.4} fill="#72DAFF" fillOpacity={0.9} />;
        })}

        {/* the Core: glow + faceted diamond glyph */}
        <circle cx={coreX} cy={coreY} r={46} fill="url(#bytes-poster-core)" />
        <polygon points={pts([[coreX, coreY - 32], [coreX - 26, coreY], [coreX, coreY + 32]])} fill="#2F6BFF" />
        <polygon points={pts([[coreX, coreY - 32], [coreX + 26, coreY], [coreX, coreY + 32]])} fill="#4C92FF" />
        <polygon
          points={pts([[coreX, coreY - 32], [coreX + 26, coreY], [coreX, coreY + 32], [coreX - 26, coreY]])}
          fill="none"
          stroke="#72DAFF"
          strokeOpacity={0.7}
          strokeWidth={1.5}
        />

        {/* atmospheric fog */}
        <rect x={0} y={0} width={600} height={420} fill="url(#bytes-poster-fog)" />
      </svg>
    </div>
  );
}
