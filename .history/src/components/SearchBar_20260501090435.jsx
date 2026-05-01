// src/components/SearchBar.jsx
export default function SearchBar() {
  return (
    <div className="search-section">
      <div className="search-inner">

        <div className="search-field">
          <div className="sf-label">Location</div>
          <input className="sf-input" placeholder="City..." />
        </div>

        <div className="search-field">
          <div className="sf-label">Type</div>
          <input className="sf-input" placeholder="Apartment..." />
        </div>

        <div className="search-field">
          <div className="sf-label">Budget</div>
          <input className="sf-input" placeholder="Max price" />
        </div>

        <button className="search-btn">Search</button>

      </div>
    </div>
  );
}