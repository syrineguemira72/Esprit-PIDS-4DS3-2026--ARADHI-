import { useState } from 'react';

const ChatbotSection = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I can help you estimate property prices, find the best zones to buy, or answer any real estate question in Tunisia. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'For a 3-room in Sousse Ville, the average is around 220 000–270 000 TND depending on floor and condition. 250 000 TND is a fair price — I\'d say it\'s a good deal if the apartment is on floor 2+. Want me to factor in surface area for a more precise estimate?' 
      }]);
    }, 500);
    setInput('');
  };

  return (
    <section className="chat-section" id="assistant">
      <div className="chat-inner">
        <div>
          <div className="s-eyebrow"><span>AI Assistant</span></div>
          <h2>Ask Anything About<br /><em>Real Estate</em> in Tunisia</h2>
          <p className="s-desc" style={{ marginBottom: '32px' }}>Our AI assistant speaks your language, knows the Tunisian market, and can estimate prices, explain trends, or guide you through buying and selling.</p>
          <div className="benefit-list">
            <div className="benefit-item"><div className="b-icon" style={{ background: 'var(--olive)' }}><svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="3" stroke="#fff" strokeWidth="1.5" /><path d="M3 15c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg></div><div className="b-text"><h4>No jargon, just answers</h4><p>Ask in plain language — "Is 250 000 TND a good price for a 3-room in Sousse?"</p></div></div>
            <div className="benefit-item"><div className="b-icon" style={{ background: 'var(--olive)' }}><svg viewBox="0 0 18 18" fill="none"><path d="M3 9h12M9 4l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg></div><div className="b-text"><h4>Instant price guidance</h4><p>Describe your property and get an estimate in seconds, any time of day.</p></div></div>
          </div>
        </div>
        <div className="chat-window">
          <div className="chat-topbar"><div className="chat-av">🏠</div><div><div className="chat-av-name">ImmoBot TN</div><div className="chat-av-status"><div className="status-dot"></div>Online · AI assistant</div></div></div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`msg msg-${msg.role}`}>
                <div className="msg-av">{msg.role === 'bot' ? '🤖' : '👤'}</div>
                <div className={`bubble bubble-${msg.role === 'bot' ? 'bot' : 'user'}`}>{msg.content}</div>
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input type="text" className="chat-in" placeholder="Ask about any property…" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
            <button className="chat-send" onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatbotSection;