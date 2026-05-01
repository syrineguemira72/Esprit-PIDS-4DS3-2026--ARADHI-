import ListingCard from './ListingCard';

const listingsData = [
  {
    title: 'Modern Apartment – S+3',
    location: 'Les Berges du Lac, Tunis',
    price: '285 000',
    area: 120,
    rooms: 4,
    floor: 'Floor 3',
    type: 'sale',
    ratio: 'good',
    explanation: '✓ Our AI estimates this property at 290 000 TND — the asking price is a great deal.',
    imgStyle: { background: 'linear-gradient(145deg,#dbc8b0,#c4a07a)' }
  },
  {
    title: 'Family Villa with Garden',
    location: 'La Marsa, Tunis',
    price: '580 000',
    area: 240,
    rooms: 6,
    floor: 'Garden',
    type: 'sale',
    ratio: 'high',
    explanation: '↑ Our AI estimates 490 000 TND — this property may be overpriced by ~18%.',
    imgStyle: { background: 'linear-gradient(145deg,#c8b89a,#a89070)' }
  },
  {
    title: 'Bright Apartment – S+2',
    location: 'Sousse Ville',
    price: '1 200',
    area: 85,
    rooms: 3,
    floor: 'Floor 1',
    type: 'rent',
    ratio: 'fair',
    explanation: '~ Our AI estimates 1 150–1 300 TND/mo — this rent is within a normal range.',
    imgStyle: { background: 'linear-gradient(145deg,#b8d4c8,#8ab4a4)' }
  }
];

const ListingsSection = () => {
  return (
    <section className="listings-section" id="listings">
      <div className="listings-header">
        <div>
          <div className="s-eyebrow"><span>Browse Properties</span></div>
          <h2>Latest <em>Listings</em></h2>
          <p className="s-desc">Each property comes with an AI price assessment — we tell you if the asking price is fair, before you even visit.</p>
        </div>
        <button className="btn-ghost">View all listings →</button>
      </div>
      <div className="listings-grid">
        {listingsData.map((listing, idx) => (
          <ListingCard key={idx} listing={listing} />
        ))}
      </div>
    </section>
  );
};

export default ListingsSection;