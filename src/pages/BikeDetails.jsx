import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabaseClient } from '../utils/supabaseClient';
import ThreeBg from '../components/ThreeBg';

const BikeDetails = () => {
  const { id } = useParams();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchBikeDetails = async () => {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from('bikes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        setError("Failed to load bike details.");
      } else {
        setBike(data);
      }
      setLoading(false);
    };

    if (id) {
      fetchBikeDetails();
    } else {
      setError("Bike not found.");
      setLoading(false);
    }
  }, [id]);

  const changeImage = (step) => {
    if (!bike || !bike.imageUrls || bike.imageUrls.length === 0) return;
    setCurrentImageIndex((prevIndex) => {
      let newIndex = prevIndex + step;
      if (newIndex >= bike.imageUrls.length) return 0;
      if (newIndex < 0) return bike.imageUrls.length - 1;
      return newIndex;
    });
  };

  // Swipe logic
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const threshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance < -threshold) {
      changeImage(1); // Swiped left -> Next
    }
    if (swipeDistance > threshold) {
      changeImage(-1); // Swiped right -> Prev
    }
  };

  if (loading) {
    return <div style={{ color: 'white', fontSize: '18px', textAlign: 'center', marginTop: '40px' }}>Loading bike details...</div>;
  }

  if (error || !bike) {
    return <div style={{ color: 'white', fontSize: '18px', textAlign: 'center', marginTop: '40px' }}>{error || "Bike not found."}</div>;
  }

  const images = bike.imageUrls || [];
  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[currentImageIndex] : '/assets/placeholder.jpg';
  const showArrows = images.length > 1;

  return (
    <>
      <ThreeBg />
      <section className="details-section" style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>
        
        <h1 id="detail-name" style={{ marginBottom: '30px', fontWeight: 'bold', color: 'white', letterSpacing: '1px' }}>
          {bike.name}
        </h1>

        <div 
          className="slider-container" 
          onTouchStart={handleTouchStart} 
          onTouchEnd={handleTouchEnd}
          style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto 40px auto', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', touchAction: 'pan-y' }}
        >
          {showArrows && (
            <button 
              className="slider-btn" 
              onClick={() => changeImage(-1)}
              style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(10, 10, 10, 0.8)', color: 'white', border: '2px solid #555', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', left: '15px' }}
            >
              &#10094;
            </button>
          )}
          
          <img className="slider-img" src={currentImage} alt={bike.name} style={{ width: '100%', height: '450px', objectFit: 'cover', display: 'block' }} />
          
          {showArrows && (
            <button 
              className="slider-btn" 
              onClick={() => changeImage(1)}
              style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(10, 10, 10, 0.8)', color: 'white', border: '2px solid #555', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', right: '15px' }}
            >
              &#10095;
            </button>
          )}
        </div>

        <div className="bike-card" style={{ padding: '30px', textAlign: 'left', background: '#0a0a0a', maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ color: '#fc0e0e' }}>Specifications</h3>
          <hr style={{ borderColor: '#333', margin: '15px 0' }} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '16px' }}>
            <p><strong>Price:</strong> <span style={{ color: '#ccc' }}>₹ {!isNaN(bike.price) ? Number(bike.price).toLocaleString('en-IN') : bike.price}</span></p>
            <p><strong>Brand:</strong> <span style={{ color: '#ccc' }}>{bike.brand}</span></p>
            <p><strong>Year:</strong> <span style={{ color: '#ccc' }}>{bike.year}</span></p>
            <p><strong>Kilometers Driven:</strong> <span style={{ color: '#ccc' }}>{bike.kmDriven ? bike.kmDriven + ' km' : '0 km'}</span></p>
            <p><strong>Status:</strong> <span style={{ color: '#ccc' }}>{bike.status || "Available"}</span></p>
          </div>
        </div>
      </section>
    </>
  );
};

export default BikeDetails;
