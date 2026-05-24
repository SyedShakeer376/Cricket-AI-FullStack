import { T } from '../utils/theme';
import { initials } from '../utils/helpers';

export const Av = ({ name, color = T.acc, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `linear-gradient(135deg,${color}22,${color}44)`,
    border: `1.5px solid ${color}66`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * .27, fontWeight: 800, color, flexShrink: 0,
  }}>
    {initials(name)}
  </div>
);

export const Bdg = ({ children, color = T.acc }) => (
  <span style={{
    background: `${color}18`, border: `1px solid ${color}44`, color,
    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
    letterSpacing: .6, textTransform: "uppercase", whiteSpace: "nowrap",
  }}>
    {children}
  </span>
);

export const Crd = ({ children, style = {} }) => (
  <div style={{
    background: T.card, border: `1px solid ${T.border}`,
    borderRadius: 16, padding: 20, ...style,
  }}>
    {children}
  </div>
);

export const SecTitle = ({ children }) => (
  <div style={{
    fontWeight: 700, fontSize: 11, letterSpacing: .7,
    marginBottom: 13, color: T.muted, textTransform: "uppercase",
  }}>
    {children}
  </div>
);
