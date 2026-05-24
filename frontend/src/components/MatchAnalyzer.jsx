import { useState } from 'react';
import { T, PHASES, PITCHES, OPPS, VENUES } from '../utils/theme';
import { aiScore, winProb } from '../utils/helpers';
import { roleColor } from '../utils/helpers';
import { Av, Bdg, Crd, SecTitle } from './UI';
import { WinMeter } from './Charts';

export default function MatchAnalyzer({ players }) {
  const [form, setForm] = useState({ score:45, wickets:2, overs:8, target:180, phase:PHASES[0], opp:OPPS[0], pitch:PITCHES[0], venue:VENUES[0] });
  const [result, setResult] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const analyze = () => {
    const wp  = winProb(form.score, form.wickets, form.overs, form.target);
    const top = [...players]
      .filter((p) => p.pos > form.wickets)
      .map((p) => ({ ...p, aiS: aiScore(p, form.phase, form.pitch, form.wickets) }))
      .sort((a, b) => b.aiS - a.aiS)
      .slice(0, 3);
    setResult({ top, wp });
  };

  const NI = (label, key, max) => (
    <div>
      <div style={{ fontSize: 10, color: T.muted, marginBottom: 4, letterSpacing: .5 }}>{label}</div>
      <input type="number" value={form[key]} min={0} max={max} onChange={(e) => set(key, +e.target.value)}
        style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 11px", color: T.text, fontSize: 13 }} />
    </div>
  );

  const SI = (label, key, opts) => (
    <div>
      <div style={{ fontSize: 10, color: T.muted, marginBottom: 4, letterSpacing: .5 }}>{label}</div>
      <select value={form[key]} onChange={(e) => set(key, e.target.value)}
        style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 11px", color: T.text, fontSize: 13 }}>
        {opts.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ padding: 24, display: "grid", gridTemplateColumns: "330px 1fr", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>Match Analyzer</h2>
        <p style={{ color: T.muted, fontSize: 12, marginBottom: 14 }}>Set live conditions → get AI recommendations</p>
        <Crd style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            {NI("SCORE",   "score",   400)}
            {NI("WICKETS", "wickets", 10)}
            {NI("OVERS",   "overs",   20)}
            {NI("TARGET",  "target",  400)}
          </div>
          {SI("MATCH PHASE", "phase", PHASES)}
          {SI("OPPOSITION",  "opp",   OPPS)}
          {SI("PITCH TYPE",  "pitch", PITCHES)}
          {SI("VENUE",       "venue", VENUES)}
          <button onClick={analyze} className="glow-btn"
            style={{ background: `linear-gradient(135deg,${T.acc}cc,${T.blue}cc)`, border: "none", borderRadius: 9, padding: "12px", color: "#000", fontWeight: 900, fontSize: 13, cursor: "pointer", letterSpacing: 1, marginTop: 4 }}>
            ⚡ ANALYZE SITUATION
          </button>
        </Crd>
      </div>

      <div>
        {!result ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 12, color: T.muted }}>
            <div style={{ fontSize: 48 }}>⚡</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Set match conditions &amp; click Analyze</div>
          </div>
        ) : (
          <div className="fu" style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
              <Crd style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <WinMeter prob={result.wp} />
                <div style={{ display: "flex", gap: 18, marginTop: 4 }}>
                  {[
                    { l: "Run Rate", v: (form.score / Math.max(form.overs, 1)).toFixed(1) },
                    { l: "Req RR",   v: ((form.target - form.score) / Math.max(20 - form.overs, .1)).toFixed(1) },
                  ].map((s) => (
                    <div key={s.l} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 17, fontWeight: 900, color: T.blue, fontFamily: T.mono }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: T.muted }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </Crd>
              <Crd>
                <SecTitle>Match Snapshot</SecTitle>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { l: "Score",  v: `${form.score}/${form.wickets}` },
                    { l: "Overs",  v: `${form.overs}/20` },
                    { l: "Phase",  v: form.phase.split(" ")[0] },
                    { l: "Pitch",  v: form.pitch.split(" ")[0] },
                    { l: "vs",     v: form.opp },
                    { l: "Needed", v: form.target - form.score },
                  ].map((s) => (
                    <div key={s.l} style={{ background: T.bg, borderRadius: 7, padding: "7px 10px" }}>
                      <div style={{ fontSize: 10, color: T.muted, marginBottom: 1 }}>{s.l}</div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </Crd>
            </div>

            <Crd>
              <SecTitle>🏏 AI Recommended Batsmen (from your dataset)</SecTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {result.top.map((p, i) => {
                  const cols = [T.acc, T.blue, T.warn];
                  return (
                    <div key={p.id} style={{ background: `${cols[i]}08`, border: `1px solid ${cols[i]}33`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 13 }}>
                      <div style={{ fontSize: 22 }}>{["🥇","🥈","🥉"][i]}</div>
                      <Av name={p.name} color={cols[i]} size={40} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{p.role} · {p.bat}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                          <Bdg color={cols[i]}>AVG {p.avg}</Bdg>
                          <Bdg color={T.muted}>SR {p.sr}</Bdg>
                          <Bdg color={T.muted}>#{p.pos}</Bdg>
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 26, fontWeight: 900, color: cols[i], fontFamily: T.mono, lineHeight: 1 }}>{p.aiS}%</div>
                        <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>CONFIDENCE</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Crd>
          </div>
        )}
      </div>
    </div>
  );
}
