import { T } from '../utils/theme';

const NAV = [
  { id: "dashboard", icon: "⬡",  label: "Dashboard"     },
  { id: "upload",    icon: "📂", label: "Data Upload"    },
  { id: "squad",     icon: "👥", label: "Squad"          },
  { id: "analytics", icon: "📊", label: "Analytics"      },
  { id: "match",     icon: "⚡", label: "Match Analyzer" },
  { id: "ai",        icon: "🧠", label: "AI Engine"      },
  { id: "live",      icon: "🎯", label: "Live Dashboard" },
  { id: "reports",   icon: "📋", label: "Reports"        },
];

export default function Sidebar({ active, setActive, user, onLogout, hasData }) {
  return (
    <div style={{ width: 212, background: T.panel, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh", position: "sticky", top: 0 }}>
      {/* Logo */}
      <div style={{ padding: "17px 13px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 33, height: 33, borderRadius: 9, background: `linear-gradient(135deg,${T.acc}22,${T.blue}22)`, border: `1.5px solid ${T.acc}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏏</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: 2, color: T.acc }}>CRICKET·AI</div>
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>INTELLIGENCE PLATFORM</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "9px 6px", display: "flex", flexDirection: "column", gap: 1 }}>
        {NAV.map((n) => {
          const locked = n.id !== "dashboard" && n.id !== "upload" && !hasData;
          return (
            <button key={n.id} onClick={() => !locked && setActive(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "9px 10px", borderRadius: 8, border: "none",
                background: active === n.id ? `linear-gradient(90deg,${T.acc}14,${T.blue}06)` : "transparent",
                color: active === n.id ? T.acc : locked ? `${T.muted}44` : T.muted,
                cursor: locked ? "not-allowed" : "pointer",
                fontWeight: active === n.id ? 700 : 500,
                fontSize: 13, textAlign: "left",
                borderLeft: `2px solid ${active === n.id ? T.acc : "transparent"}`,
                transition: "all .15s", opacity: locked ? .45 : 1,
              }}>
              <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{n.icon}</span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.id === "upload" && !hasData && (
                <span style={{ fontSize: 9, background: `${T.warn}22`, color: T.warn, padding: "1px 5px", borderRadius: 3, fontWeight: 700, letterSpacing: .4 }}>NOW</span>
              )}
              {locked && <span style={{ fontSize: 10, opacity: .5 }}>🔒</span>}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div style={{ padding: "10px 13px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 29, height: 29, borderRadius: "50%", background: `${T.blue}22`, border: `1.5px solid ${T.blue}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: T.blue }}>
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 10, color: T.muted }}>{user.role}</div>
          </div>
        </div>
        <button onClick={onLogout}
          style={{ width: "100%", background: "rgba(255,61,61,.1)", border: "1px solid rgba(255,61,61,.22)", borderRadius: 7, padding: "7px", color: T.danger, fontSize: 11, cursor: "pointer", fontWeight: 700, letterSpacing: .4 }}>
          LOGOUT
        </button>
      </div>
    </div>
  );
}
