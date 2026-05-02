import { Link } from 'react-router-dom';

const BikeCard = ({ bike }) => {
  const displayPrice = !isNaN(bike.price) ? Number(bike.price).toLocaleString('en-IN') : bike.price;
  const imageUrl = (bike.imageUrls && bike.imageUrls.length > 0) ? bike.imageUrls[0] : '/assets/placeholder.jpg';
  const km = bike.kmDriven ? bike.kmDriven + ' km' : '0 km';
  const isSold = bike.status === 'Sold';

  return (
    <div className="gallery-card-wrapper">
      <div className="gallery-card liquid-hover" style={{ background: 'rgba(17, 17, 17, 0.6)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {isSold && <div className="sold-badge">SOLD</div>}

        <div className="gallery-img-container">
          <img loading="lazy" src={imageUrl} className="gallery-img" alt={bike.name} />
        </div>

        <div className="gallery-details">
          <div className="gallery-title" title={bike.name}>{bike.name}</div>
          <div className="gallery-price">₹ {displayPrice}</div>
          
          <div className="gallery-meta">
            <span className="meta-tag">{bike.brand || 'N/A'}</span>
            <span className="meta-tag">{bike.year || 'N/A'}</span>
            <span className="meta-tag">{km}</span>
          </div>

          <Link to={`/bikes/${bike.id}`} style={{ width: '100%', marginTop: 'auto' }}>
            <button className="neon-btn" style={{ width: '100%' }}>View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
