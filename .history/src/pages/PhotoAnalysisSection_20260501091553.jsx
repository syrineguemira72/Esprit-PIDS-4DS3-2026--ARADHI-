const PhotoAnalysisSection = () => {
  return (
    <section className="img-section" id="photo">
      <div className="img-inner">
        <div>
          <div className="s-eyebrow"><span>Photo Analysis</span></div>
          <h2>Upload a Photo,<br />We'll Read <em>the Details</em></h2>
          <p className="s-desc" style={{ marginBottom: '32px' }}>Our AI scans property photos to automatically detect rooms, garden, renovation status, and other features — making your estimate more accurate.</p>
          <div className="benefit-list">
            <div className="benefit-item"><div className="b-icon" style={{ background: 'var(--gold2)' }}><svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="11" rx="2" stroke="#fff" strokeWidth="1.5" /><circle cx="9" cy="9.5" r="2.5" stroke="#fff" strokeWidth="1.5" /><path d="M6 4l1.5-2h3L12 4" stroke="#fff" strokeWidth="1.5" /></svg></div><div className="b-text"><h4>Reads your photos instantly</h4><p>Upload any property photo and get a full feature breakdown in under 5 seconds.</p></div></div>
            <div className="benefit-item"><div className="b-icon" style={{ background: 'var(--gold2)' }}><svg viewBox="0 0 18 18" fill="none"><path d="M4 9l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg></div><div className="b-text"><h4>Improves your price estimate</h4><p>Detected features like a garden or renovated kitchen adjust your estimate automatically.</p></div></div>
          </div>
        </div>
        <div className="img-demo">
          <div className="img-preview">
            <svg className="img-preview-icon" viewBox="0 0 120 120" fill="none" width="80" height="80"><rect x="10" y="30" width="100" height="75" rx="6" fill="rgba(255,255,255,.5)" /><path d="M60 15 L100 35 L20 35 Z" fill="rgba(255,255,255,.4)" /><rect x