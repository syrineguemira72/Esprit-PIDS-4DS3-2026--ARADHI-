import { useState, useEffect } from 'react';
import { getListings, estimatePrice } from '../services/api';
import ListingCard from './ListingCard';

const ListingsSection = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les annonces depuis l'API
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      // Essayer de récupérer depuis l'API
      const data = await getListings();
      
      // Enrichir chaque annonce avec une estimation AI
      const enrichedListings = await Promise.all(
        data.map(async (listing) => {
          try {
            // Appeler l'API d'estimation pour chaque bien
            const estimation = await estimatePrice({
              gouvernorat: listing.gouvernorat || 'Tunis',
              type_bien: listing.type_bien || 'Appartement',
              surface: listing.superficie_habitale || listing.area || 100,
              rooms: listing.nbpiece || listing.rooms || 3,
              salle_de_bain: listing.salle_de_bain || 2,
              parking: listing.parking || false,
              climatisation: listing.climatisation || false,
              cuisine: listing.cuisine || false,
              terrasse: listing.terrasse || false,
              piscine: listing.piscine || false,
              ascenseur: listing.ascenseur || false,
            });
            
            // Calculer le ratio pour déterminer si c'est une bonne affaire
            const prixDemande = parseFloat(listing.price) || 0;
            const ratio = prixDemande / estimation.price;
            
            let ratioType = 'fair';
            let explanation = '';
            
            if (ratio < 0.85) {
              ratioType = 'good';
              explanation = `✓ Our AI estimates this property at ${estimation.price.toLocaleString()} TND — the asking price is a great deal.`;
            } else if (ratio > 1.15) {
              ratioType = 'high';
              explanation = `↑ Our AI estimates ${estimation.price.toLocaleString()} TND — this property may be overpriced by ~${Math.round((ratio - 1) * 100)}%.`;
            } else {
              ratioType = 'fair';
              explanation = `~ Our AI estimates ${estimation.price_low.toLocaleString()}–${estimation.price_high.toLocaleString()} TND — this price is within a normal range.`;
            }
            
            return {
              ...listing,
              price: prixDemande.toLocaleString(),
              estimatedPrice: estimation.price,
              ratio: ratioType,
              explanation,
              confidence: estimation.confidence,
              signal: estimation.signal,
            };
          } catch (err) {
            console.error(`Erreur estimation pour ${listing.title}:`, err);
            return listing;
          }
        })
      );
      
      setListings(enrichedListings);
    } catch (err) {
      console.error('Erreur chargement annonces:', err);
      setError('Impossible de charger les annonces');
      // Utiliser les données statiques en fallback
      setListings(getStaticListings());
    } finally {
      setLoading(false);
    }
  };

  // Données statiques de fallback
  const getStaticListings = () => {
    return [
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
  };

  if (loading) {
    return (
      <section className="listings-section" id="listings">
        <div className="listings-header">
          <div>
            <div className="s-eyebrow"><span>Browse Properties</span></div>
            <h2>Latest <em>Listings</em></h2>
            <p className="s-desc">Loading properties...</p>
          </div>
        </div>
        <div className="loading-spinner">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="listings-section" id="listings">
        <div className="listings-header">
          <div>
            <div className="s-eyebrow"><span>Browse Properties</span></div>
            <h2>Latest <em>Listings</em></h2>
            <p className="s-desc">Using demo data while connecting to server...</p>
          </div>
        </div>
        <div className="listings-grid">
          {getStaticListings().map((listing, idx) => (
            <ListingCard key={idx} listing={listing} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="listings-section" id="listings">
      <div className="listings-header">
        <div>
          <div className="s-eyebrow"><span>Browse Properties</span></div>
          <h2>Latest <em>Listings</em></h2>
          <p className="s-desc">Each property comes with an AI price assessment — we tell you if the asking price is fair, before you even visit.</p>
        </div>
        <button className="btn-ghost" onClick={() => fetchListings()}>
          Refresh listings →
        </button>
      </div>
      <div className="listings-grid">
        {listings.map((listing, idx) => (
          <ListingCard key={idx} listing={listing} />
        ))}
      </div>
    </section>
  );
};

export default ListingsSection;