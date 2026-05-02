import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="navbar">
      <h2><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>⚡ Buddy's Bike</Link></h2>
      <div className="nav-links" style={{ display: 'flex', gap: '15px' }}>
        {path !== '/' && (
          <Link to="/"><button className="neon-btn">Home</button></Link>
        )}
        {!path.startsWith('/bikes') && (
          <Link to="/bikes"><button className="neon-btn">Explore All Bikes</button></Link>
        )}
        {path !== '/emi-calculator' && (
          <Link to="/emi-calculator"><button className="neon-btn">EMI Calculator</button></Link>
        )}
        {path !== '/contact' && (
          <Link to="/contact"><button className="neon-btn">Contact</button></Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
