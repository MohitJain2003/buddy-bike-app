import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Calendar, Gauge } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const BikeCard = ({ bike, index = 0 }) => {
  const displayPrice = !isNaN(bike.price) ? Number(bike.price).toLocaleString('en-IN') : bike.price;
  const imageUrl = (bike.imageUrls && bike.imageUrls.length > 0) ? bike.imageUrls[0] : '/assets/placeholder.jpg';
  const km = bike.kmDriven ? `${Number(bike.kmDriven).toLocaleString('en-IN')} km` : '0 km';
  const isSold = bike.status === 'Sold';

  return (
    <div className="gallery-card-wrapper">
      <ScrollReveal animation="scale" delay={(index % 4) * 60}>
        <div className="gallery-card">
          {isSold && <div className="sold-badge">SOLD</div>}

        <Link to={`/bikes/${bike.id}`}>
          <div className="gallery-img-container">
            <img loading="lazy" src={imageUrl} className="gallery-img" alt={bike.name} />
          </div>
        </Link>

        <div className="gallery-details">
          <Link to={`/bikes/${bike.id}`} style={{ textDecoration: 'none' }}>
            <div className="gallery-title" title={bike.name}>{bike.name}</div>
          </Link>
          <div className="gallery-price">₹ {displayPrice}</div>

          <div className="gallery-meta">
            <span className="meta-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={11} /> {bike.brand || 'N/A'}
            </span>
            <span className="meta-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={11} /> {bike.year || 'N/A'}
            </span>
            <span className="meta-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Gauge size={11} /> {km}
            </span>
          </div>

          <Link to={`/bikes/${bike.id}`} style={{ width: '100%', marginTop: 'auto' }}>
            <button className="btn btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              View Details <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    </ScrollReveal>
  </div>
  );
};

export default BikeCard;
