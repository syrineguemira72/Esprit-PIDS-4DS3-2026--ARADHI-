const ListingCard = ({ listing }) => {
  const ratioClass = listing.ratio === 'good' ? 'ratio-good' : listing.ratio === 'high' ? 'ratio-high' : 'ratio-fair';
  const ratioText = listing.ratio === 'good' ? '✓ Fair' : listing.ratio === 'high' ? '↑ High' : '~ OK';
  const explainClass = listing.ratio === 'good' ? 're-good' : listing.ratio === 'high' ? 're-high' : 're-fair';
  
  return (
    <div className="listing-card">
      <div className="card-img" style={listing.imgStyle}>
        <div className="card-img-icon">
          <svg viewBox="0 0 80 80" fill="none">
            <rect x="10" y="25" width="60" height="45" rx="4" fill="rgba(255,255,255,.3)" />
            <path d="M40 10 L70 30 L10 30 Z" fill="rgba(255,255,255,.25)" />
            <rect x="25" y="45" width="14" height="25" fill="rgba(255,255,255,.4)" />
            <rect x="45" y="45" width="14" height="25" fill="rgba(255,255,255,.4)" />
          </svg>
        </div>
        <span className={`card-badge ${listing.type === 'sale' ? 'badge-sale' : 'badge-rent'}`}>
          {listing.type === 'sale' ? 'For Sale' : 'For Rent'}
        </span>
        <div className={`ratio-badge ${ratioClass}`}>
          <div className="ratio-val">{ratioText}</div>
          <div className="ratio-lbl">Price check</div>
        </div>
      </div>
      <div className="card-body">
        <div className="card-title">{listing.title}</div>
        <div className="card-loc">
          <svg viewBox="0 0 12 12" fill="none">
            <path d="M6 1C4.3 1 3 2.3 3 4c0 3 3 7 3 7s3-4 3-7c0-1.7-1.3-3-3-3zm0 4a1 1 0 110-2 1 1 0 010 2z" fill="currentColor" />
          </svg>
          {listing.location}
        </div>
        <div className="card-price">{listing.price} <span>TND{listing.type === 'rent' ? '/mo' : ''}</span></div>
        <div className="card-feats">
          <div className="feat-item">
            <svg viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" /></svg>
            {listing.area} m²
          </div>
          <div className="feat-item">
            <svg viewBox="0 0 14 14" fill="none"><path d="M2 12V5l5-3 5 3v7H9V9H5v3H2z" stroke="currentColor" strokeWidth="1.2" /></svg>
            {listing.rooms} rooms
          </div>
          <div className="feat-item">
            <svg viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" /><path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.2" /></svg>
            {listing.floor}
          </div>
        </div>
        <div className={`ratio-explain ${explainClass}`}>{listing.explanation}</div>
      </div>
    </div>
  );
};

export default ListingCard;