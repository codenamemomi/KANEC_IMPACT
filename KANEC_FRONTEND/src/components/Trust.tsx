import "./Trust.css";

const Trust = () => {
  const partners = [
    "UNICEF", "Red Cross", "WHO", "UNESCO",
    "UNHCR", "World Bank", "Gates Foundation", "Hedera"
  ];

  return (
    <section className="trust">
      <div className="trust-container">
        <h2>Trusted by leading organizations</h2>
        <div className="trust-logos">
          {partners.map((partner) => (
            <div key={partner} className="trust-logo">
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;