const Navigation = () => {
  const scrollToAssistant = (e) => {
    e.preventDefault();
    const chatbotSection = document.getElementById('chatbot-section');
    if (chatbotSection) {
      chatbotSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{ backgroundColor: '#ffffff' }}>  {/* Fond blanc si nécessaire */}
      <a href="#" className="nav-logo">
        <div className="flag-strip">
          <div className="f1"></div>
          <div className="f2"></div>
          <div className="f3"></div>
        </div>
        <div className="logo-word">ARADHI<span>TN</span></div>
      </a>
      <div className="nav-links">
        <a href="#listings" className="nav-a">Listings</a>
        <a href="#timing" className="nav-a">Best Time</a>
        <a href="#map" className="nav-a">Zone Map</a>
        <a href="#estimator" className="nav-a">Estimate</a>
        <a href="#assistant" className="nav-a" onClick={scrollToAssistant}>AI Assistant</a>
        <a href="#photo" className="nav-a">Photo Scan</a>
      </div>
      <button className="nav-cta">Get Started</button>
    </nav>
  );
};

export default Navigation;