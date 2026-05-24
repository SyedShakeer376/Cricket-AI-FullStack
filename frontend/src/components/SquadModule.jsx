import { useState, useEffect } from 'react';
import { T } from '../utils/theme';
import { roleColor, fmt } from '../utils/helpers';
import { Av, Bdg, Crd, SecTitle } from './UI';
import { BarRow, Radar, LineChart } from './Charts';

export default function SquadModule({ players }) {
  const [sel,    setSel]    = useState(players[0]);
  const [search, setSearch] = useState("");
  const [fRole,  setFRole]  = useState("All");

  useEffect(() => { setSel(players[0]); }, [players]);

  const roles = ["All", ...new Set(players.map((p) => p.role))];
  const list = players.filter((p) =>
    (fRole === "All" || p.role === fRole) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 24, display: "grid", gridTemplateColumns: "290px 1fr", gap: 16, minHeight: "80vh" }}>
      {/* Left panel */}
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 11 }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search player…"
            style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 9, padding: "9px 12px", color: T.text, fontSize: 13, width: "100%" }} />
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {roles.map((r) => (
              <button key={r} onClick={() => setFRole(r)}
                style={{ background: fRole === r ? `${T.acc}20` : "transparent", border: `1px solid ${fRole === r ? T.acc : T.border}`, borderRadius: 5, padding: "3px 9px", color: fRole === r ? T.acc : T.muted, cursor: "pointer", fontSize: 10, fontWeight: 700 }}>
                {r}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: T.muted }}>{list.length}/{players.length} players</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: "65vh", overflowY: "auto" }}>
          {list.map((p) => (
            <div key={p.id} onClick={() => setSel(p)}
              style={{ background: sel && sel.id === p.id ? `${T.acc}0f` : T.panel, border: `1px solid ${sel && sel.id === p.id ? T.acc : T.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, transition: "all .15s" }}>
              <Av name={p.name} color={roleColor(p.role)} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 1 }}>{p.role} · #{p.pos}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: T.acc, fontFamily: T.mono }}>{p.avg}</div>
                <div style={{ fontSize: 9, color: T.muted }}>avg</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right detail */}
      {sel && (
        <div key={sel.id} className="fu" style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <Crd>
            <div style={{ display: "flex", gap: 17, alignItems: "center", flexWrap: "wrap" }}>
              <Av name={sel.name} color={roleColor(sel.role)} size={58} />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>{sel.name}</h2>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  <Bdg color={roleColor(sel.role)}>{sel.role}</Bdg>
                  <Bdg color={T.muted}>#{sel.pos} Position</Bdg>
                  <Bdg color={T.blue}>{sel.bat}</Bdg>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                {[{ l: "Matches", v: sel.matches }, { l: "Total Runs", v: fmt(sel.runs) }, { l: "Highest", v: sel.hs }].map((s) => (
                  <div key={s.l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 19, fontWeight: 900, color: T.acc, fontFamily: T.mono }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Crd>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
            <Crd>
              <SecTitle>Performance Metrics</SecTitle>
              <BarRow label="Batting Average"  value={sel.avg}      max={70}  color={T.acc}     />
              <BarRow label="Strike Rate"      value={sel.sr}       max={160} color={T.warn}    />
              <BarRow label="Consistency"      value={sel.cons}     max={100} color={T.blue}    />
              <BarRow label="Powerplay"        value={sel.pp}       max={100} color="#cc88ff"   />
              <BarRow label="Death Overs"      value={sel.death}    max={100} color="#ff6688"   />
              <BarRow label="Under Pressure"   value={sel.pressure} max={100} color="#44ccff"   />
            </Crd>
            <Crd style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <SecTitle>Strength Radar</SecTitle>
              <Radar player={sel} size={190} />
            </Crd>
          </div>

          <Crd>
            <SecTitle>Recent Form Trend</SecTitle>
            <LineChart data={[sel.avg-10, sel.avg+14, sel.avg-4, sel.avg+22, sel.avg-1, sel.avg+16, sel.avg+6]} color={T.acc} h={80} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              {["M-6","M-5","M-4","M-3","M-2","M-1","Last"].map((m) => <span key={m} style={{ fontSize: 9, color: T.muted }}>{m}</span>)}
            </div>
          </Crd>
        </div>
      )}
    </div>
  );
}
