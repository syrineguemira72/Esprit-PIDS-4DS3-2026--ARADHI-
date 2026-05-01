const SearchBar = () => {
  return (
    <div className="search-section">
      <div className="search-inner">
        <div className="search-field">
          <div className="sf-label">Location</div>
          <input className="sf-input" placeholder="City, region…" />
        </div>
        <div className="search-field">
          <div className="sf-label">Type</div>
          <input className="sf-input" placeholder="Apartment, house, land…" />
        </div>
        <div className="search-field">
          <div className="sf-label">Budget</div>
          <input className="sf-input" placeholder="Max price (TND)" />
        </div>
        <div className="search-field" style={{ border: 'none' }}>
          <div className="sf-label">Rooms</div>
          <input className="sf-input" placeholder="Min. rooms" />
        </div>
        <button className="search-btn">Search</button>
      </div>
    </div>
  );
};

export default SearchBar;