import { useState, useEffect, useRef } from "react";

// Styles clairs (identique à vos couleurs globales)
const STYLES = `
.chatbot-light {
  --bg: #FAF7F2;
  --surface: #FFFFFF;
  --card: #FFFFFF;
  --card2: #F2EDE4;
  --border: #DDD4C8;
  --border2: #E8DDD0;
  --gold: #D4A853;
  --gold2: #B8911F;
  --cyan: #006233;
  --cyan-dim: rgba(0,98,51,0.08);
  --violet: #6B5D4F;
  --violet-dim: rgba(107,93,79,0.08);
  --green: #006233;
  --red: #C1272D;
  --blue: #C1602A;
  --text: #1C1810;
  --muted: #6B5D4F;
  --muted2: #9C8E82;
}

.chatbot-light * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chatbot-light {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
}

/* fine scrollbar */
.chatbot-light ::-webkit-scrollbar {
  width: 6px;
}
.chatbot-light ::-webkit-scrollbar-track {
  background: #E8DDD0;
  border-radius: 10px;
}
.chatbot-light ::-webkit-scrollbar-thumb {
  background: #B8911F;
  border-radius: 10px;
}
.chatbot-light ::-webkit-scrollbar-thumb:hover {
  background: #D4A853;
}

/* header */
.chatbot-light header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0 28px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.chatbot-light .brand {
  display: flex;
  align-items: center;
  gap: 13px;
}
.chatbot-light .brand-logo {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #E8DDD0, #D4A853);
  border: 1px solid rgba(212,168,83,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.chatbot-light .brand-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  background: linear-gradient(135deg, #B8911F, #D4A853);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.chatbot-light .brand-tag {
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 2px;
}
.chatbot-light .intent-bar {
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: 20px;
  padding: 5px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}
.chatbot-light .intent-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted2);
}
.chatbot-light .intent-dot.chat { background: var(--gold); }
.chatbot-light .intent-dot.rag { background: var(--cyan); }
.chatbot-light .intent-dot.premium { background: var(--violet); }
.chatbot-light .intent-label { color: var(--muted2); }
.chatbot-light .intent-label.active { color: var(--text); }
.chatbot-light .api-zone {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}
.chatbot-light .api-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted2);
}
.chatbot-light .api-dot.ok {
  background: var(--green);
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
.chatbot-light .api-url-input {
  background: var(--card2);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  font-size: 10px;
  padding: 4px 10px;
  width: 240px;
}
.chatbot-light .connect-btn {
  background: rgba(212,168,83,0.1);
  border: 1px solid var(--gold);
  border-radius: 6px;
  color: var(--gold2);
  font-size: 10px;
  padding: 4px 8px;
  cursor: pointer;
}
.chatbot-light .app-body {
  display: flex;
  overflow: hidden;
  flex: 1;
}
.chatbot-light .sidebar {
  width: 240px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.chatbot-light .sidebar-section {
  padding: 16px 14px;
  border-bottom: 1px solid var(--border);
}
.chatbot-light .sidebar-title {
  font-size: 8px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 600;
  margin-bottom: 10px;
}
.chatbot-light .mode-pills {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.chatbot-light .mode-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 11px;
  color: var(--muted2);
  background: transparent;
}
.chatbot-light .mode-pill.active-chat {
  background: rgba(212,168,83,0.1);
  color: var(--gold2);
}
.chatbot-light .mode-pill.active-rag {
  background: rgba(0,98,51,0.1);
  color: var(--cyan);
}
.chatbot-light .mode-pill.active-premium {
  background: rgba(107,93,79,0.1);
  color: var(--violet);
}
.chatbot-light .mode-pill .mp-badge {
  margin-left: auto;
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 10px;
  background: var(--card2);
}
.chatbot-light .stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.chatbot-light .stat-mini {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px;
  text-align: center;
}
.chatbot-light .stat-val {
  font-family: 'Cormorant Garamond', serif;
  font-size: 17px;
  color: var(--gold2);
}
.chatbot-light .stat-lbl {
  font-size: 9px;
  color: var(--muted);
}
.chatbot-light .q-prompt {
  width: 100%;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 7px;
  font-size: 10px;
  text-align: left;
  padding: 7px 9px;
  cursor: pointer;
  margin-bottom: 5px;
}
.chatbot-light .q-prompt:hover {
  border-color: var(--gold);
  background: rgba(212,168,83,0.1);
}
.chatbot-light .qp-tag {
  display: inline-block;
  font-size: 8px;
  padding: 1px 5px;
  border-radius: 4px;
  margin-bottom: 3px;
}
.chatbot-light .qp-tag.chat { background: rgba(212,168,83,0.15); color: var(--gold2); }
.chatbot-light .qp-tag.rag { background: rgba(0,98,51,0.1); color: var(--cyan); }
.chatbot-light .qp-tag.eval { background: rgba(107,93,79,0.1); color: var(--violet); }
.chatbot-light .main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.chatbot-light .messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.chatbot-light .welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  gap: 16px;
}
.chatbot-light .welcome-logo {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #E8DDD0, #D4A853);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}
.chatbot-light .welcome h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px;
  color: var(--gold);
}
.chatbot-light .welcome p {
  font-size: 12px;
  color: var(--muted2);
}
.chatbot-light .welcome-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}
.chatbot-light .wpill {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 5px 12px;
  font-size: 10px;
  cursor: pointer;
}
.chatbot-light .how-it-works {
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: 12px;
  padding: 14px 18px;
  max-width: 480px;
  text-align: left;
}
.chatbot-light .how-it-works h3 {
  font-size: 11px;
  color: var(--gold);
}
.chatbot-light .how-row {
  display: flex;
  gap: 9px;
  margin-bottom: 8px;
  font-size: 11px;
}
.chatbot-light .how-icon {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chatbot-light .msg {
  display: flex;
  gap: 10px;
  max-width: 820px;
}
.chatbot-light .msg.user {
  flex-direction: row-reverse;
  align-self: flex-end;
}
.chatbot-light .avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
.chatbot-light .avatar.bot {
  background: linear-gradient(135deg, #B8911F, #D4A853);
}
.chatbot-light .avatar.usr {
  background: rgba(193,96,42,0.1);
  border: 1px solid rgba(193,96,42,0.3);
  color: var(--blue);
}
.chatbot-light .bubble {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 11px 14px;
  font-size: 12.5px;
  line-height: 1.7;
}
.chatbot-light .msg.user .bubble {
  background: #F2EDE4;
}
.chatbot-light .mode-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  padding: 2px 7px;
  border-radius: 10px;
  margin-bottom: 7px;
}
.chatbot-light .mb-rag {
  background: rgba(0,98,51,0.1);
  color: var(--cyan);
  border: 1px solid rgba(0,98,51,0.15);
}
.chatbot-light .mb-chat {
  background: rgba(212,168,83,0.1);
  color: var(--gold2);
  border: 1px solid rgba(212,168,83,0.15);
}
.chatbot-light .mb-eval {
  background: rgba(107,93,79,0.1);
  color: var(--violet);
  border: 1px solid rgba(107,93,79,0.15);
}
.chatbot-light .rag-results {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 10px;
}
.chatbot-light .rag-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 11px 13px;
}
.chatbot-light .rag-card-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.chatbot-light .rag-card-title { font-size: 11.5px; font-weight: 600; }
.chatbot-light .sim-pill {
  background: rgba(0,98,51,0.1);
  border: 1px solid rgba(0,98,51,0.2);
  color: var(--cyan);
  font-size: 9px;
  padding: 2px 7px;
  border-radius: 8px;
}
.chatbot-light .rag-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 6px;
}
.chatbot-light .rtag {
  background: var(--card2);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 9px;
}
.chatbot-light .rag-price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px;
  color: var(--gold);
}
.chatbot-light .rag-bar {
  height: 3px;
  background: rgba(0,98,51,0.1);
  border-radius: 2px;
  margin-top: 8px;
}
.chatbot-light .rag-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(0,98,51,0.4), var(--cyan));
  border-radius: 2px;
}
.chatbot-light .typing {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}
.chatbot-light .typing span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--gold);
  animation: bounce 1.2s infinite;
}
@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} }
.chatbot-light .input-zone {
  border-top: 1px solid var(--border);
  background: var(--surface);
  padding: 12px 20px;
  display: flex;
  gap: 10px;
}
.chatbot-light .input-wrap {
  flex: 1;
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: 12px;
  display: flex;
  align-items: flex-end;
  padding: 4px 4px 4px 14px;
}
.chatbot-light .chat-textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 12.5px;
  resize: none;
  padding: 8px 0;
}
.chatbot-light .send-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #B8911F, #D4A853);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chatbot-light .score-ring {
  text-align: center;
  padding: 16px 0;
}
.chatbot-light .score-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 52px;
}
.chatbot-light .dim-bar {
  margin-bottom: 10px;
}
.chatbot-light .dim-bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
}
.chatbot-light .dim-bar-track {
  height: 4px;
  background: rgba(107,93,79,0.1);
  border-radius: 2px;
}
.chatbot-light .dim-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--violet), #C4B5FD);
}
.chatbot-light #toast {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 11px;
  opacity: 0;
  transition: opacity .3s;
}
.chatbot-light #toast.show {
  opacity: 1;
}
`;

// ---- logique métier (identique, mais avec noms de fonction simplifiés) ----
function normalizeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function detectModel(text) {
  const t = normalizeText(text);
  if (/evalue|score|analyse|audit|premium|evaluer|evaluate|premium/.test(t)) return "premium";
  if (/villa|appart|studio|piscine|jardin|garage|rent|buy|pool|garden/.test(t)) return "rag";
  return "chat";
}
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h;
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
      <div className="rag-bar"><div className="rag-fill" style={{ width: `${score}%` }} /></div>
    </div>
  );
}
function PremiumScore({ data }) {
  const score = data.score || 0;
  const color = score >= 85 ? "#006233" : score >= 70 ? "#B8911F" : score >= 50 ? "#C1602A" : "#C1272D";
  return (
    <div>
      <div className="mode-badge mb-eval">⭐ Premium Evaluator</div>
      <div className="score-ring">
        <span className="score-num" style={{ color }}>{score}<span>/100</span></span>
        <br /><strong>{data.categorie || ""}</strong>
      </div>
      {data.recommandation && <div style={{ marginTop: 10, padding: 10, background: "var(--card2)", borderRadius: 8 }}>💡 {data.recommandation}</div>}
    </div>
  );
}
function Message({ msg }) {
  if (msg.role === "user") {
    return <div className="msg user"><div className="avatar usr">U</div><div className="bubble">{msg.content}</div></div>;
  }
  if (msg.type === "typing") {
    return <div className="msg bot"><div className="avatar bot">A</div><div className="bubble"><div className="typing"><span /><span /><span /></div></div></div>;
  }
  return <div className="msg bot"><div className="avatar bot">A</div><div className="bubble">{msg.content}</div></div>;
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
    if (!document.getElementById("chatbot-light-styles")) {
      const style = document.createElement("style");
      style.id = "chatbot-light-styles";
      style.textContent = STYLES;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      setApiStatus({ dot: "ok", text: `✅ ${data.biens || "?"} properties`, biens: (data.biens || 0).toLocaleString(), villes: (data.villes || []).length });
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

  const handleChat = async (text, base) => {
    const tid = addTyping();
    try {
      const res = await fetch(`${base}/api/recommander`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, n: 0 }) });
      const data = await res.json();
      removeTyping(tid);
      const reply = data.response?.text || data.error || "Sorry, no response.";
      addMsg({ role: "bot", content: <div><div className="mode-badge mb-chat">💬 Chatbot</div><br />{reply}</div> });
    } catch (e) {
      removeTyping(tid);
      addMsg({ role: "bot", content: <div><div className="mode-badge mb-chat">💬 Chatbot</div><br />❌ Error</div> });
    }
  };
  const handleRAG = async (text, base) => {
    const tid = addTyping();
    try {
      const res = await fetch(`${base}/api/recommander`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, n: 6 }) });
      const data = await res.json();
      removeTyping(tid);
      const biens = data.response?.biens || [];
      if (biens.length) {
        addMsg({ role: "bot", content: <div><div className="mode-badge mb-rag">🔎 RAG</div><div className="rag-results">{biens.map((item, i) => <RagCard key={i} item={item} />)}</div></div> });
      } else {
        addMsg({ role: "bot", content: <div><div className="mode-badge mb-rag">🔎 RAG</div><br />No properties found.</div> });
      }
    } catch (e) {
      removeTyping(tid);
      addMsg({ role: "bot", content: "Error" });
    }
  };
  const handlePremium = async (text, base) => {
    const tid = addTyping();
    try {
      const res = await fetch(`${base}/api/evaluer`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ description: text }) });
      const data = await res.json();
      removeTyping(tid);
      if (data.error) addMsg({ role: "bot", content: <div><div className="mode-badge mb-eval">⭐ Premium</div><br />❌ {data.error}</div> });
      else addMsg({ role: "bot", content: <PremiumScore data={data} /> });
    } catch (e) {
      removeTyping(tid);
      addMsg({ role: "bot", content: "Error" });
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
      addMsg({ role: "bot", content: "⚠️ API disconnected." });
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

  const usePrompt = (text) => { setInputVal(text); send(text); };
  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
    if (e.target.value.trim().length > 3) setActiveMode(detectModel(e.target.value.trim()));
  };

  return (
    <div className="chatbot-light">
      <div id="toast" className={toast.show ? "show" : ""}>{toast.text}</div>
      <header>
        <div className="brand"><div className="brand-logo">🏠</div><div><div className="brand-name">AQARIA</div><div className="brand-tag">Real Estate AI · GPT-2</div></div></div>
        <div className="intent-bar"><div className={`intent-dot ${activeMode || ""}`} /><span className={`intent-label ${activeMode ? "active" : ""}`}>{activeMode ? (activeMode === "chat" ? "💬 Chatbot" : activeMode === "rag" ? "🔎 RAG" : "⭐ Premium") : "Awaiting..."}</span></div>
        <div className="api-zone"><div className={`api-dot ${apiStatus.dot}`} /><span>API:</span><input className="api-url-input" placeholder="https://xxx.trycloudflare.com" value={apiUrlInput} onChange={e => setApiUrlInput(e.target.value)} /><button className="connect-btn" onClick={connectAPI}>Connect</button><span>{apiStatus.text}</span></div>
      </header>
      <div className="app-body">
        <div className="sidebar">
          <div className="sidebar-section"><div className="sidebar-title">Model</div><div className="mode-pills"><div className={`mode-pill ${activeMode === "chat" ? "active-chat" : ""}`}>💬 Chatbot</div><div className={`mode-pill ${activeMode === "rag" ? "active-rag" : ""}`}>🔎 RAG</div><div className={`mode-pill ${activeMode === "premium" ? "active-premium" : ""}`}>⭐ Premium</div></div></div>
          <div className="sidebar-section"><div className="sidebar-title">Stats</div><div className="stats-grid"><div className="stat-mini"><div className="stat-val">{apiStatus.biens}</div><div className="stat-lbl">Properties</div></div><div className="stat-mini"><div className="stat-val">124M</div><div className="stat-lbl">Params</div></div></div></div>
          <div className="sidebar-section"><div className="sidebar-title">Examples</div>
            <button className="q-prompt" onClick={() => usePrompt("Villa with pool in La Marsa")}><span className="qp-tag rag">RAG</span><br />Villa pool La Marsa</button>
            <button className="q-prompt" onClick={() => usePrompt("What is the average price in Carthage?")}><span className="qp-tag chat">CHAT</span><br />Price Carthage</button>
            <button className="q-prompt" onClick={() => usePrompt("Evaluate this luxury villa")}><span className="qp-tag eval">EVAL</span><br />Evaluate villa</button>
          </div>
        </div>
        <div id="chatbot-section" className="main-content">
          <div className="messages">
            {showWelcome && <div className="welcome"><div className="welcome-logo">🏠</div><h2>AQARIA — Real Estate AI</h2><p>Ask anything about Tunisian real estate.</p><div className="welcome-pills"><span className="wpill" onClick={() => usePrompt("Villa with pool La Marsa")}>🔎 Villa pool</span><span className="wpill" onClick={() => usePrompt("Average price Carthage")}>💬 Price</span><span className="wpill" onClick={() => usePrompt("Evaluate villa S+4 pool")}>⭐ Evaluate</span></div></div>}
            {messages.map((msg, idx) => <Message key={msg.id || idx} msg={msg} />)}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-zone"><div className="input-wrap"><textarea ref={textareaRef} className="chat-textarea" rows={1} placeholder="Ask something..." value={inputVal} onChange={handleInputChange} onKeyDown={handleKeyDown} /></div><button className="send-btn" onClick={() => send()}><svg viewBox="0 0 24 24" width={14} height={14} fill="#fff"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg></button></div>
        </div>
      </div>
    </div>
  );
}