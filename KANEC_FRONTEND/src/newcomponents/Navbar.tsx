import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="site-navbar">
      <div className="navbar-inner">
        {/* LOGO - LEFT ALIGNED */}
        <div className="brand-wrapper">
          <Link to="/" className="brand-link" onClick={closeMenu}>
            <img
              src="/logo.jpg"
              alt="KANEC IMPACT LEDGER"
              className="brand-logo"
            />
            <div className="brand-texts">
              <span className="brand-titles">KANEC</span>
              <span className="brand-subtitles">IMPACT LEDGER</span>
            </div>
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* NAV MENU */}
        <div className={`nav-menu ${isOpen ? 'menu-open' : ''}`}>
          {/* NAV LINKS - CENTERED */}
          <div className="nav-links">
            <Link to="/" className="nav-item" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/projects" className="nav-item" onClick={closeMenu}>
              Projects
            </Link>
            <Link to="/About" className="nav-item" onClick={closeMenu}>
              About
            </Link>
          </div>

          {/* ACTION BUTTONS - RIGHT */}
          <div className="action-buttons">
            <Link to="/signin" className="btn-signin" onClick={closeMenu}>
              Log In
            </Link>
            <Link to="/donate" className="btn-contact" onClick={closeMenu}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;