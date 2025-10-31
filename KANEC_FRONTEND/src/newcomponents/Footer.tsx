import './footer.css';

const Footer = () => {
  const footerSections = [
    {
      title: 'Platform',
      links: ['How It Works', 'About Us', 'Our Story', 'FAQ', 'Contact'],
    },
    {
      title: 'Browse',
      links: ['Browse Projects', 'Funded Projects', 'Organizations'],
    },
    {
      title: 'Resources',
      links: ['Blog', 'Documentation', 'Help Center', 'Whitepaper'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Transparency'],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">K</div>
              <div className="footer-logo-text">
                <span className="footer-logo-main">Kanec Impact Ledger</span>
                <span className="footer-logo-sub">
                  Blockchain-verified impact funding for Africa
                </span>
              </div>
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div key={index} className="footer-section">
              <h4 className="footer-title">{section.title}</h4>
              <ul className="footer-links">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="footer-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 Kanec. All rights reserved.
          </p>
          <p className="footer-powered">
            Powered by <span className="footer-hedera">Hedera</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
