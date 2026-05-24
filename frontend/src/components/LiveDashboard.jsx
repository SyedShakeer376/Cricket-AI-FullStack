import { useState, useEffect } from 'react';
import { T, PHASES, PITCHES } from '../utils/theme';
import { aiScore, winProb } from '../utils/helpers';
import { Av, Bdg, Crd, SecTitle } from './UI';
import { WinMeter } from './Charts';

export default function LiveDashboard({ players }) {
  const [batting, setBatting] = useState(players.slice(0, Math.min(8, players.length)));
  const [score,   setScore]   = useState(67);
  const [wk,      setWk]      = useState(2);
  const [overs,   setOvers]   = useState(10);
  const [target,  setTarget]  = useState(175);
  const [drag,    setDrag]    = useState(null);
  const [dragOv,  setDragOv]  = useState(null);

  useEffect(() => { setBatting(players.slice(0, Math.min(8, players.length))); }, [players]);

  const wp  = winProb(score, wk, overs, target);
  const rrr = ((target - score) / Math.max(20 - overs, .1)).toFixed(2);

  const drop = (i) => {
    if (drag === null || drag === i) return;
    const a = [...batting]; const [m] = a.splice(drag, 1); a.splice(i, 0, m);
    setBatting(a); setDrag(null); setDragOv(null);
  };

  const aiRec = [...players]
    .map((p) => ({ ...p, s: aiScore(p, PHASES[1], PITCHES[0], wk) }))
    .sort((a, b) => b.s - a.s).slice(0, 3);

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 13 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900 }}>Live Decision Dashboard</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 3 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.danger, animation: "pulse 1s infinite" }} />
            <span style={{ fontSize: 11, color: T.muted }}>SIMULATION · {players.length} players in dataset</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ l:"SCORE",v:`${score}/${wk}`,c:T.acc},{l:"OVERS",v:`${overs}.0`,c:T.warn},{l:"REQ RR",v:rrr,c:T.blue}].map((s) => (
            <div key={s.l} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 9, padding: "7px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: s.c, fontFamily: T.mono }}>{s.v}</div>
              <div style={{ fontSize: 9, color: T.muted }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <Crd style={{ padding: "13px 16px" }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[{l:"Score",v:score,set:setScore,max:400},{l:"Wickets",v:wk,set:setWk,max:10},{l:"Overs",v:overs,set:setOvers,max:20},{l:"Target",v:target,set:setTarget,max:400}].map((f) => (
            <div key={f.l} style={{ flex: 1, minWidth: 110 }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 3, letterSpacing: .5 }}>{f.l}: <span style={{ color: T.acc, fontWeight: 700 }}>{f.v}</span></div>
              <input type="range" min={0} max={f.max} value={f.v} onChange={(e) => f.set(+e.target.value)} style={{ width: "100%", accentColor: T.acc }} />
            </div>
          ))}
        </div>
      </Crd>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 250px", gap: 13 }}>
        {/* Batting order */}
        <Crd>
          <SecTitle>Batting Order · Drag to Reorder</SecTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {batting.map((p, i) => (
              <div key={p.id} draggable
                onDragStart={() => setDrag(i)}
                onDragOver={(e) => { e.preventDefault(); setDragOv(i); }}
                onDrop={() => drop(i)}
                onDragEnd={() => { setDrag(null); setDragOv(null); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 11px", borderRadius: 9,
                  background: dragOv === i ? `${T.acc}15` : i < wk ? `${T.danger}08` : T.bg,
                  border: `1px solid ${dragOv === i ? T.acc : i < wk ? `${T.danger}33` : T.border}`,
                  cursor: "grab", opacity: i < wk ? .5 : 1, transition: "all .15s" }}>
                <div style={{ fontSize: 10, color: T.muted }}>⠿</div>
                <div style={{ width: 17, textAlign: "center", fontSize: 10, fontWeight: 800, color: i < wk ? T.danger : T.muted }}>#{i + 1}</div>
                <Av name={p.name} color={i < wk ? T.danger : T.acc} size={27} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 9, color: T.muted }}>{p.role}</div>
                </div>
                {i < wk      && <Bdg color={T.danger}>OUT</Bdg>}
                {i === wk    && <Bdg color={T.acc}>BATTING</Bdg>}
                {i === wk+1  && <Bdg color={T.warn}>NEXT</Bdg>}
                <div style={{ fontSize: 12, fontWeight: 700, color: T.acc, fontFamily: T.mono, minWidth: 28, textAlign: "right" }}>{p.avg}</div>
              </div>
            ))}
          </div>
        </Crd>

        {/* Win probability + AI recs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <Crd style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 16 }}>
            <WinMeter prob={wp} />
            <div style={{ marginTop: 8, fontSize: 14, fontWeight: 800, color: wp >= 60 ? T.acc : wp >= 40 ? T.warn : T.danger }}>
              {wp >= 60 ? "ON TRACK" : wp >= 40 ? "UNDER PRESSURE" : "CRITICAL"}
            </div>
          </Crd>
          <Crd>
            <SecTitle>🧠 AI Next Batsman</SecTitle>
            {aiRec.map((p, i) => {
              const cols = [T.acc, T.blue, T.warn];
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "8px 9px", background: `${cols[i]}08`, border: `1px solid ${cols[i]}22`, borderRadius: 8 }}>
                  <span style={{ fontSize: 13 }}>{["🥇","🥈","🥉"][i]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{p.role}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: cols[i], fontFamily: T.mono }}>{p.s}%</div>
                    <div style={{ fontSize: 9, color: T.muted }}>FIT</div>
                  </div>
                </div>
              );
            })}
          </Crd>
        </div>

        {/* Performance impact */}
        <Crd>
          <SecTitle>Performance Impact</SecTitle>
          {batting.slice(wk, wk + 3).map((p, i) => {
            const impact = Math.round(p.avg * .4 + p.sr * .35 + p.pressure * .25);
            const cols = [T.acc, T.blue, T.warn];
            return (
              <div key={p.id} style={{ marginBottom: 11 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{p.name.split(" ").slice(-1)[0]}</span>
                  <span style={{ fontSize: 11, color: cols[i], fontWeight: 700, fontFamily: T.mono }}>+{Math.round(impact * .8)}–{impact}</span>
                </div>
                <div style={{ height: 5, background: T.border, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(impact / 90) * 100}%`, height: "100%", background: cols[i], borderRadius: 3, transition: "width .6s" }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>PROJECTED TOTAL</div>
            <div style={{ fontSize: 25, fontWeight: 900, color: T.acc, fontFamily: T.mono }}>
              {score + batting.slice(wk).reduce((s, p) => s + Math.round(p.avg * .55), 0)}
            </div>
            <div style={{ fontSize: 10, color: T.muted }}>estimated final score</div>
          </div>
        </Crd>
      </div>
    </div>
  );
}
