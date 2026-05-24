export const initials = (n) =>
  n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export const fmt = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

export const roleColor = (r) =>
  r === "Opener"       ? "#1a8fff" :
  r === "Middle Order" ? "#00e576" :
  r === "Finisher"     ? "#ffaa00" :
  r === "All-Rounder"  ? "#cc88ff" : "#3a6080";

export const aiScore = (p, phase, pitch, wk) => {
  let s = p.avg * 0.35 + p.sr * 0.22 + p.cons * 0.18;
  if (phase.includes("Powerplay")) s += p.pp * 0.25;
  else if (phase.includes("Death")) s += p.death * 0.3;
  else s += ((p.pp + p.death) / 2) * 0.2;
  if (pitch === "Batting Friendly") s *= 1.06;
  if (pitch === "Spinning" && p.bat === "LHB") s *= 1.05;
  if (wk >= 5) s *= (p.pressure / 100) * 1.15;
  return Math.min(99, Math.round(s * 0.41));
};

export const winProb = (score, wk, overs, target) => {
  if (!target) return 50;
  const rrr = (target - score) / Math.max(20 - overs, 0.1);
  return Math.max(5, Math.min(95, Math.round(100 - rrr * 8 + (score / target * 30) - wk * 4)));
};

export const parseCSV = (text) => {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""));

  const alias = {
    player: "name", player_name: "name", name: "name",
    role: "role", batting_style: "bat", bat: "bat",
    position: "pos", batting_position: "pos", pos: "pos", order: "pos",
    average: "avg", batting_average: "avg", ave: "avg", avg: "avg",
    strike_rate: "sr", sr: "sr", strikerate: "sr",
    consistency: "cons", cons: "cons",
    powerplay: "pp", pp: "pp",
    death_overs: "death", death: "death",
    pressure: "pressure",
    runs: "runs", total_runs: "runs",
    matches: "matches", innings: "matches",
    highest_score: "hs", hs: "hs", high_score: "hs",
    form: "form",
  };

  return lines
    .slice(1)
    .filter((l) => l.trim())
    .map((line, idx) => {
      const vals = line.split(",").map((v) => v.trim());
      const row = {};
      headers.forEach((h, i) => {
        const k = alias[h] || h;
        row[k] = vals[i] || "";
      });

      const num = (k, fb) => {
        const v = parseFloat(row[k]);
        return isNaN(v) ? fb : Math.round(v);
      };
      const str = (k, fb) => (row[k] && row[k] !== "" ? row[k] : fb);

      const avgV = num("avg", 20);
      const srV  = num("sr",  80);
      const formV = num("form", 5);
      const fp = formV * 10;

      return {
        id:       idx + 1,
        name:     str("name", `Player ${idx + 1}`),
        role:     str("role", srV >= 130 ? "Finisher" : avgV >= 45 ? "Middle Order" : avgV >= 35 ? "Opener" : "Bowler"),
        bat:      str("bat", "RHB"),
        pos:      num("pos", idx + 1),
        avg:      avgV,
        sr:       srV,
        cons:     num("cons",     Math.min(95, Math.round(avgV * 1.4 + fp * 0.3))),
        pp:       num("pp",       Math.min(95, Math.round(srV  * 0.55 + fp * 0.25))),
        death:    num("death",    Math.min(98, Math.round(srV  * 0.62 + fp * 0.2))),
        pressure: num("pressure", Math.min(99, Math.round(avgV * 1.2  + fp * 0.35))),
        runs:     num("runs",     avgV * 40),
        matches:  num("matches",  50),
        hs:       num("hs",       Math.round(avgV * 2.2)),
      };
    });
};
