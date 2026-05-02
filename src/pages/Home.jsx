import { useEffect, useState } from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import { Link } from 'react-router-dom';
import ThreeBg from '../components/ThreeBg';

const Home = () => {
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    const fetchBikes = async () => {
      const { data, error } = await supabaseClient.from('bikes').select('*').limit(8);
      if (!error && data) setBikes(data);
    };
    fetchBikes();
  }, []);

  const scrollCarousel = (direction) => {
    const container = document.getElementById('bikes-container');
    const scrollAmount = 300;
    if (container) {
      container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="hero">
        <ThreeBg />
        <div className="hero-content">
          <h1 className="glow">Ride The Future</h1>
          <p>Premium Used Bikes Marketplace</p>
        </div>
      </section>

      <section className="featured-section">
        <h3 style={{ textAlign: 'center', width: '100%' }}>Featured bikes</h3>
        <div className="carousel-wrapper">
          <button className="carousel-btn left-btn" onClick={() => scrollCarousel(-1)}>&#10094;</button>
          <div className="carousel-container" id="bikes-container">
            {bikes.length === 0 ? (
              <p style={{ textAlign: 'center', width: '100%' }}>Loading bikes from database...</p>
            ) : (
              bikes.map(bike => {
                const displayPrice = !isNaN(bike.price) ? Number(bike.price).toLocaleString('en-IN') : bike.price;
                const imageUrl = (bike.imageUrls && bike.imageUrls.length > 0) ? bike.imageUrls[0] : '/assets/placeholder.jpg';
                const km = bike.kmDriven ? bike.kmDriven + ' km' : '0 km';
                const isSold = bike.status === 'Sold';
                return (
                  <div className="carousel-card" key={bike.id}>
                    {isSold && <div className="sold-badge">SOLD</div>}
                    <img src={imageUrl} alt={bike.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderBottom: '1px solid #222' }} />
                    <div style={{ padding: '15px', textAlign: 'left' }}>
                      <h4 style={{ marginBottom: '5px', fontSize: '18px' }}>{bike.name}</h4>
                      <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '10px' }}>{km} • {bike.year}</p>
                      <h3 style={{ color: '#E63946', fontSize: '20px' }}>₹ {displayPrice}</h3>
                      <Link to={`/bikes/${bike.id}`}><button className="neon-btn" style={{ width: '100%', marginTop: '15px' }}>View Details</button></Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <button className="carousel-btn right-btn" onClick={() => scrollCarousel(1)}>&#10095;</button>
        </div>
        <Link to="/bikes"><button className="solid-btn" style={{ display: 'block', margin: '30px auto' }}>View all bikes</button></Link>
      </section>
      
      {/* Brands Section (simplified for now) */}
      <section className="brands-section">
        <h3>Top brands</h3>
        <div className="brands-grid">
            {['Hero', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield', 'Suzuki', 'Yamaha', 'KTM', 'Jawa'].map(brand => (
                <Link to={`/bikes?brand=${brand}`} key={brand} style={{ textDecoration: 'none' }}>
                    <div className="brand-card">
                        <img src={`/assets/${brand.toLowerCase().replace(' ', '')}.png`} alt={brand} />
                        <span>{brand}</span>
                    </div>
                </Link>
            ))}
        </div>
      </section>
    </>
  );
};

export default Home;
