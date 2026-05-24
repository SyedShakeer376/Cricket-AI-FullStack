import { useState } from 'react';
import { useAuth } from './utils/AuthContext';
import { SAMPLE } from './data/sampleData';

import AuthScreen      from './components/AuthScreen';
import Sidebar         from './components/Sidebar';
import Dashboard       from './components/Dashboard';
import DataUpload      from './components/DataUpload';
import SquadModule     from './components/SquadModule';
import AnalyticsModule from './components/AnalyticsModule';
import MatchAnalyzer   from './components/MatchAnalyzer';
import AIEngine        from './components/AIEngine';
import LiveDashboard   from './components/LiveDashboard';
import Reports         from './components/Reports';
import NoData          from './components/NoData';

// Loading spinner shown while checking existing session
function LoadingScreen() {
  return (
    <div style={{ minHeight:"100vh", background:"#030b14", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <div style={{ fontSize:40 }}>🏏</div>
      <div style={{ width:32, height:32, border:"3px solid #0d2540", borderTop:"3px solid #00e576", borderRadius:"50%", animation:"spin .7s linear infinite" }} />
      <div style={{ color:"#3a6080", fontSize:13, letterSpacing:1 }}>LOADING…</div>
    </div>
  );
}

export default function App() {
  const { user, loading, logout } = useAuth();

  const [tab,      setTab]      = useState("dashboard");
  const [players,  setPlayers]  = useState(null);
  const [fileName, setFileName] = useState(null);

  // While checking session token
  if (loading) return <LoadingScreen />;

  // Not logged in → show auth screen
  if (!user) return <AuthScreen />;

  const handleSetPlayers = (p) => {
    setPlayers(p);
    if (p && p.length > 0) setTab("squad");
  };

  const hasData       = players && players.length > 0;
  const activePlayers = hasData ? players : SAMPLE;

  const views = {
    dashboard: <Dashboard      players={activePlayers} setTab={setTab} fileName={fileName || "sample_cricket_data.csv"} hasRealData={hasData} />,
    upload:    <DataUpload     players={players || []} setPlayers={handleSetPlayers} fileName={fileName} setFileName={setFileName} />,
    squad:     hasData ? <SquadModule     players={activePlayers} /> : <NoData setTab={setTab} />,
    analytics: hasData ? <AnalyticsModule players={activePlayers} /> : <NoData setTab={setTab} />,
    match:     hasData ? <MatchAnalyzer   players={activePlayers} /> : <NoData setTab={setTab} />,
    ai:        hasData ? <AIEngine        players={activePlayers} /> : <NoData setTab={setTab} />,
    live:      hasData ? <LiveDashboard   players={activePlayers} /> : <NoData setTab={setTab} />,
    reports:   hasData ? <Reports         players={activePlayers} /> : <NoData setTab={setTab} />,
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#030b14" }}>
      <Sidebar
        active={tab}
        setActive={setTab}
        user={user}
        onLogout={logout}
        hasData={hasData}
      />
      <main style={{ flex:1, overflowY:"auto", minWidth:0 }}>
        {views[tab]}
      </main>
    </div>
  );
}
