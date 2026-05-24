import { useState } from 'react';
import { useAuth } from '../utils/AuthContext';

const T = {
  bg:"#030b14", panel:"#06111e", card:"#091828", border:"#0d2540",
  acc:"#00e576", blue:"#1a8fff", warn:"#ffaa00", danger:"#ff3d3d",
  text:"#ddeeff", muted:"#3a6080",
};

export default function AuthScreen() {
  const { login, register } = useAuth();

  const [mode,     setMode]     = useState("login");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [role,     setRole]     = useState("Analyst");
  const [err,      setErr]      = useState("");
  const [success,  setSuccess]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const reset = () => { setErr(""); setSuccess(""); };

  const validate = () => {
    if (!email.trim())  return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address.";
    if (!pass)          return "Password is required.";
    if (pass.length < 6) return "Password must be at least 6 characters.";
    if (mode === "signup") {
      if (!name.trim()) return "Full name is required.";
      if (pass !== confirm) return "Passwords do not match.";
    }
    return null;
  };

  const submit = async () => {
    reset();
    const validationError = validate();
    if (validationError) { setErr(validationError); return; }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, pass);
        // AuthContext sets user → App re-renders to platform
      } else {
        await register(name, email, pass, role);
      }
    } catch (e) {
      setErr(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:T.bg, position:"relative", overflow:"hidden" }}>
      {/* Grid BG */}
      <div style={{ position:"fixed", inset:0, backgroundImage:`linear-gradient(${T.border}22 1px,transparent 1px),linear-gradient(90deg,${T.border}22 1px,transparent 1px)`, backgroundSize:"44px 44px", pointerEvents:"none" }} />
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 50% 20%,#1a8fff08 0%,transparent 65%)", pointerEvents:"none" }} />

      <div style={{ width:420, background:T.panel, border:`1px solid ${T.border}`, borderRadius:24, padding:36, position:"relative", zIndex:1, boxShadow:"0 24px 80px rgba(0,0,0,.5)" }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:58, height:58, borderRadius:16, background:`linear-gradient(135deg,${T.acc}22,${T.blue}22)`, border:`2px solid ${T.acc}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 12px" }}>🏏</div>
          <div style={{ fontSize:22, fontWeight:900, letterSpacing:2, color:T.acc }}>CRICKET·AI</div>
          <div style={{ fontSize:10, color:T.muted, letterSpacing:1.5, marginTop:2 }}>INTELLIGENCE PLATFORM</div>
        </div>

        {/* Mode toggle */}
        <div style={{ display:"flex", gap:4, background:T.bg, borderRadius:10, padding:4, marginBottom:22 }}>
          {["login","signup"].map((m) => (
            <button key={m} onClick={() => { setMode(m); reset(); }}
              style={{ flex:1, padding:"9px", borderRadius:7, border:`1px solid ${mode===m ? T.acc : T.border}`, background:mode===m ? `${T.acc}15`:"transparent", color:mode===m ? T.acc : T.muted, fontWeight:700, cursor:"pointer", fontSize:12, letterSpacing:1, transition:"all .2s" }}>
              {m === "login" ? "🔓 LOGIN" : "✏️ SIGN UP"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {mode === "signup" && (
            <div>
              <label style={{ fontSize:10, color:T.muted, letterSpacing:.5, display:"block", marginBottom:5 }}>FULL NAME</label>
              <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="e.g. Syed Shakeer"
                style={{ width:"100%", background:T.bg, border:`1px solid ${T.border}`, borderRadius:9, padding:"11px 13px", color:T.text, fontSize:13 }} />
            </div>
          )}

          <div>
            <label style={{ fontSize:10, color:T.muted, letterSpacing:.5, display:"block", marginBottom:5 }}>EMAIL ADDRESS</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown}
              type="email" placeholder="you@example.com"
              style={{ width:"100%", background:T.bg, border:`1px solid ${T.border}`, borderRadius:9, padding:"11px 13px", color:T.text, fontSize:13 }} />
          </div>

          <div>
            <label style={{ fontSize:10, color:T.muted, letterSpacing:.5, display:"block", marginBottom:5 }}>PASSWORD</label>
            <div style={{ position:"relative" }}>
              <input value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={handleKeyDown}
                type={showPass ? "text" : "password"} placeholder="Min 6 characters"
                style={{ width:"100%", background:T.bg, border:`1px solid ${T.border}`, borderRadius:9, padding:"11px 40px 11px 13px", color:T.text, fontSize:13 }} />
              <button onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:14, padding:0 }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label style={{ fontSize:10, color:T.muted, letterSpacing:.5, display:"block", marginBottom:5 }}>CONFIRM PASSWORD</label>
              <input value={confirm} onChange={(e) => setConfirm(e.target.value)} onKeyDown={handleKeyDown}
                type="password" placeholder="Re-enter password"
                style={{ width:"100%", background:T.bg, border:`1px solid ${T.border}`, borderRadius:9, padding:"11px 13px", color:T.text, fontSize:13 }} />
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label style={{ fontSize:10, color:T.muted, letterSpacing:.5, display:"block", marginBottom:7 }}>ACCESS ROLE</label>
              <div style={{ display:"flex", gap:6 }}>
                {[
                  { r:"Admin",   icon:"👑", desc:"Full access" },
                  { r:"Analyst", icon:"📊", desc:"Analysis tools" },
                  { r:"Viewer",  icon:"👁️", desc:"View only" },
                ].map(({ r, icon, desc }) => (
                  <button key={r} onClick={() => setRole(r)}
                    style={{ flex:1, padding:"10px 6px", borderRadius:9, border:`1px solid ${role===r ? T.acc : T.border}`, background:role===r ? `${T.acc}15`:"transparent", color:role===r ? T.acc : T.muted, cursor:"pointer", fontWeight:700, fontSize:11, display:"flex", flexDirection:"column", alignItems:"center", gap:3, transition:"all .2s" }}>
                    <span style={{ fontSize:16 }}>{icon}</span>
                    <span>{r}</span>
                    <span style={{ fontSize:9, opacity:.7 }}>{desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {err && (
            <div style={{ background:`${T.danger}12`, border:`1px solid ${T.danger}44`, borderRadius:8, padding:"9px 13px", color:T.danger, fontSize:12, display:"flex", alignItems:"center", gap:8 }}>
              ⚠️ {err}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{ background:`${T.acc}12`, border:`1px solid ${T.acc}44`, borderRadius:8, padding:"9px 13px", color:T.acc, fontSize:12 }}>
              ✅ {success}
            </div>
          )}

          {/* Submit */}
          <button onClick={submit} disabled={loading}
            style={{ background:loading ? T.border : `linear-gradient(135deg,${T.acc}cc,${T.blue}cc)`, border:"none", borderRadius:10, padding:"13px", color:loading ? T.muted : "#000", fontWeight:900, fontSize:14, cursor:loading ? "default":"pointer", letterSpacing:1, marginTop:4, display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all .2s" }}>
            {loading
              ? <><div style={{ width:14, height:14, border:`2px solid ${T.muted}`, borderTop:`2px solid ${T.acc}`, borderRadius:"50%", animation:"spin .7s linear infinite" }} />PLEASE WAIT…</>
              : mode === "login" ? "🚀 LAUNCH PLATFORM" : "✅ CREATE ACCOUNT"
            }
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign:"center", marginTop:18, fontSize:11, color:T.muted }}>
          {mode === "login"
            ? <>Don't have an account? <button onClick={() => { setMode("signup"); reset(); }} style={{ background:"none", border:"none", color:T.acc, cursor:"pointer", fontSize:11, fontWeight:700 }}>Sign up free</button></>
            : <>Already have an account? <button onClick={() => { setMode("login"); reset(); }} style={{ background:"none", border:"none", color:T.acc, cursor:"pointer", fontSize:11, fontWeight:700 }}>Login</button></>
          }
        </div>
      </div>
    </div>
  );
}
