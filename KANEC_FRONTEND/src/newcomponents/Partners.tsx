import './partners.css';

const Partners = () => {
  const partners = [
    'UNICEF',
    'Red Cross',
    'WHO',
    'UNESCO',
    'UNHCR',
    'World Bank',
    'Gates Foundation',
    'Hedera',
  ];

  return (
    <section className="partners">
      <div className="partners-container">
        <p className="partners-title">Trusted by leading organizations</p>
        <div className="partners-grid">
          {partners.map((partner, index) => (
            <div key={index} className="partner-item">
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;