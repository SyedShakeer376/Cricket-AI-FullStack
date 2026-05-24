import { T } from '../utils/theme';

export function BarRow({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: T.muted }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: T.mono }}>{value}</span>
      </div>
      <div style={{ height: 5, background: T.border, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", background: color, borderRadius: 3, transition: "width .7s ease" }} />
      </div>
    </div>
  );
}

export function HBar({ data, vk, lk, color, max }) {
  const m = max || Math.max(...data.map((d) => d[vk])) * 1.1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 88, fontSize: 11, color: T.muted, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d[lk]}</div>
          <div style={{ flex: 1, height: 18, background: `${T.border}88`, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${(d[vk] / m) * 100}%`, height: "100%", background: `linear-gradient(90deg,${color}66,${color})`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 5, transition: "width .7s ease" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#000", fontFamily: T.mono }}>{d[vk]}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ data, color = T.acc, h = 80 }) {
  if (!data || data.length < 2) return null;
  const w = 300, pad = 8;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (w - pad * 2),
    h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2),
  ]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${d} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;
  const gid = `lg${color.replace(/#/g, "")}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={color} />)}
    </svg>
  );
}

export function Radar({ player, size = 160 }) {
  const m = [
    { l: "AVG",   v: player.avg / 70 },
    { l: "SR",    v: player.sr / 160 },
    { l: "CONS",  v: player.cons / 100 },
    { l: "PP",    v: player.pp / 100 },
    { l: "DEATH", v: player.death / 100 },
    { l: "PRESS", v: player.pressure / 100 },
  ];
  const n = m.length, cx = size / 2, cy = size / 2, r = size * .38;
  const pt = (i, sc) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [cx + sc * r * Math.cos(a), cy + sc * r * Math.sin(a)];
  };
  const poly = (sc) => m.map((_, i) => pt(i, sc).join(",")).join(" ");
  return (
    <svg width={size} height={size}>
      {[.25, .5, .75, 1].map((s) => <polygon key={s} points={poly(s)} fill="none" stroke={T.border} strokeWidth={1} />)}
      {m.map((_, i) => { const [x, y] = pt(i, 1); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={T.border} strokeWidth={1} />; })}
      <polygon points={m.map((v, i) => pt(i, v.v).join(",")).join(" ")} fill={`${T.acc}22`} stroke={T.acc} strokeWidth={1.5} />
      {m.map((v, i) => { const [x, y] = pt(i, v.v); return <circle key={i} cx={x} cy={y} r={3} fill={T.acc} />; })}
      {m.map((v, i) => { const [x, y] = pt(i, 1.26); return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={size * .065} fill={T.muted} fontWeight={700}>{v.l}</text>; })}
    </svg>
  );
}

export function WinMeter({ prob }) {
  const color = prob >= 60 ? T.acc : prob >= 40 ? T.warn : T.danger;
  const r = 42, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  const dash = (prob / 100) * circ * .75;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={100} height={76}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={T.border} strokeWidth={8}
          strokeDasharray={`${circ * .75} ${circ * .25}`} strokeDashoffset={circ * .375}
          strokeLinecap="round" transform={`rotate(135 ${cx} ${cx})`} />
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * .375}
          strokeLinecap="round" transform={`rotate(135 ${cx} ${cx})`}
          style={{ transition: "stroke-dasharray 1s ease,stroke .5s" }} />
        <text x={cx} y={cx + 4} textAnchor="middle" dominantBaseline="middle"
          fontSize={16} fontWeight={900} fill={color} fontFamily={T.mono}>{prob}%</text>
      </svg>
      <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1, marginTop: -4 }}>WIN PROBABILITY</div>
    </div>
  );
}
