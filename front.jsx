import { useState, useRef, useCallback } from "react";

const CLASS_CONFIG = {
  Old: {
    color: "#c0392b",
    bg: "#fff5f5",
    border: "#e74c3c",
    icon: "⚠️",
    label: "Maison Ancienne",
    alert: true,
    alertMsg: "Cette maison est classée ANCIENNE — Une inspection structurelle est recommandée !",
    badge: "bg-red-100 text-red-800 border-red-300",
  },
  Normal: {
    color: "#2980b9",
    bg: "#f0f8ff",
    border: "#3498db",
    icon: "🏠",
    label: "Maison Normale",
    alert: false,
    badge: "bg-blue-100 text-blue-800 border-blue-300",
  },
  Luxury: {
    color: "#d4a017",
    bg: "#fffdf0",
    border: "#f1c40f",
    icon: "✨",
    label: "Maison de Luxe",
    alert: false,
    badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
};

const SYSTEM_PROMPT = `You are a house classification AI. When given a house image, classify it into exactly one of three categories: Old, Normal, or Luxury.

Rules:
- Old: visibly aged, deteriorated, worn materials, cracks, outdated architecture, peeling paint
- Normal: standard modern or semi-modern house, average condition, typical suburban home
- Luxury: high-end finishes, large/grand architecture, premium materials, pools, modern design

Respond ONLY with a JSON object, no markdown, no explanation:
{"class": "Old"|"Normal"|"Luxury", "confidence": 0.0-1.0, "reason": "brief reason in French"}`;

export default function HouseClassifier() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const fileRef = useRef(null);

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      setImageBase64(e.target.result.split(",")[1]);
      setResult(null);
      setError(null);
      setAlertDismissed(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  }, []);

  const classify = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setAlertDismissed(false);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: { type: "base64", media_type: "image/jpeg", data: imageBase64 },
                },
                { type: "text", text: "Classifie cette maison." },
              ],
            },
          ],
        }),
      });
      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("Erreur lors de la classification. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? CLASS_CONFIG[result.class] : null;

  return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: "#1a1a2e", color: "#eee" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #16213e 0%, #0f3460 100%)", padding: "2rem", textAlign: "center", borderBottom: "2px solid #e94560" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.3rem" }}>🏘️</div>
        <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", letterSpacing: "2px", color: "#fff" }}>
          HOUSE CLASSIFIER
        </h1>
        <p style={{ margin: "0.4rem 0 0", color: "#a8b2d8", fontSize: "0.9rem", letterSpacing: "1px" }}>
          Détection intelligente • Old · Normal · Luxury
        </p>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Alert Banner — OLD */}
        {result?.class === "Old" && !alertDismissed && (
          <div style={{
            background: "linear-gradient(135deg, #c0392b, #96281b)",
            border: "2px solid #e74c3c",
            borderRadius: "12px",
            padding: "1.2rem 1.5rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            boxShadow: "0 0 30px rgba(231,76,60,0.5)",
            animation: "pulse 2s infinite",
          }}>
            <style>{`@keyframes pulse { 0%,100%{box-shadow:0 0 20px rgba(231,76,60,0.4)} 50%{box-shadow:0 0 40px rgba(231,76,60,0.8)} }`}</style>
            <div style={{ fontSize: "2rem", flexShrink: 0 }}>🚨</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#fff", marginBottom: "0.3rem" }}>
                ALERTE — MAISON ANCIENNE DÉTECTÉE
              </div>
              <div style={{ color: "#ffcdd2", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {cfg.alertMsg}
              </div>
              <div style={{ marginTop: "0.7rem", display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.2rem 0.8rem", borderRadius: "20px", fontSize: "0.8rem", color: "#fff" }}>
                  🔧 Inspection requise
                </span>
                <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.2rem 0.8rem", borderRadius: "20px", fontSize: "0.8rem", color: "#fff" }}>
                  📋 Évaluation structurelle
                </span>
                <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.2rem 0.8rem", borderRadius: "20px", fontSize: "0.8rem", color: "#fff" }}>
                  ⚡ Mise aux normes électrique
                </span>
              </div>
            </div>
            <button
              onClick={() => setAlertDismissed(true)}
              style={{ background: "none", border: "none", color: "#ffcdd2", fontSize: "1.3rem", cursor: "pointer", flexShrink: 0 }}
            >✕</button>
          </div>
        )}

        {/* Drop Zone */}
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragging ? "#e94560" : "#3a3f6b"}`,
            borderRadius: "16px",
            background: dragging ? "rgba(233,69,96,0.08)" : "rgba(255,255,255,0.03)",
            padding: image ? "0" : "3rem 2rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            marginBottom: "1.5rem",
            overflow: "hidden",
          }}
        >
          {image ? (
            <div style={{ position: "relative" }}>
              <img src={image} alt="uploaded" style={{ width: "100%", maxHeight: "380px", objectFit: "cover", display: "block" }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                padding: "1rem", color: "#aaa", fontSize: "0.8rem", textAlign: "right"
              }}>
                Cliquer pour changer l'image
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏠</div>
              <p style={{ color: "#a8b2d8", margin: 0, fontSize: "1rem" }}>
                Glissez une image ou <span style={{ color: "#e94560", textDecoration: "underline" }}>cliquez pour choisir</span>
              </p>
              <p style={{ color: "#555", margin: "0.5rem 0 0", fontSize: "0.8rem" }}>JPG, PNG, WEBP acceptés</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => processFile(e.target.files[0])} />

        {/* Classify Button */}
        {image && (
          <button
            onClick={classify}
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              background: loading ? "#2d3561" : "linear-gradient(135deg, #e94560, #c0392b)",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "1px",
              transition: "all 0.2s",
              marginBottom: "1.5rem",
            }}
          >
            {loading ? "🔍 Analyse en cours..." : "🔍 CLASSIFIER CETTE MAISON"}
          </button>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#2d1b1b", border: "1px solid #c0392b", borderRadius: "10px", padding: "1rem", color: "#e74c3c", marginBottom: "1.5rem" }}>
            ❌ {error}
          </div>
        )}

        {/* Result Card */}
        {result && cfg && (
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: `2px solid ${cfg.border}`,
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "1.5rem",
          }}>
            {/* Result Header */}
            <div style={{ background: `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}44)`, padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ fontSize: "3rem" }}>{cfg.icon}</div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#888", letterSpacing: "2px", textTransform: "uppercase" }}>Résultat de classification</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: cfg.color }}>{cfg.label}</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: cfg.color }}>
                  {Math.round(result.confidence * 100)}%
                </div>
                <div style={{ fontSize: "0.75rem", color: "#888" }}>confiance</div>
              </div>
            </div>

            {/* Confidence Bar */}
            <div style={{ padding: "1rem 1.5rem" }}>
              <div style={{ background: "#1a1a2e", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
                <div style={{
                  width: `${result.confidence * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${cfg.color}, ${cfg.border})`,
                  borderRadius: "4px",
                  transition: "width 1s ease",
                }} />
              </div>
              <div style={{ marginTop: "1rem", color: "#a8b2d8", fontSize: "0.9rem", lineHeight: 1.6 }}>
                <strong style={{ color: "#ddd" }}>Analyse : </strong>{result.reason}
              </div>
            </div>

            {/* All classes */}
            <div style={{ padding: "0 1.5rem 1.5rem", display: "flex", gap: "0.7rem" }}>
              {Object.entries(CLASS_CONFIG).map(([cls, c]) => (
                <div key={cls} style={{
                  flex: 1, textAlign: "center", padding: "0.5rem",
                  background: result.class === cls ? `${c.color}22` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${result.class === cls ? c.border : "#2a2a4a"}`,
                  borderRadius: "8px",
                }}>
                  <div style={{ fontSize: "1.2rem" }}>{c.icon}</div>
                  <div style={{ fontSize: "0.75rem", color: result.class === cls ? c.color : "#555", fontWeight: result.class === cls ? "bold" : "normal" }}>
                    {cls}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          {Object.entries(CLASS_CONFIG).map(([cls, c]) => (
            <div key={cls} style={{
              flex: 1, minWidth: "180px",
              background: "rgba(255,255,255,0.03)", border: `1px solid ${c.border}33`,
              borderRadius: "10px", padding: "0.8rem", display: "flex", alignItems: "center", gap: "0.7rem"
            }}>
              <span style={{ fontSize: "1.5rem" }}>{c.icon}</span>
              <div>
                <div style={{ color: c.color, fontWeight: "bold", fontSize: "0.9rem" }}>{cls}</div>
                <div style={{ color: "#555", fontSize: "0.75rem" }}>
                  {cls === "Old" ? "Alerte inspection" : cls === "Normal" ? "État standard" : "Haut de gamme"}
                </div>
              </div>
              {c.alert && <span style={{ marginLeft: "auto", fontSize: "0.7rem", background: "#c0392b22", color: "#e74c3c", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>ALERTE</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}