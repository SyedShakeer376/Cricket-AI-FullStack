import { useState, useRef } from 'react';
import { T } from '../utils/theme';
import { parseCSV } from '../utils/helpers';
import { roleColor } from '../utils/helpers';
import { Crd, SecTitle, Bdg } from './UI';
import { fmt } from '../utils/helpers';

export default function DataUpload({ players, setPlayers, fileName, setFileName }) {
  const [dragging, setDragging] = useState(false);
  const [error,    setError]    = useState("");
  const [preview,  setPreview]  = useState(null);
  const fileRef = useRef();

  const processFile = (file) => {
    if (!file) return;
    if (!file.name.match(/\.csv$/i)) { setError("Please upload a .CSV file."); return; }
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseCSV(e.target.result);
      if (parsed.length === 0) { setError("No valid rows found. Ensure your CSV has: player name, average, strike_rate columns."); return; }
      setPreview({ data: parsed, name: file.name });
    };
    reader.readAsText(file);
  };

  const confirmUpload = () => { setPlayers(preview.data); setFileName(preview.name); setPreview(null); };
  const clear = () => { setPlayers(null); setFileName(null); setPreview(null); setError(""); if (fileRef.current) fileRef.current.value = ""; };
  const useSample = () => {
    // dynamically import sample to avoid circular deps
    import('../data/sampleData').then(m => { setPlayers(m.SAMPLE); setFileName("sample_cricket_data.csv"); setPreview(null); });
  };

  const downloadTemplate = () => {
    const csv = [
      "player,role,position,average,strike_rate,consistency,powerplay,death,pressure,runs,matches,hs",
      "Rohit Sharma,Opener,1,49,93,90,88,72,85,9283,243,264",
      "Virat Kohli,Middle Order,3,58,94,96,85,78,95,12900,292,254",
      "MS Dhoni,Finisher,6,50,127,93,72,98,99,10773,350,183",
      "Jasprit Bumrah,Bowler,10,12,65,56,40,35,52,493,120,35",
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "cricket_template.csv";
    a.click();
  };

  const hasData = players && players.length > 0;

  return (
    <div style={{ padding: 24, maxWidth: 920, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Data Management</h2>
        <p style={{ color: T.muted, fontSize: 13 }}>Upload your player CSV dataset — all modules are powered by your data</p>
      </div>

      {/* Active banner */}
      {hasData && !preview && (
        <div className="fu" style={{ background: `${T.acc}0e`, border: `1px solid ${T.acc}44`, borderRadius: 14, padding: "13px 17px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 20 }}>✅</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: T.acc, fontSize: 14 }}>{fileName}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{players.length} players loaded · All modules are using this dataset</div>
          </div>
          <button onClick={clear} style={{ background: "rgba(255,61,61,.12)", border: "1px solid rgba(255,61,61,.3)", borderRadius: 8, padding: "7px 14px", color: T.danger, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Remove Dataset
          </button>
        </div>
      )}

      {/* Drop zone */}
      <Crd style={{ marginBottom: 14 }}>
        <SecTitle>📂 Upload CSV Dataset</SecTitle>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current && fileRef.current.click()}
          style={{ border: `2px dashed ${dragging ? T.acc : T.border}`, borderRadius: 14, padding: "42px 20px", textAlign: "center", cursor: "pointer", background: dragging ? `${T.acc}08` : "transparent", transition: "all .25s", marginBottom: 12 }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>📊</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: dragging ? T.acc : T.text, marginBottom: 5 }}>
            {dragging ? "Release to upload" : "Drag & Drop your CSV file here"}
          </div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 14 }}>or click anywhere in this zone to browse files</div>
          <div style={{ display: "inline-block", background: `${T.blue}22`, border: `1px solid ${T.blue}44`, borderRadius: 8, padding: "8px 20px", color: T.blue, fontSize: 12, fontWeight: 700 }}>Choose File</div>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => processFile(e.target.files[0])} />
        </div>
        {error && <div style={{ color: T.danger, fontSize: 13, textAlign: "center", marginBottom: 10 }}>⚠️ {error}</div>}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={downloadTemplate} style={{ flex: 1, background: `${T.blue}12`, border: `1px solid ${T.blue}33`, borderRadius: 9, padding: "10px", color: T.blue, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>⬇️ Download CSV Template</button>
          <button onClick={useSample} style={{ flex: 1, background: `${T.acc}12`, border: `1px solid ${T.acc}33`, borderRadius: 9, padding: "10px", color: T.acc, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>⚡ Use Sample Dataset (11 players)</button>
        </div>
      </Crd>

      {/* Preview table */}
      {preview && (
        <div className="fu">
          <Crd style={{ marginBottom: 14 }}>
            <SecTitle>👁️ Preview — {preview.data.length} players detected from "{preview.name}"</SecTitle>
            <div style={{ overflowX: "auto", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    {["#","Name","Role","Pos","Avg","SR","Cons","PP","Death","Pressure","Runs","M","HS"].map((h) => (
                      <th key={h} style={{ padding: "7px 9px", textAlign: "left", color: T.muted, fontSize: 10, fontWeight: 700, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.data.slice(0, 20).map((p, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${T.border}22` }}>
                      <td style={{ padding: "6px 9px", color: T.muted, fontFamily: T.mono, fontSize: 11 }}>{i + 1}</td>
                      <td style={{ padding: "6px 9px", fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: "6px 9px" }}><Bdg color={roleColor(p.role)}>{p.role}</Bdg></td>
                      {[p.pos, p.avg, p.sr, p.cons, p.pp, p.death, p.pressure].map((v, ci) => (
                        <td key={ci} style={{ padding: "6px 9px", fontFamily: T.mono, color: T.acc, fontWeight: 700, fontSize: 12 }}>{v}</td>
                      ))}
                      <td style={{ padding: "6px 9px", fontFamily: T.mono, color: T.muted, fontSize: 11 }}>{fmt(p.runs)}</td>
                      <td style={{ padding: "6px 9px", fontFamily: T.mono, color: T.muted, fontSize: 11 }}>{p.matches}</td>
                      <td style={{ padding: "6px 9px", fontFamily: T.mono, color: T.warn, fontSize: 12, fontWeight: 700 }}>{p.hs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.data.length > 20 && <div style={{ textAlign: "center", color: T.muted, fontSize: 12, marginTop: 8 }}>…and {preview.data.length - 20} more players</div>}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPreview(null)} style={{ flex: 1, background: "rgba(255,61,61,.1)", border: "1px solid rgba(255,61,61,.3)", borderRadius: 9, padding: "11px", color: T.danger, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>✕ Cancel</button>
              <button onClick={confirmUpload} className="glow-btn" style={{ flex: 2, background: `linear-gradient(135deg,${T.acc}cc,${T.blue}cc)`, border: "none", borderRadius: 9, padding: "11px", color: "#000", fontWeight: 900, cursor: "pointer", fontSize: 13, letterSpacing: 1 }}>
                ✅ CONFIRM & LOAD — {preview.data.length} players
              </button>
            </div>
          </Crd>
        </div>
      )}

      {/* Column guide */}
      <Crd>
        <SecTitle>📋 Accepted CSV Column Names</SecTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 8, marginBottom: 14 }}>
          {[
            { col: "player / player_name / name", req: true,  desc: "Player's full name" },
            { col: "average / ave / avg",         req: true,  desc: "Batting average" },
            { col: "strike_rate / sr",            req: true,  desc: "Strike rate" },
            { col: "role",                        req: false, desc: "Opener / Middle Order / Finisher / All-Rounder / Bowler" },
            { col: "position / batting_position", req: false, desc: "Batting position 1–11" },
            { col: "consistency / cons",          req: false, desc: "Consistency (0–100)" },
            { col: "powerplay / pp",              req: false, desc: "Powerplay rating (0–100)" },
            { col: "death / death_overs",         req: false, desc: "Death overs rating (0–100)" },
            { col: "pressure",                    req: false, desc: "Pressure rating (0–100)" },
            { col: "runs / total_runs",           req: false, desc: "Career runs" },
            { col: "matches / innings",           req: false, desc: "Matches played" },
            { col: "hs / highest_score",          req: false, desc: "Highest score" },
            { col: "form",                        req: false, desc: "Recent form 1–10 scale" },
          ].map((c) => (
            <div key={c.col} style={{ background: T.panel, borderRadius: 8, padding: "9px 11px", border: `1px solid ${c.req ? `${T.acc}33` : T.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: c.req ? T.acc : T.text, fontFamily: T.mono, marginBottom: 3, lineHeight: 1.4 }}>{c.col}</div>
              <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.4 }}>{c.desc}</div>
              {c.req && <div style={{ fontSize: 9, color: T.acc, marginTop: 3, fontWeight: 700, letterSpacing: .5 }}>★ REQUIRED</div>}
            </div>
          ))}
        </div>
        <div style={{ padding: "11px 14px", background: `${T.warn}0a`, border: `1px solid ${T.warn}2a`, borderRadius: 8, fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
          💡 <strong style={{ color: T.warn }}>Auto-fill:</strong> Missing optional columns are derived automatically from average, strike_rate, and form. Only <strong style={{ color: T.warn }}>name, average, strike_rate</strong> are required.
        </div>
      </Crd>
    </div>
  );
}
