import { Phone, Mail, MapPin, Clock, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const contactItems = [
    {
      icon: <Phone size={20} />,
      title: 'Phone',
      content: (
        <a href="tel:+917387015887" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          +91 7387015887
        </a>
      ),
      subtext: 'Call us for instant support',
    },
    {
      icon: <Mail size={20} />,
      title: 'Email',
      content: (
        <a href="mailto:support@buddybike.in" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          support@buddybike.in
        </a>
      ),
      subtext: 'We reply within 24 hours',
    },
    {
      icon: <MapPin size={20} />,
      title: 'Address',
      content: (
        <span>
          5425+348, Nr. Amir Hotel, Bhavsar Chowk,<br />
          Gandhibag, Nagpur, Maharashtra 440002
        </span>
      ),
      subtext: 'Visit our showroom',
    },
    {
      icon: <Clock size={20} />,
      title: 'Business Hours',
      content: <span>Mon - Sun: 9:00 AM - 9:00 PM</span>,
      subtext: 'Open all days',
    },
  ];

  return (
    <>
      <section className="contact-section">
        <div style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
          <span className="section-label"><span className="section-icon"><Phone size={16} /></span> Get in Touch</span>
          <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>Contact Us</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>Visit our showroom or reach out directly. We're here to help you find your perfect ride.</p>
        </div>

        <div className="contact-container">
          <div className="contact-info">
            <h3>Contact Dealer</h3>

            {contactItems.map((item, i) => (
              <div key={i} className="contact-item">
                <div className="contact-icon">{item.icon}</div>
                <div className="contact-text">
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '2px' }}>{item.title}</p>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '2px' }}>{item.content}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{item.subtext}</p>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <a href="tel:+917387015887" className="btn btn-primary" style={{ flex: 1, minWidth: '160px' }}>
                <Phone size={16} /> Call Now
              </a>
              <a href="https://wa.me/917387015887" className="btn btn-secondary" style={{ flex: 1, minWidth: '160px' }}>
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>

          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59536.899128418925!2d79.03162044863282!3d21.150161800000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0cb1091be9d%3A0x1232b3f9c01426bc!2sSahil%20Auto%20Deal!5e0!3m2!1sen!2sin!4v1771819704626!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '350px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Buddy's Bike Showroom Location"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ marginTop: 'var(--space-12)', textAlign: 'center', maxWidth: '600px', margin: 'var(--space-12) auto 0' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>
            Not sure which bike to choose?
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>
            Browse our curated collection and use your EMI calculator to plan your purchase.
          </p>
          <Link to="/bikes" className="solid-btn btn-lg" style={{ display: 'inline-flex' }}>
            Explore Bikes <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Contact;
