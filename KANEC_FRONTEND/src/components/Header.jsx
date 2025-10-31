import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate('/signin');
    closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="logo">
        <span>KANEC</span> IMPACT LEDGER
      </div>

      {/* Desktop Navigation */}
      <nav className="nav">
        <div className="center-links">
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/donations">Donations</Link>
        </div>

        <div className="right-links">
          <button className="login-button" onClick={handleLogin}>
            Log in
          </button>
          <Link to="/contact" className="contact-link">Contact</Link>
        </div>
      </nav>

      {/* Hamburger Menu Button */}
      <button 
        className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={closeMobileMenu}>Home</Link>
        <Link to="/projects" onClick={closeMobileMenu}>Projects</Link>
        <Link to="/donations" onClick={closeMobileMenu}>Donations</Link>
        <Link to="/contact" className="contact-link" onClick={closeMobileMenu}>Contact</Link>
        
        <button className="mobile-login-button" onClick={handleLogin}>
          Log in
        </button>
      </div>
    </header>
  );
}

export default Header;