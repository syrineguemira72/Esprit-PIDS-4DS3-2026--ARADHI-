import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// CSS-in-JS: all original styles injected once
// ─────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
:root{
  --bg:#070b12;--surface:#0d1119;--card:#131820;--card2:#181f2b;
  --border:#1e2535;--border2:#2a3348;
  --gold:#d4a84b;--gold2:#f0cc78;--gold-dim:rgba(212,168,75,0.08);--gold-glow:rgba(212,168,75,0.15);
  --cyan:#00e5d4;--cyan-dim:rgba(0,229,212,0.07);--cyan-mid:rgba(0,229,212,0.2);
  --violet:#8b5cf6;--violet-dim:rgba(139,92,246,0.1);
  --green:#22d3a0;--green-dim:rgba(34,211,160,0.1);
  --red:#f05252;--red-dim:rgba(240,82,82,0.1);
  --blue:#3b82f6;--blue-dim:rgba(59,130,246,0.1);
  --text:#dde2ec;--muted:#5a6480;--muted2:#7a86a0;
  --olive:#3b4a2f;--green-tn:#22d3a0;
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;height:100vh;display:flex;flex-direction:column;overflow:hidden}
header{background:var(--surface);border-bottom:1px solid var(--border);padding:0 28px;height:58px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;gap:16px;position:relative;z-index:10}
header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold-glow),transparent)}
.brand{display:flex;align-items:center;gap:13px;flex-shrink:0}
.brand-logo{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#2a1f08,#5a3d0a);border:1px solid rgba(212,168,75,0.3);display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 12px rgba(212,168,75,0.1)}
.brand-name{font-family:'DM Serif Display',serif;font-size:22px;background:linear-gradient(135deg,var(--gold),var(--gold2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:2px}
.brand-tag{font-size:9px;color:var(--muted);letter-spacing:2.5px;text-transform:uppercase;margin-top:-3px}
.intent-bar{background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:5px 14px;display:flex;align-items:center;gap:8px;font-size:11px;transition:all .4s ease}
.intent-dot{width:6px;height:6px;border-radius:50%;background:var(--muted);transition:all .3s}
.intent-dot.chat{background:var(--gold);box-shadow:0 0 6px var(--gold-glow)}
.intent-dot.rag{background:var(--cyan);box-shadow:0 0 6px var(--cyan-mid)}
.intent-dot.premium{background:var(--violet);box-shadow:0 0 6px rgba(139,92,246,0.3)}
.intent-label{color:var(--muted2);letter-spacing:.5px;transition:color .3s}
.intent-label.active{color:var(--text)}
.api-zone{display:flex;align-items:center;gap:8px;font-size:11px}
.api-dot{width:6px;height:6px;border-radius:50%;background:var(--muted);transition:background .3s;flex-shrink:0}
.api-dot.ok{background:var(--green);animation:pulse 2s infinite}
.api-dot.err{background:var(--red)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.api-url-input{background:var(--card2);border:1px solid var(--border);border-radius:6px;color:var(--muted2);font-family:'JetBrains Mono',monospace;font-size:10px;padding:4px 10px;outline:none;width:240px;transition:border-color .2s}
.api-url-input:focus{border-color:var(--gold)}
.connect-btn{background:var(--gold-dim);border:1px solid var(--gold);border-radius:6px;color:var(--gold2);font-size:10px;padding:4px 8px;cursor:pointer;transition:all .2s}
.connect-btn:hover{background:var(--gold-glow)}
.app-body{flex:1;min-height:0;display:flex;overflow:hidden}
.sidebar{width:240px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto;flex-shrink:0}
.sidebar-section{padding:16px 14px;border-bottom:1px solid var(--border)}
.sidebar-title{font-size:8px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:10px}
.mode-pills{display:flex;flex-direction:column;gap:4px}
.mode-pill{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;cursor:default;border:1px solid transparent;font-size:11px;color:var(--muted2);font-weight:500;transition:all .25s}
.mode-pill .mp-icon{font-size:13px;width:18px;text-align:center}
.mode-pill .mp-badge{margin-left:auto;font-size:9px;padding:2px 6px;border-radius:10px;background:var(--card2);color:var(--muted);letter-spacing:.5px}
.mode-pill.active-chat{background:var(--gold-dim);border-color:rgba(212,168,75,0.2);color:var(--gold2)}
.mode-pill.active-chat .mp-badge{background:rgba(212,168,75,0.15);color:var(--gold)}
.mode-pill.active-rag{background:var(--cyan-dim);border-color:rgba(0,229,212,0.15);color:var(--cyan)}
.mode-pill.active-rag .mp-badge{background:rgba(0,229,212,0.1);color:var(--cyan)}
.mode-pill.active-premium{background:var(--violet-dim);border-color:rgba(139,92,246,0.2);color:#c4b5fd}
.mode-pill.active-premium .mp-badge{background:rgba(139,92,246,0.15);color:#c4b5fd}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.stat-mini{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:8px;text-align:center}
.stat-val{font-family:'DM Serif Display',serif;font-size:17px;color:var(--gold2)}
.stat-lbl{font-size:9px;color:var(--muted);margin-top:2px}
.q-prompt{width:100%;background:var(--card);border:1px solid var(--border);border-radius:7px;color:var(--text);font-size:10px;font-family:'DM Sans',sans-serif;text-align:left;padding:7px 9px;cursor:pointer;margin-bottom:5px;line-height:1.5;transition:border-color .2s,background .2s}
.q-prompt:hover{border-color:var(--gold);background:var(--gold-dim);color:var(--gold2)}
.qp-tag{display:inline-block;font-size:8px;padding:1px 5px;border-radius:4px;margin-bottom:3px;letter-spacing:.5px;text-transform:uppercase}
.qp-tag.chat{background:rgba(212,168,75,0.15);color:var(--gold)}
.qp-tag.rag{background:rgba(0,229,212,0.1);color:var(--cyan)}
.qp-tag.eval{background:rgba(139,92,246,0.15);color:#c4b5fd}
.main-content{flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden;position:relative}
.messages{flex:1;min-height:0;overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth}
.welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;text-align:center;padding:40px;gap:16px;min-height:300px}
.welcome-logo{width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#2a1f08,#5a3d0a);border:1px solid rgba(212,168,75,0.25);display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 8px 32px rgba(212,168,75,0.08)}
.welcome h2{font-family:'DM Serif Display',serif;font-size:24px;color:var(--gold2)}
.welcome p{font-size:12px;color:var(--muted2);max-width:400px;line-height:1.8}
.welcome-pills{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:4px}
.wpill{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:5px 12px;font-size:10px;color:var(--muted2);cursor:pointer;transition:all .2s}
.wpill:hover{color:var(--gold2);border-color:var(--gold);background:var(--gold-dim)}
.how-it-works{background:var(--card);border:1px solid var(--border2);border-radius:12px;padding:14px 18px;max-width:480px;text-align:left}
.how-it-works h3{font-size:11px;color:var(--gold2);margin-bottom:10px}
.how-row{display:flex;align-items:flex-start;gap:9px;margin-bottom:8px;font-size:11px}
.how-icon{width:20px;height:20px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0}
.hi-chat{background:rgba(212,168,75,0.12);color:var(--gold)}
.hi-rag{background:rgba(0,229,212,0.08);color:var(--cyan)}
.hi-eval{background:rgba(139,92,246,0.1);color:#c4b5fd}
.msg{display:flex;gap:10px;animation:rise .3s ease;max-width:820px}
.msg.user{flex-direction:row-reverse;align-self:flex-end}
@keyframes rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.avatar{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.avatar.bot{background:linear-gradient(135deg,var(--gold),#7a5a1a)}
.avatar.usr{background:var(--blue-dim);border:1px solid rgba(59,130,246,0.3);color:var(--blue)}
.bubble{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:11px 14px;font-size:12.5px;line-height:1.7;max-width:680px}
.msg.user .bubble{background:#0f1823;border-color:rgba(59,130,246,0.15)}
.mode-badge{display:inline-flex;align-items:center;gap:5px;font-size:9px;padding:2px 7px;border-radius:10px;margin-bottom:7px}
.mb-rag{background:rgba(0,229,212,0.1);color:var(--cyan);border:1px solid rgba(0,229,212,0.15)}
.mb-chat{background:var(--gold-dim);color:var(--gold);border:1px solid rgba(212,168,75,0.15)}
.mb-eval{background:rgba(139,92,246,0.1);color:#c4b5fd;border:1px solid rgba(139,92,246,0.15)}
.rag-results{display:flex;flex-direction:column;gap:7px;margin-top:10px}
.rag-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:11px 13px;transition:border-color .2s,transform .2s}
.rag-card:hover{border-color:var(--cyan);transform:translateX(3px)}
.rag-card-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px}
.rag-card-title{font-size:11.5px;font-weight:600;color:var(--text)}
.sim-pill{background:var(--cyan-dim);border:1px solid var(--cyan-mid);color:var(--cyan);font-size:9px;font-weight:700;padding:2px 7px;border-radius:8px;white-space:nowrap}
.rag-tags{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px}
.rtag{background:var(--card2);border:1px solid var(--border);border-radius:4px;padding:2px 6px;font-size:9px;color:var(--muted2)}
.rtag.v{border-color:rgba(34,211,160,0.2);color:var(--green)}
.rtag.l{border-color:rgba(59,130,246,0.2);color:var(--blue)}
.rag-price{font-family:'DM Serif Display',serif;font-size:15px;color:var(--gold2)}
.rag-bar{width:100%;height:3px;background:rgba(0,229,212,0.1);border-radius:2px;margin-top:8px;overflow:hidden}
.rag-fill{height:100%;background:linear-gradient(90deg,rgba(0,229,212,0.4),var(--cyan));border-radius:2px;transition:width 1s ease}
.typing{display:flex;align-items:center;gap:4px;padding:4px 0}
.typing span{width:5px;height:5px;border-radius:50%;background:var(--gold);animation:bounce 1.2s infinite}
.typing span:nth-child(2){animation-delay:.2s}
.typing span:nth-child(3){animation-delay:.4s}
@keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:.3}40%{transform:translateY(-4px);opacity:1}}
.chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}
.chip{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:3px 9px;font-size:10px;color:var(--muted2);cursor:pointer}
.chip:hover{color:var(--gold2);border-color:var(--gold)}
.input-zone{border-top:1px solid var(--border);background:var(--surface);padding:12px 20px;display:flex;gap:10px;align-items:flex-end;flex-shrink:0}
.input-wrap{flex:1;background:var(--card);border:1px solid var(--border2);border-radius:12px;display:flex;align-items:flex-end;padding:4px 4px 4px 14px}
.input-wrap:focus-within{border-color:var(--gold)}
.chat-textarea{flex:1;background:transparent;border:none;outline:none;color:var(--text);font-size:12.5px;resize:none;max-height:100px;min-height:36px;padding:8px 0;line-height:1.5;font-family:'DM Sans',sans-serif}
.send-btn{width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,var(--gold),#7a5a1a);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;margin:0 2px 2px 0;transition:opacity .2s;flex-shrink:0}
.send-btn:hover{opacity:.85}
.score-ring{text-align:center;padding:16px 0}
.score-num{font-family:'DM Serif Display',serif;font-size:52px;line-height:1}
.score-denom{font-size:24px}
.dim-bar{margin-bottom:10px}
.dim-bar-label{display:flex;justify-content:space-between;font-size:10px;margin-bottom:3px;color:var(--muted2)}
.dim-bar-track{height:4px;background:rgba(139,92,246,0.1);border-radius:2px;overflow:hidden}
.dim-bar-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--violet),#c4b5fd);transition:width 1.2s ease}
#toast{position:fixed;bottom:80px;right:20px;z-index:100;background:var(--card);border:1px solid var(--border2);border-radius:10px;padding:10px 16px;font-size:11px;opacity:0;transition:opacity .3s;pointer-events:none}
#toast.show{opacity:1}

/* Scroll styles - IMPORTANT: ces styles doivent être présents */
.message-container {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.messages-scroll {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.messages-scroll::-webkit-scrollbar {
  width: 6px;
}

.messages-scroll::-webkit-scrollbar-track {
  background: var(--card);
  border-radius: 3px;
}

.messages-scroll::-webkit-scrollbar-thumb {
  background: var(--gold-dim);
  border-radius: 3px;
}

.messages-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--gold);
}

.scroll-buttons {
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
}

.scroll-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--card);
  border: 1px solid var(--gold);
  color: var(--gold2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.scroll-btn:hover {
  background: var(--gold);
  color: var(--surface);
  transform: scale(1.1);
  border-color: var(--gold2);
}

.scroll-btn.up {
  animation: none;
}

.scroll-btn.down {
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

.scroll-indicator-bubble {
  position: absolute;
  right: 16px;
  bottom: 70px;
  background: var(--gold);
  color: var(--surface);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 10px;
  font-weight: bold;
  z-index: 99;
  animation: pulse 1s infinite;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.ia-estimate-btn {
  background: linear-gradient(135deg, var(--gold), #7a5a1a);
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.ia-estimate-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(212,168,75,0.3);
}
`;

// ─────────────────────────────────────────────
// UTILITIES (mirrors the original JS exactly)
// ─────────────────────────────────────────────
function normalizeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function detectModel(text) {
  const t = normalizeText(text);
  if (/evalue|score|analyse|audit|noter|premium|evaluer|notez/.test(t)) return "premium";
  if (/villa|appart|studio|piscine|jardin|garage|meuble|cherche|trouve|louer|location|s\+\d|budget|chambre|m2|dt /.test(t)) return "rag";
  return "chat";
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h;
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ─────────────────────────────────────────────
// RAG CARD RENDERER (returns JSX)
// ─────────────────────────────────────────────
function RagCard({ item }) {
  const score = 82 + Math.floor(Math.abs(hashCode(item.title || "")) % 18);
  const isLoc = (item.type || "").toLowerCase().includes("location");
  const badgeCls = isLoc ? "l" : "v";
  const badgeTxt = isLoc ? "✓ Location" : "✓ Vente";
  const sPlus = item.bedrooms != null ? `S+${item.bedrooms}` : "";

  return (
    <div className="rag-card">
      <div className="rag-card-top">
        <div className="rag-card-title">🏠 {item.title || "Bien immobilier"}</div>
        <div className="sim-pill">{score}% match</div>
      </div>
      <div className="rag-tags">
        <span className="rtag">📍 {item.ville || "—"}</span>
        <span className="rtag">🏗️ {item.property_type || ""}</span>
        <span className={`rtag ${badgeCls}`}>{badgeTxt}</span>
        <span className="rtag">📐 {item.area || 0} m²</span>
        {sPlus && <span className="rtag">🛏️ {sPlus}</span>}
        {(item.amenities || []).map((a, i) => (
          <span key={i} className="rtag">✓ {a}</span>
        ))}
      </div>
      <div className="rag-price">{(item.price || 0).toLocaleString("fr-FR")} DT</div>
      <div className="rag-bar">
        <div className="rag-fill" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PREMIUM SCORE RENDERER
// ─────────────────────────────────────────────
function PremiumScore({ data }) {
  const score = data.score || 0;
  const color = score >= 85 ? "#22d3a0" : score >= 70 ? "#d4a84b" : score >= 50 ? "#f7b733" : "#f05252";
  const dims = data.dimensions || {};

  return (
    <>
      <div className="mode-badge mb-eval">⭐ Évaluateur Premium · GPT-2 scoring</div>
      <div className="score-ring">
        <span className="score-num" style={{ color }}>
          {score}<span className="score-denom">/100</span>
        </span>
        <br />
        <strong style={{ fontSize: 13 }}>{data.categorie || ""}</strong>
      </div>
      {Object.keys(dims).length > 0 && (
        <div style={{ marginTop: 12 }}>
          {Object.entries(dims).map(([key, d]) => {
            const pct = ((d.score / 10) * 100).toFixed(0);
            return (
              <div key={key} className="dim-bar">
                <div className="dim-bar-label">
                  <span>{d.label}</span>
                  <span style={{ color: "var(--violet)" }}>
                    {d.score.toFixed(1)}/10 × {(d.poids * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="dim-bar-track">
                  <div className="dim-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                {d.justif && (
                  <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>{d.justif}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {data.recommandation && (
        <div style={{ marginTop: 10, padding: 10, background: "var(--card2)", borderRadius: 8, fontSize: 11, color: "var(--muted2)" }}>
          💡 {data.recommandation}
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────
function Message({ msg }) {
  if (msg.role === "user") {
    return (
      <div className="msg user">
        <div className="avatar usr">U</div>
        <div className="bubble">{msg.content}</div>
      </div>
    );
  }

  if (msg.type === "typing") {
    return (
      <div className="msg bot">
        <div className="avatar bot">A</div>
        <div className="bubble">
          <div className="typing">
            <span /><span /><span />
          </div>
        </div>
      </div>
    );
  }

  // Bot message — content can be JSX or string
  return (
    <div className="msg bot">
      <div className="avatar bot">A</div>
      <div className="bubble">{msg.content}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function AqariaApp() {
  const [apiBase, setApiBase] = useState(() => localStorage.getItem("aqaria_api_url") || "");
  const [apiUrlInput, setApiUrlInput] = useState(() => localStorage.getItem("aqaria_api_url") || "");
  const [apiStatus, setApiStatus] = useState({ dot: "", text: "—", biens: "—", villes: "—" });
  const [activeMode, setActiveMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [toast, setToast] = useState({ text: "", show: false });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  
  const messagesEndRef = useRef(null);
  const messagesScrollRef = useRef(null);
  const textareaRef = useRef(null);
  const lastScrollTopRef = useRef(0);

  // Inject styles once
  useEffect(() => {
    const id = "aqaria-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = STYLES;
      document.head.appendChild(style);
    }
  }, []);

  // Scroll handler
  const handleScroll = () => {
    if (messagesScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesScrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      
      setShowScrollTop(scrollTop > 100);
      
      if (isAtBottom) {
        setShowScrollIndicator(false);
        setNewMessagesCount(0);
      }
      
      lastScrollTopRef.current = scrollTop;
    }
  };

  // Check if not at bottom when new messages arrive
  useEffect(() => {
    if (messagesScrollRef.current && messages.length > 0) {
      const { scrollTop, scrollHeight, clientHeight } = messagesScrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      
      if (!isAtBottom && lastScrollTopRef.current !== scrollTop) {
        setShowScrollIndicator(true);
        setNewMessagesCount(prev => prev + 1);
      }
    }
  }, [messages]);

  // Add scroll listener
  useEffect(() => {
    const wrapper = messagesScrollRef.current;
    if (wrapper) {
      wrapper.addEventListener('scroll', handleScroll);
      return () => wrapper.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive if already at bottom
  useEffect(() => {
    if (messagesScrollRef.current && messages.length > 0) {
      const { scrollTop, scrollHeight, clientHeight } = messagesScrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      if (isAtBottom) {
        scrollToBottom();
      }
    }
  }, [messages]);

  // ── Toast helper ──
  const showToast = (text) => {
    setToast({ text, show: true });
    setTimeout(() => setToast({ text: "", show: false }), 3000);
  };

  // ── API check ──
  const checkAPI = async (base, forceToast = false) => {
    const url = base || apiBase;
    if (!url) {
      setApiStatus({ dot: "err", text: "URL non définie", biens: "—", villes: "—" });
      return false;
    }
    try {
      const res = await fetch(`${url}/api/status`, { signal: AbortSignal.timeout(8000) });
      const data = await res.json();
      setApiStatus({
        dot: "ok",
        text: `✅ ${data.biens || "?"} biens`,
        biens: (data.biens || 0).toLocaleString("fr-FR"),
        villes: (data.villes || []).length,
      });
      if (forceToast) showToast("✅ API AQARIA connectée !");
      return true;
    } catch {
      setApiStatus({ dot: "err", text: "⚠️ Hors ligne", biens: "—", villes: "—" });
      if (forceToast) showToast("❌ API inaccessible. Vérifiez le tunnel Cloudflare.");
      return false;
    }
  };

  const connectAPI = async () => {
    const newUrl = apiUrlInput.trim().replace(/\/$/, "");
    if (!newUrl) { showToast("⚠️ Collez l'URL Cloudflare !"); return; }
    setApiBase(newUrl);
    localStorage.setItem("aqaria_api_url", newUrl);
    await checkAPI(newUrl, true);
  };

  useEffect(() => { checkAPI(apiBase); }, []);

  // ── Mode helpers ──
  const modeLabels = {
    chat: "💬 Chatbot LLM — GPT-2 génératif",
    rag: "🔎 RAG + Extraction JSON — GPT-2 greedy",
    premium: "⭐ Évaluateur Premium — GPT-2 scoring",
  };

  const pillState = (pillName) => {
    if (!activeMode) return "";
    if (pillName === "chat" && activeMode === "chat") return "active-chat";
    if (pillName === "rag" && (activeMode === "rag")) return "active-rag";
    if (pillName === "extract" && activeMode === "rag") return "active-rag";
    if (pillName === "premium" && activeMode === "premium") return "active-premium";
    return "";
  };

  const pillBadge = (pillName) => {
    if (!activeMode) return "STANDBY";
    if (pillName === "chat" && activeMode === "chat") return "ACTIF";
    if (pillName === "rag" && activeMode === "rag") return "ACTIF";
    if (pillName === "extract" && activeMode === "rag") return "ACTIF";
    if (pillName === "premium" && activeMode === "premium") return "ACTIF";
    return "STANDBY";
  };

  // ── Add messages ──
  const addMsg = (msg) => setMessages(prev => [...prev, msg]);

  const addTypingId = () => {
    const id = `typing-${Date.now()}`;
    setMessages(prev => [...prev, { id, type: "typing", role: "bot" }]);
    return id;
  };

  const removeTypingMsg = (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  // ── Open chat interface ──
  const openChatInterface = () => {
    setShowWelcome(false);
    scrollToBottom();
    if (messages.length === 0) {
      addMsg({ 
        role: "bot", 
        content: "👋 Bonjour ! Je suis AQARIA, votre assistant IA immobilier. Posez-moi vos questions sur les biens immobiliers, les prix, ou demandez une évaluation premium !" 
      });
    }
    showToast("💬 Interface de chat ouverte");
  };

  // ── Scroll functions ──
  const scrollToTop = () => {
    if (messagesScrollRef.current) {
      messagesScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setShowScrollIndicator(false);
      setNewMessagesCount(0);
    }
  };

  const scrollToBottom = () => {
    if (messagesScrollRef.current) {
      messagesScrollRef.current.scrollTo({ 
        top: messagesScrollRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
      setShowScrollIndicator(false);
      setNewMessagesCount(0);
    }
  };

  // ── API calls ──
  async function handleChat(text, base) {
    const tid = addTypingId();
    try {
      const res = await fetch(`${base}/api/recommander`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, n: 0 }),
      });
      const data = await res.json();
      removeTypingMsg(tid);
      const resp = data.response || {};
      const reply = resp.text || data.error || "Désolé, je n'ai pas pu répondre.";
      addMsg({
        role: "bot",
        content: (
          <><div className="mode-badge mb-chat">💬 Chatbot LLM · GPT-2 génératif</div><br />{reply}</>
        ),
      });
    } catch (e) {
      removeTypingMsg(tid);
      addMsg({ role: "bot", content: <><div className="mode-badge mb-chat">💬 Chatbot LLM</div><br />❌ Erreur : {e.message}</> });
    }
  }

  async function handleRAG(text, base) {
    const tid = addTypingId();
    try {
      const res = await fetch(`${base}/api/recommander`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, n: 6 }),
      });
      const data = await res.json();
      removeTypingMsg(tid);
      const resp = data.response || {};
      const biens = resp.biens || [];
      const chips = resp.chips || [];

      if (biens.length > 0) {
        addMsg({
          role: "bot",
          content: (
            <>
              <div className="mode-badge mb-rag">🔎 RAG Sémantique · Extraction JSON · GPT-2</div>
              <br />
              {resp.text && <div style={{ marginBottom: 8, fontSize: 12 }}>{resp.text}</div>}
              <strong>{biens.length} bien(s)</strong> pour "<em>{text.slice(0, 60)}</em>"
              {chips.length > 0 && (
                <div className="chips" style={{ margin: "6px 0" }}>
                  {chips.map((c, i) => <span key={i} className="chip">{c}</span>)}
                </div>
              )}
              <div className="rag-results">
                {biens.map((item, i) => <RagCard key={i} item={item} />)}
              </div>
            </>
          ),
        });
      } else {
        const msg = resp.text || resp.note || "Aucun bien trouvé. Essayez avec moins de filtres.";
        addMsg({
          role: "bot",
          content: <><div className="mode-badge mb-rag">🔎 RAG · Extraction JSON</div><br />{msg}</>,
        });
      }
    } catch (e) {
      removeTypingMsg(tid);
      addMsg({ role: "bot", content: <><div className="mode-badge mb-rag">🔎 RAG</div><br />❌ Erreur : {e.message}</> });
    }
  }

  async function handlePremium(text, base) {
    const tid = addTypingId();
    try {
      const res = await fetch(`${base}/api/evaluer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text }),
      });
      const data = await res.json();
      removeTypingMsg(tid);
      if (data.error) {
        addMsg({ role: "bot", content: <><div className="mode-badge mb-eval">⭐ Évaluateur Premium</div><br />❌ {data.error}</> });
        return;
      }
      addMsg({ role: "bot", content: <PremiumScore data={data} /> });
    } catch (e) {
      removeTypingMsg(tid);
      addMsg({ role: "bot", content: <><div className="mode-badge mb-eval">⭐ Évaluateur Premium</div><br />❌ Erreur : {e.message}</> });
    }
  }

  // ── Send ──
  const send = async (overrideText) => {
    const text = (overrideText || inputVal).trim();
    if (!text) return;
    setInputVal("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const base = apiBase;
    const connected = await checkAPI(base);
    if (!connected) {
      addMsg({ role: "user", content: text });
      addMsg({ role: "bot", content: "⚠️ API déconnectée. Collez votre URL Cloudflare et cliquez sur Connecter." });
      return;
    }

    const mode = detectModel(text);
    setActiveMode(mode);
    setShowWelcome(false);
    addMsg({ role: "user", content: text });

    if (mode === "premium") await handlePremium(text, base);
    else if (mode === "rag") await handleRAG(text, base);
    else await handleChat(text, base);
  };

  const usePrompt = (text) => {
    setInputVal(text);
    const mode = detectModel(text);
    setActiveMode(mode);
    send(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
    if (e.target.value.trim().length > 3) {
      setActiveMode(detectModel(e.target.value.trim()));
    }
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <>
      <div id="toast" className={toast.show ? "show" : ""}>{toast.text}</div>

      {/* ── Header ── */}
      <header>
        <div className="brand">
          <div className="brand-logo">🏠</div>
          <div>
            <div className="brand-name">AQARIA</div>
            <div className="brand-tag">Plateforme IA Immobilière · GPT-2 Fine-tuné · PFE</div>
          </div>
        </div>

        <div className="header-actions">
          <button className="ia-estimate-btn" onClick={openChatInterface}>
            <span>🤖</span> IA Estimate
          </button>

          <div className="intent-bar">
            <div className={`intent-dot ${activeMode || ""}`} />
            <span className={`intent-label ${activeMode ? "active" : ""}`}>
              {activeMode ? modeLabels[activeMode] : "En attente..."}
            </span>
          </div>
        </div>

        <div className="api-zone">
          <div className={`api-dot ${apiStatus.dot}`} />
          <span style={{ fontSize: 11, color: "var(--muted)" }}>API :</span>
          <input
            className="api-url-input"
            type="text"
            placeholder="https://xxx.trycloudflare.com"
            value={apiUrlInput}
            onChange={e => setApiUrlInput(e.target.value)}
          />
          <button className="connect-btn" onClick={connectAPI}>🔗 Connecter</button>
          <span style={{ fontSize: 10, color: "var(--muted)" }}>{apiStatus.text}</span>
        </div>
      </header>

      <div className="app-body">
        {/* ── Sidebar ── */}
        <div className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Modèle détecté</div>
            <div className="mode-pills">
              {[
                { key: "chat", icon: "💬", label: "Chatbot LLM" },
                { key: "rag", icon: "🔎", label: "RAG Sémantique" },
                { key: "premium", icon: "⭐", label: "Évaluateur Premium" },
                { key: "extract", icon: "🧬", label: "Extraction JSON" },
              ].map(({ key, icon, label }) => (
                <div key={key} className={`mode-pill ${pillState(key)}`}>
                  <span className="mp-icon">{icon}</span> {label}
                  <span className="mp-badge">{pillBadge(key)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Statistiques Dataset</div>
            <div className="stats-grid">
              <div className="stat-mini"><div className="stat-val">{apiStatus.biens}</div><div className="stat-lbl">Biens</div></div>
              <div className="stat-mini"><div className="stat-val">124M</div><div className="stat-lbl">Params</div></div>
              <div className="stat-mini"><div className="stat-val">{apiStatus.villes}</div><div className="stat-lbl">Villes</div></div>
              <div className="stat-mini"><div className="stat-val">GPT-2</div><div className="stat-lbl">Modèle</div></div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Exemples de prompts</div>
            {[
              { tag: "chat", text: "Quelle est la différence entre vente et location ?", label: "Différence vente/location ?" },
              { tag: "rag", text: "Villa avec piscine à La Marsa, budget 800 000 DT", label: "Villa piscine La Marsa" },
              { tag: "rag", text: "Appartement S+2 à louer à Ariana avec garage", label: "Appart S+2 Ariana location" },
              { tag: "eval", text: "Évalue cette villa de luxe avec piscine, jardin 1200m², La Marsa, marbre, domotique", label: "Évaluer villa La Marsa" },
              { tag: "chat", text: "Quels sont les meilleurs quartiers pour investir à Tunis ?", label: "Meilleurs quartiers Tunis" },
            ].map(({ tag, text, label }) => (
              <button key={text} className="q-prompt" onClick={() => usePrompt(text)}>
                <span className={`qp-tag ${tag}`}>{tag === "eval" ? "Score" : tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
                <br />{label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main content with scroll arrows ── */}
        <div className="main-content">
          <div className="message-container">
            <div className="messages-scroll" ref={messagesScrollRef}>
              {showWelcome && (
                <div className="welcome">
                  <div className="welcome-logo">🏠</div>
                  <h2>AQARIA — Intelligence Artificielle Immobilière</h2>
                  <p>Interface unifiée avec détection automatique de l'intention. Le bon modèle GPT-2 s'active selon votre demande.</p>
                  <div className="how-it-works">
                    <h3>🎯 Détection automatique du modèle</h3>
                    <div className="how-row">
                      <div className="how-icon hi-chat">💬</div>
                      <div><strong>Chatbot LLM :</strong> questions générales, conseils, prix moyens, tendances du marché</div>
                    </div>
                    <div className="how-row">
                      <div className="how-icon hi-rag">🔎</div>
                      <div><strong>RAG + Extraction JSON :</strong> "villa", "appartement", "piscine", "budget", "S+2", "louer"...</div>
                    </div>
                    <div className="how-row">
                      <div className="how-icon hi-eval">⭐</div>
                      <div><strong>Évaluateur Premium :</strong> "évalue", "score", "analyse", "audit", "note"...</div>
                    </div>
                  </div>
                  <div className="welcome-pills">
                    <span className="wpill" onClick={() => usePrompt("Villa avec piscine à La Marsa")}>🔎 Villa piscine La Marsa</span>
                    <span className="wpill" onClick={() => usePrompt("Quel est le prix moyen d'une villa à Carthage ?")}>💬 Prix Carthage</span>
                    <span className="wpill" onClick={() => usePrompt("Évalue villa S+4 jardin garage Gammarth 380m2 piscine")}>⭐ Évaluer</span>
                    <span className="wpill" onClick={() => usePrompt("Appartement S+3 meublé à Ariana, budget 300 000 DT")}>🔎 Appart Ariana</span>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => <Message key={msg.id || idx} msg={msg} />)}
              <div ref={messagesEndRef} />
            </div>

            {/* SCROLL BUTTONS - Ces boutons apparaissent toujours ! */}
            <div className="scroll-buttons">
              {showScrollTop && (
                <button className="scroll-btn up" onClick={scrollToTop} title="Défiler vers le haut">
                  ▲
                </button>
              )}
              <button className="scroll-btn down" onClick={scrollToBottom} title="Défiler vers le bas">
                ▼
              </button>
            </div>

            {/* INDICATEUR DE NOUVEAUX MESSAGES */}
            {showScrollIndicator && newMessagesCount > 0 && (
              <div className="scroll-indicator-bubble" onClick={scrollToBottom}>
                ↓ {newMessagesCount} nouveau{newMessagesCount > 1 ? 'x' : ''} message{newMessagesCount > 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="input-zone">
            <div className="input-wrap">
              <textarea
                ref={textareaRef}
                className="chat-textarea"
                rows={1}
                placeholder="Décrivez ce que vous cherchez, posez une question, ou demandez une évaluation..."
                value={inputVal}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <button className="send-btn" onClick={() => send()}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="#fff">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}