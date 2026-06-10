import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bike, Search, Phone, Calculator, Home, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isAdmin = path.startsWith('/admin');

  if (isAdmin) return null;

  const navItems = [
    { to: '/', label: 'Home', icon: <Home size={16} /> },
    { to: '/bikes', label: 'Explore Bikes', icon: <Search size={16} /> },
    { to: '/emi-calculator', label: 'EMI Calculator', icon: <Calculator size={16} /> },
    { to: '/contact', label: 'Contact', icon: <Phone size={16} /> },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">
            <Bike size={20} />
          </div>
          Buddy's Bike
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${path === item.to || (item.to === '/bikes' && path.startsWith('/bikes')) ? 'active' : ''}`}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {item.icon}
                {item.label}
              </span>
            </Link>
          ))}
          <Link to="/admin" className="nav-link nav-link-cta" style={{ marginLeft: '8px' }}>
            <LayoutDashboard size={14} />
            Admin
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`nav-toggle ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`nav-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div className={`nav-links ${mobileOpen ? 'open' : ''}`} style={{ display: mobileOpen ? 'flex' : undefined }}>
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`nav-link ${path === item.to || (item.to === '/bikes' && path.startsWith('/bikes')) ? 'active' : ''}`}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {item.icon}
              {item.label}
            </span>
          </Link>
        ))}
        <Link to="/admin" className="nav-link nav-link-cta" style={{ marginTop: '8px' }}>
          <LayoutDashboard size={16} />
          Admin Panel
        </Link>
      </div>
    </>
  );
};

export default Navbar;
