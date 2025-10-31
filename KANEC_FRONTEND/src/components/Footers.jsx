import React from 'react';
import './Footers.css';

const Footers = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <div className="footer-column">
          <h3>Kanec Impact Ledger</h3>
          <p>Building transparent impact through blockchain technology.</p>
          <div className="rating">
            <span className="star"></span>
            <span className="star"></span>
            <span className="star"></span>
            <span className="star"></span>
            <span className="star empty"></span>
          </div>
        </div>
        <div className="footer-column">
          <h3>Platform</h3>
          <ul>
            <li>About Us</li>
            <li>How It Works</li>
            <li>FAQ</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Projects</h3>
          <ul>
            <li>Browse Projects</li>
            <li>Submit Project</li>
            <li>Success Stories</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Resources</h3>
          <ul>
            <li>Documentation</li>
            <li>Blog</li>
            <li>Developers</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Legal</h3>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Transparency</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Kanec. All rights reserved.</p>
        <p className="powered-by">Powered by <span>Kanec</span></p>
      </div>
    </footer>
  );
};

export default Footers;