import { Link } from 'react-router-dom';
import { Bike, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>
            <Bike size={22} color="var(--primary)" />
            Buddy's Bike
          </h3>
          <p>Your trusted destination for premium used bikes. Quality rides, transparent deals, and a community of passionate riders.</p>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/bikes">Explore Bikes</Link></li>
            <li><Link to="/emi-calculator">EMI Calculator</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Top Brands</h4>
          <ul className="footer-links">
            <li><Link to="/bikes?brand=Royal%20Enfield">Royal Enfield</Link></li>
            <li><Link to="/bikes?brand=Honda">Honda</Link></li>
            <li><Link to="/bikes?brand=Bajaj">Bajaj</Link></li>
            <li><Link to="/bikes?brand=KTM">KTM</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          <ul className="footer-links">
            <li>
              <a href="tel:+917387015887" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} /> +91 7387015887
              </a>
            </li>
            <li>
              <a href="mailto:support@buddybike.in" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} /> support@buddybike.in
              </a>
            </li>
            <li>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> Nagpur, Maharashtra
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Buddy's Bike. All rights reserved.</p>
        <div className="footer-social">
          <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
          <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
          <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
