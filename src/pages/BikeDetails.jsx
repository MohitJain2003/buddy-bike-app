import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabaseClient } from '../utils/supabaseClient';
import ThreeBg from '../components/ThreeBg';
import { ChevronLeft, ChevronRight, ArrowLeft, Phone, Tag, Calendar, Gauge, Fuel, Share2, Heart } from 'lucide-react';

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
    setCurrentImageIndex(0);
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
    if (swipeDistance < -threshold) changeImage(1);
    if (swipeDistance > threshold) changeImage(-1);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)', marginTop: 'var(--text-4)' }}>Loading bike details...</p>
        </div>
      </div>
    );
  }

  if (error || !bike) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--danger)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>{error || "Bike not found."}</p>
          <Link to="/bikes" className="btn btn-outline">
            <ArrowLeft size={16} /> Back to Bikes
          </Link>
        </div>
      </div>
    );
  }

  const images = bike.imageUrls || [];
  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[currentImageIndex] : '/assets/placeholder.jpg';
  const showArrows = images.length > 1;
  const isSold = bike.status === 'Sold';
  const displayPrice = !isNaN(bike.price) ? Number(bike.price).toLocaleString('en-IN') : bike.price;

  const specs = [
    { icon: <Tag size={16} />, label: 'Price', value: `₹ ${displayPrice}`, highlight: true },
    { icon: <Tag size={16} />, label: 'Brand', value: bike.brand || 'N/A' },
    { icon: <Calendar size={16} />, label: 'Year', value: bike.year || 'N/A' },
    { icon: <Gauge size={16} />, label: 'KM Driven', value: bike.kmDriven ? `${Number(bike.kmDriven).toLocaleString('en-IN')} km` : '0 km' },
    { icon: <Fuel size={16} />, label: 'Status', value: bike.status || 'Available', isStatus: true },
  ];

  return (
    <>
      <ThreeBg />
      <section className="details-section">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/bikes">Bikes</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{bike.name}</span>
        </div>

        {/* Back Link */}
        <Link to="/bikes" className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-6)', display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to all bikes
        </Link>

        {/* Image Slider */}
        <div
          className="slider-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {showArrows && (
            <button className="slider-btn" onClick={() => changeImage(-1)} aria-label="Previous image">
              <ChevronLeft size={24} />
            </button>
          )}

          <img className="slider-img" src={currentImage} alt={`${bike.name} - Image ${currentImageIndex + 1}`} />

          {isSold && <div className="sold-badge" style={{ top: 'var(--space-4)', left: 'var(--space-4)', fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}>SOLD</div>}

          {showArrows && (
            <button className="slider-btn" onClick={() => changeImage(1)} aria-label="Next image">
              <ChevronRight size={24} />
            </button>
          )}

          {/* Dots */}
          {showArrows && (
            <div className="slider-dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`slider-dot ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
              {bike.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-base)' }}>
              {bike.brand} • {bike.year} • {bike.model}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="btn btn-ghost btn-sm" aria-label="Share">
              <Share2 size={16} />
            </button>
            <button className="btn btn-ghost btn-sm" aria-label="Save to favorites">
              <Heart size={16} />
            </button>
          </div>
        </div>

        {/* Specs Card */}
        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            Specifications
          </h3>
          <div className="specs-grid">
            {specs.map((spec, i) => (
              <div key={i} className="spec-item">
                <span className="spec-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                    {spec.icon} {spec.label}
                  </span>
                </span>
                <span className="spec-value" style={
                  spec.highlight ? { color: 'var(--primary)', fontSize: 'var(--text-lg)', fontFamily: 'var(--font-heading)' } :
                  spec.isStatus ? { color: bike.status === 'Sold' ? 'var(--danger)' : 'var(--success)', fontWeight: 700 } :
                  {}
                }>
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <a href="tel:+917387015887" className="btn btn-primary btn-lg" style={{ flex: 1, minWidth: '200px' }}>
            <Phone size={18} /> Call Dealer
          </a>
          <Link to="/emi-calculator" className="btn btn-secondary btn-lg" style={{ flex: 1, minWidth: '200px' }}>
            Calculate EMI
          </Link>
        </div>
      </section>
    </>
  );
};

export default BikeDetails;
