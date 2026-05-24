import { useState } from 'react';
import { T } from '../utils/theme';
import { roleColor } from '../utils/helpers';
import { Av, Bdg, Crd, SecTitle } from './UI';

export default function Reports({ players }) {
  const [gen,  setGen]  = useState(false);
  const [done, setDone] = useState(false);

  const generate = () => {
    setGen(true);
    setTimeout(() => { setGen(false); setDone(true); }, 2200);
  };

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 15 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Reports & Strategy</h2>
        <p style={{ color: T.muted, fontSize: 13 }}>Based on your {players.length}-player dataset</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
        {/* PDF Generator */}
        <Crd>
          <SecTitle>Generate PDF Report</SecTitle>
          {["✅ Squad Performance Summary","✅ Batting Order Analysis","✅ Phase-wise Breakdown","✅ Player Comparison Charts","✅ AI Recommendations","✅ Win Probability Analysis","✅ Match Strategy Guide"].map((it) => (
            <div key={it} style={{ fontSize: 13, color: T.muted, padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>{it}</div>
          ))}
          <button onClick={generate} disabled={gen}
            style={{ marginTop: 14, width: "100%", background: gen ? T.border : `linear-gradient(135deg,${T.acc}cc,${T.blue}cc)`, border: "none", borderRadius: 9, padding: "12px", color: gen ? T.muted : "#000", fontWeight: 900, fontSize: 13, cursor: gen ? "default" : "pointer", letterSpacing: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {gen
              ? <><div style={{ width: 13, height: 13, border: `2px solid ${T.muted}`, borderTop: `2px solid ${T.acc}`, borderRadius: "50%" }} className="spin" />GENERATING…</>
              : done ? "✅ REPORT READY" : "📋 GENERATE PDF REPORT"
            }
          </button>
          {done && <div style={{ marginTop: 8, fontSize: 12, color: T.acc, textAlign: "center" }}>Report ready! (PDF export available in full deployment)</div>}
        </Crd>

        {/* Strategy */}
        <Crd>
          <SecTitle>Match Strategy</SecTitle>
          {[
            { phase: "Powerplay (1-6)", strategy: "Deploy aggressive openers. Target boundaries. Build 50–60 in this phase.", color: T.blue },
            { phase: "Middle (7-15)",   strategy: "Rotate strike, build partnerships. Target 8-9 RPO in overs 13-15.",       color: T.acc  },
            { phase: "Death (16-20)",   strategy: "Unleash your finisher. Target short balls. Back SR over average.",          color: T.warn },
          ].map((s) => {
            const kp = players.find((p) =>
              s.phase.includes("Powerplay") ? p.pos <= 2 :
              s.phase.includes("Death")     ? p.death    >= Math.max(...players.map((x) => x.death))    * .9 :
                                              p.avg      >= Math.max(...players.map((x) => x.avg))      * .85
            );
            return (
              <div key={s.phase} style={{ marginBottom: 11, background: T.bg, borderRadius: 9, padding: "11px 13px", borderLeft: `3px solid ${s.color}` }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: s.color, marginBottom: 3 }}>{s.phase}</div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, marginBottom: kp ? 6 : 0 }}>{s.strategy}</div>
                {kp && <Bdg color={s.color}>Key: {kp.name}</Bdg>}
              </div>
            );
          })}
        </Crd>
      </div>

      {/* Full squad table */}
      <Crd>
        <SecTitle>Squad Summary ({players.length} players)</SecTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: T.bg }}>
                {["Player","Role","Pos","Avg","SR","Cons","PP","Death","Pressure"].map((h) => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: T.muted, fontSize: 10, fontWeight: 700, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${T.border}22`, background: i % 2 === 0 ? "transparent" : `${T.border}12` }}>
                  <td style={{ padding: "7px 10px", fontWeight: 700, whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <Av name={p.name} size={20} color={T.blue} />{p.name}
                    </div>
                  </td>
                  <td style={{ padding: "7px 10px" }}><Bdg color={roleColor(p.role)}>{p.role}</Bdg></td>
                  <td style={{ padding: "7px 10px", color: T.muted, fontFamily: T.mono }}>#{p.pos}</td>
                  <td style={{ padding: "7px 10px", color: T.acc,  fontWeight: 700, fontFamily: T.mono }}>{p.avg}</td>
                  <td style={{ padding: "7px 10px", color: T.warn, fontWeight: 700, fontFamily: T.mono }}>{p.sr}</td>
                  {[p.cons, p.pp, p.death, p.pressure].map((v, ci) => {
                    const c = v >= 80 ? T.acc : v >= 60 ? T.warn : T.danger;
                    return <td key={ci} style={{ padding: "7px 10px", color: c, fontWeight: 700, fontFamily: T.mono }}>{v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Crd>
    </div>
  );
}
