import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Motorbike, Search, Phone, Calculator, Home, Sun, Moon } from 'lucide-react';

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme to <html> on mount and change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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
            <Motorbike size={20} />
          </div>
          Buddy's Bike
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links desktop-nav">
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

          {/* Theme Toggle - Desktop */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Theme Toggle + Mobile Toggle wrapper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Theme Toggle - Mobile (visible only on mobile) */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            style={{ display: 'none' }}
            id="mobile-theme-toggle"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className={`nav-toggle ${mobileOpen ? 'active' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`nav-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div className={`nav-links mobile-nav ${mobileOpen ? 'open' : ''}`}>
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

        {/* Theme Toggle inside mobile drawer */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', gap: '8px', height: '44px' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>
    </>
  );
};

export default Navbar;
