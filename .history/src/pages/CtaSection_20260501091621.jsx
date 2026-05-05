const CtaSection = () => {
  return (
    <section className="cta-section">
      <h2>Ready to Make Your <em>Move?</em></h2>
      <p>Join thousands of Tunisians who use ARADHI to buy and sell smarter every day.</p>
      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="#listings" className="btn-primary">Browse Listings</a>
        <a href="#estimator" className="btn-ghost">Estimate My Property</a>
      </div>
    </section>
  );
};

export default CtaSection;