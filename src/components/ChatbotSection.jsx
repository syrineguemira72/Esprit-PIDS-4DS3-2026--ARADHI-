import { useState, useEffect, useRef } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
:root{
  --bg:#ffffff;
  --surface:#f8f9fc;
  --card:#ffffff;
  --card2:#f2f4f8;
  --border:#e2e8f0;
  --border2:#cbd5e1;
  --gold:#b8860b;
  --gold2:#d4af37;
  --gold-dim:rgba(184,134,11,0.08);
  --gold-glow:rgba(184,134,11,0.12);
  --cyan:#0e7c6d;
  --cyan-dim:rgba(14,124,109,0.07);
  --cyan-mid:rgba(14,124,109,0.15);
  --violet:#6d28d9;
  --violet-dim:rgba(109,40,217,0.08);
  --green:#2e7d64;
  --green-dim:rgba(46,125,100,0.1);
  --red:#dc2626;
  --red-dim:rgba(220,38,38,0.1);
  --blue:#2563eb;
  --blue-dim:rgba(37,99,235,0.08);
  --text:#1e293b;
  --muted:#64748b;
  --muted2:#94a3b8;
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;display:flex;flex-direction:column;overflow-y:auto}
::-webkit-scrollbar {width:6px;}
::-webkit-scrollbar-track {background:#eef2f6;border-radius:10px;}
::-webkit-scrollbar-thumb {background:#b8860b;border-radius:10px;}
::-webkit-scrollbar-thumb:hover {background:#d4af37;}
header{background:var(--surface);border-bottom:1px solid var(--border);padding:0 28px;height:58px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;gap:16px;z-index:10}
.brand{display:flex;align-items:center;gap:13px}
.brand-logo{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#f5e6d3,#e4c8a0);border:1px solid rgba(184,134,11,0.3);display:flex;align-items:center;justify-content:center;font-size:16px}
.brand-name{font-family:'DM Serif Display',serif;font-size:22px;background:linear-gradient(135deg,var(--gold),var(--gold2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.intent-bar{background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:5px 14px;display:flex;align-items:center;gap:8px;font-size:11px}
.intent-dot{width:6px;height:6px;border-radius:50%;background:var(--muted)}
.intent-dot.chat{background:var(--gold)}
.intent-dot.rag{background:var(--cyan)}
.intent-dot.premium{background:var(--violet)}
.intent-dot.price{background:var(--green)}
.intent-label{color:var(--muted2)}
.intent-label.active{color:var(--text)}
.api-zone{display:flex;align-items:center;gap:8px;font-size:11px}
.api-dot{width:6px;height:6px;border-radius:50%;background:var(--muted)}
.api-dot.ok{background:var(--green);animation:pulse 2s infinite}
.api-dot.err{background:var(--red)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.api-url-input{background:var(--card2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:10px;padding:4px 10px;width:240px}
.connect-btn{background:var(--gold-dim);border:1px solid var(--gold);border-radius:6px;color:var(--gold);font-size:10px;padding:4px 8px;cursor:pointer}
.app-body{flex:1;display:flex;overflow:hidden}
.main-content{flex:1;display:flex;flex-direction:column;overflow:hidden}
.messages{flex:1;overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:14px}
.welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;gap:16px}
.welcome-logo{width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#f5e6d3,#e4c8a0);border:1px solid rgba(184,134,11,0.25);display:flex;align-items:center;justify-content:center;font-size:26px}
.welcome h2{font-family:'DM Serif Display',serif;font-size:24px;color:var(--gold)}
.welcome p{font-size:12px;color:var(--muted2)}
.welcome-pills{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}
.wpill{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:5px 12px;font-size:10px;cursor:pointer}
.msg{display:flex;gap:10px;max-width:820px}
.msg.user{flex-direction:row-reverse;align-self:flex-end}
.avatar{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px}
.avatar.bot{background:linear-gradient(135deg,var(--gold),#b8860b)}
.avatar.usr{background:var(--blue-dim);border:1px solid rgba(37,99,235,0.3);color:var(--blue)}
.bubble{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:11px 14px;font-size:12.5px;line-height:1.7}
.msg.user .bubble{background:#eef2ff}
.mode-badge{display:inline-flex;align-items:center;gap:5px;font-size:9px;padding:2px 7px;border-radius:10px;margin-bottom:7px}
.mb-rag{background:rgba(14,124,109,0.1);color:var(--cyan);border:1px solid rgba(14,124,109,0.15)}
.mb-chat{background:rgba(184,134,11,0.1);color:var(--gold);border:1px solid rgba(184,134,11,0.15)}
.mb-eval{background:rgba(109,40,217,0.1);color:var(--violet);border:1px solid rgba(109,40,217,0.15)}
.mb-price{background:rgba(46,125,100,0.1);color:var(--green);border:1px solid rgba(46,125,100,0.15)}
.price-result{text-align:center;padding:15px 0}
.price-number{font-family:'DM Serif Display',serif;font-size:42px;color:var(--green)}
.price-m2{font-size:11px;color:var(--muted2)}
.price-range-box{background:var(--card2);border-radius:8px;padding:10px;margin-top:10px}
.price-range-details{display:flex;justify-content:space-between;margin-bottom:5px;font-size:10px}
.price-bar{height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin:8px 0}
.price-bar-fill{height:100%;width:75%;background:linear-gradient(90deg,var(--gold),var(--gold2))}
.price-range-text{font-size:10px;color:var(--muted)}
.price-features{font-size:9px;color:var(--muted);margin-top:10px}
.rag-results{display:flex;flex-direction:column;gap:7px;margin-top:10px}
.rag-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:11px 13px}
.rag-card-top{display:flex;justify-content:space-between;margin-bottom:6px}
.rag-card-title{font-size:11.5px;font-weight:600}
.sim-pill{background:var(--cyan-dim);border:1px solid var(--cyan-mid);color:var(--cyan);font-size:9px;padding:2px 7px;border-radius:8px}
.rag-tags{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px}
.rtag{background:var(--card2);border:1px solid var(--border);border-radius:4px;padding:2px 6px;font-size:9px}
.rag-price{font-size:15px;color:var(--gold)}
.rag-bar{height:3px;background:rgba(14,124,109,0.1);border-radius:2px;margin-top:8px}
.rag-fill{height:100%;background:linear-gradient(90deg,rgba(14,124,109,0.4),var(--cyan));border-radius:2px}
.typing{display:flex;gap:4px;padding:4px 0}
.typing span{width:5px;height:5px;border-radius:50%;background:var(--gold);animation:bounce 1.2s infinite}
@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-4px)}}
.input-zone{border-top:1px solid var(--border);background:var(--surface);padding:12px 20px;display:flex;gap:10px}
.input-wrap{flex:1;background:var(--card);border:1px solid var(--border2);border-radius:12px;display:flex;align-items:flex-end;padding:4px 4px 4px 14px}
.chat-textarea{flex:1;background:transparent;border:none;outline:none;color:var(--text);font-size:12.5px;resize:none;padding:8px 0}
.send-btn{width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,var(--gold),#b8860b);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center}
.score-ring{text-align:center;padding:16px 0}
.score-num{font-size:52px}
#toast{position:fixed;bottom:80px;right:20px;background:var(--card);border:1px solid var(--border2);border-radius:10px;padding:10px 16px;font-size:11px;opacity:0;transition:opacity .3s}
#toast.show{opacity:1}
`;

function normalizeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function detectModel(text) {
  const t = normalizeText(text);
  if (/prix|estimer|estimation|combien|coute|vaut|cout|tarif|prix moyen|prix m2|quel est le prix|estimez|price|estimate|how much|cost|value/.test(t)) {
    return "price";
  }
  if (/evalue|score|analyse|audit|premium|evaluer|evaluate|notation|note/.test(t)) {
    return "premium";
  }
  if (/villa|appart|studio|piscine|jardin|garage|rent|buy|pool|garden|trouve|cherche|location/.test(t)) {
    return "rag";
  }
  return "chat";
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h;
}

function extractFeaturesFromText(text) {
  const t = text.toLowerCase();

  let surface = 100;
  const surfaceMatch = t.match(/(\d+)\s*m[²2]?/);
  if (surfaceMatch) surface = parseInt(surfaceMatch[1]);

  let pieces = 3;
  const piecesMatch = t.match(/s\+(\d)/);
  if (piecesMatch) pieces = parseInt(piecesMatch[1]);

  let sdb = 2;
  const sdbMatch = t.match(/(\d+)\s*salle(s)?\s*de\s*bain/);
  if (sdbMatch) sdb = parseInt(sdbMatch[1]);

  let ville = "Tunis";
  const villes = ["La Marsa", "Carthage", "Sidi Bou Said", "Gammarth", "Tunis", "Ariana", "Sousse", "Hammamet", "Sfax", "Nabeul"];
  for (const v of villes) {
    if (t.includes(v.toLowerCase())) { ville = v; break; }
  }

  let typeBien = "Appartement";
  if (t.includes("villa")) typeBien = "Villa";
  if (t.includes("maison")) typeBien = "Maison";
  if (t.includes("studio")) typeBien = "Studio";

  let transaction = "vente";
  if (t.includes("location") || t.includes("louer") || t.includes("loyer") || t.includes("rent")) {
    transaction = "location";
  }

  const piscine = t.includes("piscine") || t.includes("pool");
  const jardin = t.includes("jardin") || t.includes("garden");
  const garage = t.includes("garage") || t.includes("parking");
  const terrasse = t.includes("terrasse") || t.includes("terrace");
  const ascenseur = t.includes("ascenseur") || t.includes("elevator");
  const climatisation = t.includes("climatisation") || t.includes("clim") || t.includes("ac");

  return { surface, pieces, sdb, ville, typeBien, transaction, piscine, jardin, garage, terrasse, ascenseur, climatisation };
}

function PriceResult({ data, features }) {
  return (
    <div>
      <div className="mode-badge mb-price">💰 Price Prediction · XGBoost</div>
      <div className="price-result">
        <div className="price-number">
          {data.prix_estime.toLocaleString()} <span style={{ fontSize: 18 }}>TND</span>
        </div>
        <div className="price-m2">{data.prix_m2.toLocaleString()} TND/m²</div>
        <div className="price-range-box">
          <div className="price-range-details">
            <span>📍 {features.ville}</span>
            <span>📐 {features.surface} m²</span>
            <span>🚪 S+{features.pieces}</span>
          </div>
          <div className="price-bar"><div className="price-bar-fill"></div></div>
          <div className="price-range-text">
            💰 Range: {data.fourchette_min.toLocaleString()} - {data.fourchette_max.toLocaleString()} TND
          </div>
        </div>
        <div className="price-features">
          🔍 Detected: {features.typeBien} | {features.ville} | S+{features.pieces} | {features.surface}m²
          {features.piscine ? " | 🏊 Pool" : ""}
          {features.jardin ? " | 🌳 Garden" : ""}
          {features.garage ? " | 🚗 Parking" : ""}
        </div>
      </div>
    </div>
  );
}

function RagCard({ item }) {
  const score = 82 + Math.abs(hashCode(item.title || "")) % 18;
  const isLoc = (item.type || "").toLowerCase().includes("location");
  return (
    <div className="rag-card">
      <div className="rag-card-top">
        <div className="rag-card-title">🏠 {item.title || "Property"}</div>
        <div className="sim-pill">{score}% match</div>
      </div>
      <div className="rag-tags">
        <span className="rtag">📍 {item.ville || "—"}</span>
        <span className="rtag">{isLoc ? "✓ Rent" : "✓ Sale"}</span>
        <span className="rtag">📐 {item.area || 0} m²</span>
      </div>
      <div className="rag-price">{(item.price || 0).toLocaleString()} TND</div>
      <div className="rag-bar">
        <div className="rag-fill" style={{ width: score + "%" }} />
      </div>
    </div>
  );
}

function PremiumScore({ data }) {
  const score = data.score || 0;
  let color = "#dc2626";
  if (score >= 85) color = "#2e7d64";
  else if (score >= 70) color = "#b8860b";
  else if (score >= 50) color = "#f7b733";

  return (
    <div>
      <div className="mode-badge mb-eval">⭐ Premium Evaluator · GPT-2 scoring</div>
      <div className="score-ring">
        <span className="score-num" style={{ color: color, fontSize: "52px" }}>
          {score}<span style={{ fontSize: "24px" }}>/100</span>
        </span>
        <br />
        <strong style={{ fontSize: "13px" }}>{data.categorie || ""}</strong>
      </div>
      {data.recommandation && (
        <div style={{ marginTop: 10, padding: 10, background: "var(--card2)", borderRadius: 8, fontSize: "11px" }}>
          💡 {data.recommandation}
        </div>
      )}
    </div>
  );
}

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
          <div className="typing"><span /><span /><span /></div>
        </div>
      </div>
    );
  }
  return (
    <div className="msg bot">
      <div className="avatar bot">A</div>
      <div className="bubble">{msg.content}</div>
    </div>
  );
}

export default function AqariaApp() {
  const [apiBase, setApiBase] = useState(() => localStorage.getItem("aqaria_api_url") || "");
  const [apiUrlInput, setApiUrlInput] = useState(localStorage.getItem("aqaria_api_url") || "");
  const [apiStatus, setApiStatus] = useState({ dot: "", text: "—", biens: "—", villes: "—" });
  const [activeMode, setActiveMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [toast, setToast] = useState({ text: "", show: false });
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("aqaria-styles")) {
      const style = document.createElement("style");
      style.id = "aqaria-styles";
      style.textContent = STYLES;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      const parent = messagesEndRef.current.parentElement;
      if (parent) parent.scrollTo({ top: parent.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const showToastMsg = (text) => {
    setToast({ text, show: true });
    setTimeout(() => setToast({ text: "", show: false }), 3000);
  };

  const checkAPI = async (base, forceToast = false) => {
    const url = base || apiBase;
    if (!url) {
      setApiStatus({ dot: "err", text: "URL not set", biens: "—", villes: "—" });
      return false;
    }
    try {
      const res = await fetch(`${url}/api/status`, { signal: AbortSignal.timeout(8000) });
      const data = await res.json();
      setApiStatus({
        dot: "ok",
        text: `✅ ${data.biens || "?"} properties`,
        biens: (data.biens || 0).toLocaleString(),
        villes: (data.villes || []).length,
      });
      if (forceToast) showToastMsg("✅ API connected!");
      return true;
    } catch {
      setApiStatus({ dot: "err", text: "⚠️ Offline", biens: "—", villes: "—" });
      if (forceToast) showToastMsg("❌ API unreachable.");
      return false;
    }
  };

  const connectAPI = async () => {
    const newUrl = apiUrlInput.trim().replace(/\/$/, "");
    if (!newUrl) { showToastMsg("⚠️ Paste Cloudflare URL!"); return; }
    setApiBase(newUrl);
    localStorage.setItem("aqaria_api_url", newUrl);
    await checkAPI(newUrl, true);
  };

  useEffect(() => { checkAPI(apiBase); }, []);

  const addMsg = (msg) => setMessages(prev => [...prev, msg]);
  const addTyping = () => {
    const id = Date.now();
    setMessages(prev => [...prev, { id, type: "typing", role: "bot" }]);
    return id;
  };
  const removeTyping = (id) => setMessages(prev => prev.filter(m => m.id !== id));

  const handlePricePrediction = async (text, base) => {
    const features = extractFeaturesFromText(text);
    const tid = addTyping();
    try {
      const res = await fetch(`${base}/api/predict_prix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surface: features.surface,
          pieces: features.pieces,
          sdb: features.sdb,
          ville: features.ville,
          type_bien: features.typeBien,
          transaction: features.transaction,
          piscine: features.piscine,
          jardin: features.jardin,
          parking: features.garage,
          terrasse: features.terrasse,
          ascenseur: features.ascenseur,
          climatisation: features.climatisation,
        }),
      });
      const data = await res.json();
      removeTyping(tid);
      if (data.success) {
        addMsg({ role: "bot", content: <PriceResult data={data} features={features} /> });
      } else {
        addMsg({
          role: "bot",
          content: (
            <div>
              <div className="mode-badge mb-price">💰 Price Prediction</div>
              <br />❌ {data.error || "Prediction error"}
            </div>
          ),
        });
      }
    } catch (e) {
      removeTyping(tid);
      addMsg({
        role: "bot",
        content: (
          <div>
            <div className="mode-badge mb-price">💰 Price Prediction</div>
            <br />❌ Error: {e.message}
          </div>
        ),
      });
    }
  };

  const handleChat = async (text, base) => {
    const tid = addTyping();
    try {
      const res = await fetch(`${base}/api/recommander`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, n: 0 }),
      });
      const data = await res.json();
      removeTyping(tid);
      const reply = data.response?.text || data.error || "Sorry, no response.";
      addMsg({
        role: "bot",
        content: (
          <div>
            <div className="mode-badge mb-chat">💬 Chatbot · GPT-2</div>
            <br />{reply}
          </div>
        ),
      });
    } catch (e) {
      removeTyping(tid);
      addMsg({
        role: "bot",
        content: (
          <div>
            <div className="mode-badge mb-chat">💬 Chatbot</div>
            <br />❌ Error: {e.message}
          </div>
        ),
      });
    }
  };

  const handleRAG = async (text, base) => {
    const tid = addTyping();
    try {
      const res = await fetch(`${base}/api/recommander`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, n: 6 }),
      });
      const data = await res.json();
      removeTyping(tid);
      const biens = data.response?.biens || [];
      if (biens.length > 0) {
        addMsg({
          role: "bot",
          content: (
            <div>
              <div className="mode-badge mb-rag">🔎 RAG · Semantic Search</div>
              <div className="rag-results">
                {biens.map((item, i) => <RagCard key={i} item={item} />)}
              </div>
            </div>
          ),
        });
      } else {
        addMsg({
          role: "bot",
          content: (
            <div>
              <div className="mode-badge mb-rag">🔎 RAG</div>
              <br />No properties found. Try different criteria.
            </div>
          ),
        });
      }
    } catch (e) {
      removeTyping(tid);
      addMsg({
        role: "bot",
        content: (
          <div>
            <div className="mode-badge mb-rag">🔎 RAG</div>
            <br />❌ Error: {e.message}
          </div>
        ),
      });
    }
  };

  const handlePremium = async (text, base) => {
    const tid = addTyping();
    try {
      const res = await fetch(`${base}/api/evaluer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text }),
      });
      const data = await res.json();
      removeTyping(tid);
      if (data.error) {
        addMsg({
          role: "bot",
          content: (
            <div>
              <div className="mode-badge mb-eval">⭐ Premium Evaluator</div>
              <br />❌ {data.error}
            </div>
          ),
        });
      } else {
        addMsg({ role: "bot", content: <PremiumScore data={data} /> });
      }
    } catch (e) {
      removeTyping(tid);
      addMsg({
        role: "bot",
        content: (
          <div>
            <div className="mode-badge mb-eval">⭐ Premium Evaluator</div>
            <br />❌ Error: {e.message}
          </div>
        ),
      });
    }
  };

  const send = async (overrideText) => {
    const text = (overrideText || inputVal).trim();
    if (!text) return;
    setInputVal("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    const base = apiBase;
    const connected = await checkAPI(base);
    if (!connected) {
      addMsg({ role: "user", content: text });
      addMsg({ role: "bot", content: "⚠️ API disconnected. Please check your connection." });
      return;
    }
    const mode = detectModel(text);
    setActiveMode(mode);
    setShowWelcome(false);
    addMsg({ role: "user", content: text });
    if (mode === "price") await handlePricePrediction(text, base);
    else if (mode === "premium") await handlePremium(text, base);
    else if (mode === "rag") await handleRAG(text, base);
    else await handleChat(text, base);
  };

  const usePrompt = (text) => { setInputVal(text); send(text); };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };
  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
    if (e.target.value.trim().length > 3) setActiveMode(detectModel(e.target.value.trim()));
  };

  return (
    <section id="assistant" style={{ backgroundColor: "#eef2f6", padding: "60px 20px" }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        height: "700px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        overflow: "hidden",
        position: "relative",
      }}>
        <div id="toast" className={toast.show ? "show" : ""}>{toast.text}</div>

        <header>
          <div className="brand">
            
          </div>
          <div className="intent-bar">
            <div className={`intent-dot ${activeMode || ""}`} />
            <span className={`intent-label ${activeMode ? "active" : ""}`}>
              {activeMode
                ? (activeMode === "chat" ? " Chatbot"
                  : activeMode === "rag" ? " RAG"
                  : activeMode === "price" ? " Price XGBoost"
                  : "⭐ Premium Evaluator")
                : "Awaiting..."}
            </span>
          </div>
          <div className="api-zone">
            <div className={`api-dot ${apiStatus.dot}`} />
            <span>API:</span>
            <input
              className="api-url-input"
              placeholder="https://xxx.trycloudflare.com"
              value={apiUrlInput}
              onChange={e => setApiUrlInput(e.target.value)}
            />
            <button className="connect-btn" onClick={connectAPI}>Connect</button>
            <span>{apiStatus.text}</span>
          </div>
        </header>

        <div className="app-body">
          <div id="chatbot-section" className="main-content">
            <div className="messages">
              {showWelcome && (
                <div className="welcome">
                  <div className="welcome-logo">🏠</div>
                  <h2>ARADHI — Real Estate AI</h2>
                  <p>Ask anything about Tunisian real estate. Price estimation , property search , and premium evaluation!</p>
                  <div className="welcome-pills">
                    <span className="wpill" onClick={() => usePrompt("Villa with pool La Marsa")}>🔎 Villa search</span>
                    <span className="wpill" onClick={() => usePrompt("Price villa 180m² Carthage")}>💰 Price </span>
                    <span className="wpill" onClick={() => usePrompt("Evaluate luxury villa")}>⭐ Evaluate</span>
                    <span className="wpill" onClick={() => usePrompt("Best neighborhoods Tunis")}>💬 Chat</span>
                  </div>
                </div>
              )}
              {messages.map((msg, idx) => <Message key={msg.id || idx} msg={msg} />)}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-zone">
              <div className="input-wrap">
                <textarea
                  ref={textareaRef}
                  className="chat-textarea"
                  rows={1}
                  placeholder="Ask something..."
                  value={inputVal}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button className="send-btn" onClick={() => send()}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="#fff">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}