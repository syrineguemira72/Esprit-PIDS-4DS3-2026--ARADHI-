import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);

  const sendMessage = (e) => {
    e.preventDefault();
    const text = e.target.msg.value;

    setMessages([...messages, { text, user: true }]);
    e.target.reset();
  };

  return (
    <div>
      <h1 className="text-3xl mb-4">AI Chatbot</h1>

      <div className="bg-white/10 p-4 rounded-xl h-96 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.user ? "text-right" : "text-left"}>
            <p className="bg-indigo-500 inline-block px-3 py-2 rounded-lg m-1">
              {m.text}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input name="msg" className="flex-1 p-2 rounded bg-white/20" />
        <button className="bg-indigo-500 px-4 rounded">Send</button>
      </form>
    </div>
  );
}