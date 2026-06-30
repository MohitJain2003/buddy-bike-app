import { Link, useLocation } from 'react-router-dom';
import { Motorbike, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const currentYear = new Date().getFullYear();

  if (isAdmin) return null;

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>
            <Motorbike size={22} color="var(--primary)" />
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
              <a
                href="https://www.google.com/maps/search/?api=1&query=Sahil+Auto+Deal+Bhavsar+Chowk+Nagpur"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <MapPin size={14} /> Nagpur, Maharashtra
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Buddy's Bike. All rights reserved.</p>
        <div className="footer-social">
          <a href="https://www.instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
          </a>
          <a href="https://www.facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
          </a>
          <a href="https://www.twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
