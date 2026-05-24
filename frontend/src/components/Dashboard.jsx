import { T } from '../utils/theme';
import { Crd, SecTitle, Av } from './UI';
import { LineChart } from './Charts';

export default function Dashboard({ players, setTab, fileName, hasRealData }) {
  const topB = [...players].sort((a, b) => b.avg - a.avg)[0];
  const topS = [...players].sort((a, b) => b.sr  - a.sr)[0];

  return (
    <div style={{ padding: 24 }}>
      <div className="fu" style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: 1 }}>Command Center</h1>
        {hasRealData
          ? <p style={{ color: T.muted, fontSize: 13, marginTop: 3 }}>Dataset: <span style={{ color: T.acc, fontWeight: 700 }}>{fileName}</span> · {players.length} players loaded</p>
          : <p style={{ fontSize: 13, marginTop: 3, color: T.warn }}>
              ⚠️ Using sample data —{" "}
              <button onClick={() => setTab("upload")} style={{ background: "none", border: "none", color: T.acc, cursor: "pointer", fontSize: 13, fontWeight: 700, textDecoration: "underline", padding: 0 }}>
                Upload your CSV dataset
              </button>
              {" "}to power all modules
            </p>
        }
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 11, marginBottom: 17 }}>
        {[
          { l: "SQUAD SIZE",  v: players.length, sub: "Players loaded",   c: T.acc  },
          { l: "TOP AVERAGE", v: topB.avg,        sub: topB.name,          c: T.blue },
          { l: "BEST SR",     v: topS.sr,         sub: topS.name,          c: T.warn },
          { l: "AI ACCURACY", v: "91%",           sub: "Model confidence", c: T.acc  },
        ].map((s, i) => (
          <div key={s.l} className="fu" style={{ animationDelay: `${i * 60}ms`, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 11, padding: "13px 15px" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.c, fontFamily: T.mono, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4, letterSpacing: .5 }}>{s.l}</div>
            <div style={{ fontSize: 10, color: `${s.c}88`, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 13 }}>
        <Crd>
          <SecTitle>Squad Form Trend</SecTitle>
          <LineChart data={players.slice(0, 7).map((p) => p.avg)} color={T.acc} h={90} />
        </Crd>
        <Crd>
          <SecTitle>Top 5 by Average</SecTitle>
          {[...players].sort((a, b) => b.avg - a.avg).slice(0, 5).map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.muted, width: 14 }}>#{i + 1}</div>
              <Av name={p.name} color={i === 0 ? T.warn : T.blue} size={25} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</div>
                <div style={{ height: 3, background: T.border, borderRadius: 2, marginTop: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(p.avg / 70) * 100}%`, height: "100%", background: i === 0 ? T.warn : T.acc, borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 900, color: i === 0 ? T.warn : T.acc, fontFamily: T.mono }}>{p.avg}</div>
            </div>
          ))}
        </Crd>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9 }}>
        {[
          { l: "Upload Data",    icon: "📂", tab: "upload", c: T.acc   },
          { l: "Squad",         icon: "👥", tab: "squad",  c: T.blue  },
          { l: "AI Engine",     icon: "🧠", tab: "ai",     c: "#cc88ff" },
          { l: "Live Dashboard",icon: "🎯", tab: "live",   c: T.warn  },
        ].map((a) => (
          <button key={a.tab} onClick={() => setTab(a.tab)}
            style={{ background: `${a.c}10`, border: `1px solid ${a.c}33`, borderRadius: 12, padding: "16px 10px", color: a.c, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, transition: "all .2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = `${a.c}1e`}
            onMouseLeave={(e) => e.currentTarget.style.background = `${a.c}10`}>
            <span style={{ fontSize: 22 }}>{a.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: .3 }}>{a.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
