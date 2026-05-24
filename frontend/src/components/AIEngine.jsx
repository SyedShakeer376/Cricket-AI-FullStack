import { useState, useEffect, useRef } from 'react';
import { T, PHASES, PITCHES } from '../utils/theme';
import { Bdg, Crd, SecTitle } from './UI';

export default function AIEngine({ players }) {
  const [msgs,    setMsgs]    = useState([{ role: "assistant", text: `🧠 AI Cricket Engine online. ${players.length} players loaded from your dataset. Ask me about batting order, player selection, or phase tactics!` }]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [phase,   setPhase]   = useState(PHASES[0]);
  const [pitch,   setPitch]   = useState(PITCHES[0]);
  const [wk,      setWk]      = useState(2);
  const chatRef = useRef();

  useEffect(() => { chatRef.current && chatRef.current.scrollTo(0, chatRef.current.scrollHeight); }, [msgs]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setMsgs((m) => [...m, { role: "user", text: msg }]);
    setInput(""); setLoading(true);

    const sys = `You are an elite cricket AI analyst. Context: Phase=${phase}, Pitch=${pitch}, Wickets=${wk}.
Squad (${players.length} players): ${JSON.stringify(players.map((p) => ({ name:p.name, role:p.role, pos:p.pos, avg:p.avg, sr:p.sr, pp:p.pp, death:p.death, pressure:p.pressure })))}.
Give expert tactical advice using this data. Be specific, cite player names and stats. Max 4 sentences.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages: [{ role: "user", content: msg }] }),
      });
      const d = await res.json();
      setMsgs((m) => [...m, { role: "assistant", text: d.content?.[0]?.text || "Analysis unavailable." }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", text: "❌ Engine error. Please retry." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 24, display: "grid", gridTemplateColumns: "245px 1fr", gap: 15, height: "calc(100vh - 60px)" }}>
      {/* Context panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Crd>
          <SecTitle>Analysis Context</SecTitle>
          {[{ l: "PHASE", v: phase, set: setPhase, opts: PHASES }, { l: "PITCH", v: pitch, set: setPitch, opts: PITCHES }].map((f) => (
            <div key={f.l} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 4, letterSpacing: .5 }}>{f.l}</div>
              <select value={f.v} onChange={(e) => f.set(e.target.value)}
                style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 7, padding: "7px 10px", color: T.text, fontSize: 12 }}>
                {f.opts.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>WICKETS: <span style={{ color: T.acc, fontWeight: 700 }}>{wk}</span></div>
            <input type="range" min={0} max={9} value={wk} onChange={(e) => setWk(+e.target.value)} style={{ width: "100%", accentColor: T.acc }} />
          </div>
        </Crd>

        <Crd style={{ flex: 1 }}>
          <SecTitle>Quick Queries</SecTitle>
          {["Best batting order?","Who handles pressure best?","Best opener?","Recommend No.3 batsman","Who to send at death?","Best finisher?"].map((q) => (
            <button key={q} onClick={() => setInput(q)}
              style={{ width: "100%", background: `${T.acc}06`, border: `1px solid ${T.border}`, borderRadius: 7, padding: "8px 10px", color: T.muted, cursor: "pointer", fontSize: 11, textAlign: "left", marginBottom: 5, lineHeight: 1.4, transition: "all .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.acc}44`; e.currentTarget.style.color = T.acc; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}>
              {q}
            </button>
          ))}
        </Crd>
      </div>

      {/* Chat panel */}
      <div style={{ display: "flex", flexDirection: "column", background: T.panel, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.acc, animation: "pulse 2s infinite" }} />
          <div style={{ fontWeight: 700, fontSize: 13, color: T.acc, letterSpacing: 1 }}>AI CRICKET ENGINE</div>
          <Bdg color={T.blue}>{players.length} players loaded</Bdg>
        </div>

        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} className="fu" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "82%", padding: "10px 14px",
                borderRadius: m.role === "user" ? "15px 15px 4px 15px" : "4px 15px 15px 15px",
                background: m.role === "user" ? `linear-gradient(135deg,${T.blue}cc,${T.acc}88)` : T.card,
                border: m.role === "assistant" ? `1px solid ${T.border}` : "none",
                fontSize: 13, lineHeight: 1.6, color: T.text }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 5, padding: "10px 14px", background: T.card, borderRadius: "4px 15px 15px 15px", border: `1px solid ${T.border}`, width: 68 }}>
              {[0,1,2].map((i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.acc, animation: `pulse 1s ${i * .15}s infinite` }} />)}
            </div>
          )}
        </div>

        <div style={{ padding: 11, borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about batting order, player selection, tactics…"
            style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 9, padding: "10px 13px", color: T.text, fontSize: 13 }} />
          <button onClick={send} disabled={!input.trim() || loading}
            style={{ background: input.trim() ? `linear-gradient(135deg,${T.acc},${T.blue})` : T.border, border: "none", borderRadius: 9, padding: "10px 16px", color: input.trim() ? "#000" : T.muted, fontWeight: 900, cursor: "pointer", fontSize: 15, transition: "all .2s" }}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
