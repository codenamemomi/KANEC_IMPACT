import "./Footer.css";
import { useState } from 'react';

const Footer = () => {
  const [activeColumn, setActiveColumn] = useState(null);

  const toggleColumn = (index) => {
    setActiveColumn(activeColumn === index ? null : index);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Kanec Impact Ledger</h3>
            <p>
              Making transparent giving simple through blockchain to enable donors to impact verified projects.
            </p>
          </div>

          {[
            {
              title: "Platform",
              links: [
                { text: "About Us", href: "#" },
                { text: "How It Works", href: "#" },
                { text: "FAQ", href: "#" },
                { text: "Contact", href: "#" }
              ]
            },
            {
              title: "Projects",
              links: [
                { text: "Browse Projects", href: "#" },
                { text: "Start a Project", href: "#" },
                { text: "Success Stories", href: "#" },
                { text: "Partners", href: "#" }
              ]
            },
            {
              title: "Resources",
              links: [
                { text: "Documentation", href: "#" },
                { text: "Blog", href: "#" },
                { text: "Newsletter", href: "#" },
                { text: "Transparency", href: "#" }
              ]
            },
            {
              title: "Legal",
              links: [
                { text: "Privacy Policy", href: "#" },
                { text: "Terms of Service", href: "#" },
                { text: "Compliance", href: "#" }
              ]
            }
          ].map((column, index) => (
            <div 
              key={index} 
              className={`footer-column ${activeColumn === index ? 'active' : ''}`}
            >
              <h4 onClick={() => toggleColumn(index)}>
                {column.title}
              </h4>
              <ul className="footer-links">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© 2025 Kanec. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;