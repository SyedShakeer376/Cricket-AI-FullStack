import { T } from '../utils/theme';

export default function NoData({ setTab }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "72vh", gap: 14, color: T.muted }}>
      <div style={{ fontSize: 52 }}>📂</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>No Dataset Loaded</div>
      <div style={{ fontSize: 13, textAlign: "center", lineHeight: 1.8, maxWidth: 380 }}>
        Upload your CSV player data to unlock all modules.<br />
        Analytics, AI engine, match analysis, and live dashboard<br />
        are all powered by your dataset.
      </div>
      <button onClick={() => setTab("upload")} className="glow-btn"
        style={{ background: `linear-gradient(135deg,${T.acc}cc,${T.blue}cc)`, border: "none", borderRadius: 10, padding: "12px 28px", color: "#000", fontWeight: 900, fontSize: 14, cursor: "pointer", letterSpacing: 1, marginTop: 4 }}>
        📂 GO TO DATA UPLOAD
      </button>
    </div>
  );
}
