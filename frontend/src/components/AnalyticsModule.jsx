import { useState } from 'react';
import { T } from '../utils/theme';
import { roleColor } from '../utils/helpers';
import { Av, Bdg, Crd, SecTitle } from './UI';
import { HBar, Radar } from './Charts';

export default function AnalyticsModule({ players }) {
  const [cA, setCA] = useState(players[0]);
  const [cB, setCB] = useState(players[Math.min(2, players.length - 1)]);

  const t8avg = [...players].sort((a,b) => b.avg - a.avg).slice(0,8).map((p) => ({ n: p.name.split(" ").slice(-1)[0], avg: p.avg }));
  const t8sr  = [...players].sort((a,b) => b.sr  - a.sr).slice(0,8).map((p) => ({ n: p.name.split(" ").slice(-1)[0], sr:  p.sr  }));

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 15 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Performance Analytics</h2>
        <p style={{ color: T.muted, fontSize: 13 }}>{players.length} players · from your dataset</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
        <Crd><SecTitle>Top Batting Averages</SecTitle><HBar data={t8avg} vk="avg" lk="n" color={T.acc}  max={80}  /></Crd>
        <Crd><SecTitle>Top Strike Rates</SecTitle>    <HBar data={t8sr}  vk="sr"  lk="n" color={T.warn} max={170} /></Crd>
      </div>

      {/* Heatmap */}
      <Crd>
        <SecTitle>Phase Performance Heatmap</SecTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "6px 10px", color: T.muted, fontSize: 10, fontWeight: 700 }}>PLAYER</th>
                {["Powerplay","Middle","Death","Pressure","Consistency"].map((h) => (
                  <th key={h} style={{ textAlign: "center", padding: "6px 10px", color: T.muted, fontSize: 10, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.slice(0, 12).map((p) => {
                const cells = [p.pp, Math.round((p.pp + p.death) / 2), p.death, p.pressure, p.cons];
                return (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${T.border}22` }}>
                    <td style={{ padding: "6px 10px", fontWeight: 700 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Av name={p.name} size={21} color={T.blue} />
                        {p.name.split(" ").slice(-1)[0]}
                      </div>
                    </td>
                    {cells.map((v, ci) => {
                      const c = v >= 80 ? T.acc : v >= 60 ? T.warn : T.danger;
                      return (
                        <td key={ci} style={{ textAlign: "center", padding: "5px 10px" }}>
                          <div style={{ background: `${c}18`, color: c, borderRadius: 5, padding: "3px 7px", fontWeight: 700, fontFamily: T.mono, fontSize: 12, display: "inline-block", minWidth: 34 }}>{v}</div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Crd>

      {/* Comparison */}
      <Crd>
        <SecTitle>Player Comparison</SecTitle>
        <div style={{ display: "flex", gap: 10, marginBottom: 17 }}>
          {[{ v: cA, set: setCA, c: T.acc }, { v: cB, set: setCB, c: T.pink }].map((s, i) => (
            <select key={i} value={s.v.id} onChange={(e) => s.set(players.find((p) => p.id === +e.target.value))}
              style={{ flex: 1, background: T.bg, border: `1px solid ${s.c}55`, borderRadius: 8, padding: "8px 12px", color: s.c, fontSize: 12, fontWeight: 700 }}>
              {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          {[cA, cB].map((p, pi) => {
            const col = pi === 0 ? T.acc : T.pink;
            return (
              <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Av name={p.name} color={col} size={38} />
                  <div>
                    <div style={{ fontWeight: 800, color: col, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{p.role}</div>
                  </div>
                </div>
                <Radar player={p} size={155} />
              </div>
            );
          })}
        </div>

        {[
          { l: "Batting Avg", a: cA.avg,      b: cB.avg,      mx: 70  },
          { l: "Strike Rate", a: cA.sr,       b: cB.sr,       mx: 160 },
          { l: "Consistency", a: cA.cons,     b: cB.cons,     mx: 100 },
          { l: "Pressure",    a: cA.pressure, b: cB.pressure, mx: 100 },
        ].map((m) => (
          <div key={m.l} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
              <span style={{ color: T.acc,  fontWeight: 700 }}>{m.a}</span>
              <span style={{ color: T.muted }}>{m.l}</span>
              <span style={{ color: T.pink, fontWeight: 700 }}>{m.b}</span>
            </div>
            <div style={{ display: "flex", gap: 3, height: 7 }}>
              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", background: `${T.acc}12`, borderRadius: "3px 0 0 3px", overflow: "hidden" }}>
                <div style={{ width: `${(m.a / m.mx) * 100}%`, background: T.acc, borderRadius: "3px 0 0 3px" }} />
              </div>
              <div style={{ flex: 1, background: `${T.pink}12`, borderRadius: "0 3px 3px 0", overflow: "hidden" }}>
                <div style={{ width: `${(m.b / m.mx) * 100}%`, background: T.pink, borderRadius: "0 3px 3px 0" }} />
              </div>
            </div>
          </div>
        ))}
      </Crd>
    </div>
  );
}
