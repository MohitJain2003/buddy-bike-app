import { useEffect, useState } from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Shield, Award, Clock, TrendingUp, Phone, Motorbike, Trophy, Flag } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Home = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true);
      const { data, error } = await supabaseClient.from('bikes').select('*').limit(8);
      if (!error && data) setBikes(data);
      setLoading(false);
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

  const stats = [
    { icon: <Shield size={24} />, value: '100%', label: 'Verified Bikes' },
    { icon: <Award size={24} />, value: '500+', label: 'Happy Riders' },
    { icon: <Clock size={24} />, value: '24/7', label: 'Support' },
    { icon: <TrendingUp size={24} />, value: 'Best', label: 'Market Prices' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <ScrollReveal animation="fade">
          <div className="hero-content">
            <div className="hero-badge">
              <Motorbike size={16} /> Premium Used Bikes Marketplace
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 800, marginBottom: 'var(--space-4)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>Ride The Future</h1>
            <p>Discover curated, quality-verified pre-owned bikes at unbeatable prices. Your next ride starts here.</p>
            <div className="hero-buttons">
              <Link to="/bikes" className="solid-btn btn-lg">
                Explore Bikes <ArrowRight size={18} />
              </Link>
              <Link to="/emi-calculator" className="btn btn-secondary btn-lg">
                Calculate EMI
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Stats Bar */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container home-stats-grid">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} animation="slide-up" delay={i * 100}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', justifyContent: 'center' }}>
                <div style={{ color: 'var(--primary)', display: 'flex' }}>{stat.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Featured Bikes */}
      <section className="featured-section">
        <ScrollReveal animation="slide-up">
          <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label"><span className="section-icon"><Trophy size={16} /></span> Featured</span>
            <h3 style={{ fontSize: 'var(--text-3xl)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>Featured Bikes</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>Hand-picked premium bikes from our collection</p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade" delay={150}>
          <div className="carousel-wrapper">
            <button className="carousel-btn left-btn" onClick={() => scrollCarousel(-1)} aria-label="Scroll left">
              <ChevronLeft size={20} />
            </button>
            <div className="carousel-container" id="bikes-container">
              {loading ? (
                <div style={{ display: 'flex', gap: 'var(--space-5)', padding: 'var(--space-4)' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="carousel-card" style={{ minWidth: 280, padding: 'var(--space-6)', textAlign: 'center' }}>
                      <div className="spinner" style={{ margin: '0 auto' }} />
                      <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>Loading...</p>
                    </div>
                  ))}
                </div>
              ) : bikes.length === 0 ? (
                <p style={{ textAlign: 'center', width: '100%', color: 'var(--text-muted)', padding: 'var(--space-8)' }}>No bikes available yet. Check back soon!</p>
              ) : (
                bikes.map(bike => {
                  const displayPrice = !isNaN(bike.price) ? Number(bike.price).toLocaleString('en-IN') : bike.price;
                  const imageUrl = (bike.imageUrls && bike.imageUrls.length > 0) ? bike.imageUrls[0] : '/assets/placeholder.jpg';
                  const km = bike.kmDriven ? bike.kmDriven.toLocaleString('en-IN') + ' km' : '0 km';
                  const isSold = bike.status === 'Sold';
                  return (
                    <div className="carousel-card" key={bike.id}>
                      {isSold && <div className="sold-badge">SOLD</div>}
                      <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                        <img src={imageUrl} alt={bike.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: 'var(--space-4)' }}>
                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bike.name}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>{km} • {bike.year}</p>
                        <h3 style={{ color: 'var(--primary)', fontSize: 'var(--text-lg)', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>₹ {displayPrice}</h3>
                        <Link to={`/bikes/${bike.id}`}>
                          <button className="btn btn-outline btn-full" style={{ marginTop: 'var(--space-3)' }}>
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <button className="carousel-btn right-btn" onClick={() => scrollCarousel(1)} aria-label="Scroll right">
              <ChevronRight size={20} />
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="slide-up" delay={250}>
          <Link to="/bikes">
            <button className="solid-btn btn-lg" style={{ display: 'flex', margin: 'var(--space-10) auto 0', alignItems: 'center', gap: 'var(--space-2)' }}>
              View All Bikes <ArrowRight size={18} />
            </button>
          </Link>
        </ScrollReveal>
      </section>

      {/* Brands Section */}
      <section className="brands-section">
        <ScrollReveal animation="slide-up">
          <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label"><span className="section-icon"><Flag size={16} /></span> Brands</span>
            <h3 style={{ fontSize: 'var(--text-3xl)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>Top Brands</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>Browse bikes from the most trusted manufacturers</p>
          </div>
        </ScrollReveal>
        
        <div className="brands-grid">
          {[
            { name: 'Hero', slug: 'hero' },
            { name: 'Honda', slug: 'honda' },
            { name: 'Bajaj', slug: 'bajaj' },
            { name: 'TVS', slug: 'tvs' },
            { name: 'Royal Enfield', slug: 'royalenfield' },
            { name: 'Suzuki', slug: 'suzuki' },
            { name: 'Yamaha', slug: 'yamaha' },
            { name: 'KTM', slug: 'ktm' },
            { name: 'Jawa', slug: 'jawa' },
          ].map((brand, idx) => (
            <Link to={`/bikes?brand=${brand.name}`} key={brand.name}>
              <ScrollReveal animation="scale" delay={(idx % 3) * 80}>
                <div className="brand-card">
                  <img src={`/assets/${brand.slug}.png`} alt={brand.name} loading="lazy" />
                  <span>{brand.name}</span>
                </div>
              </ScrollReveal>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <ScrollReveal animation="scale">
        <section style={{ padding: 'var(--space-16) var(--space-6)', textAlign: 'center', width: '100%' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-12) var(--space-8)', boxShadow: 'var(--shadow-xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>Ready to Find Your Dream Bike?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-lg)' }}>Get in touch with our team for personalized recommendations and the best deals.</p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="solid-btn btn-lg">
                <Phone size={18} /> Contact Us
              </Link>
              <Link to="/emi-calculator" className="btn btn-secondary btn-lg">
                <TrendingUp size={18} /> Calculate EMI
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
};

export default Home;
