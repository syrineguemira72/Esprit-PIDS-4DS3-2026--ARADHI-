// src/pages/ChatbotPage.jsx
import { useState } from "react";
import { askAI } from "../services/api";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const res = await askAI(input);

    setMessages([
      ...messages,
      { role: "user", text: input },
      { role: "bot", text: res },
    ]);

    setInput("");
  };

  return (
    <section className="chat-section">
      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "msg-user" : "msg-bot"}>
              {m.text}
            </div>
          ))}
        </div>

        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </section>
  );
}