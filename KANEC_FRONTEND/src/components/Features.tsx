import "./Features.css";

const Features = () => {
  const features = [
    {
      number: "1",
      title: "100% Transparency",
      description: "Every transaction is recorded on the blockchain, giving donors complete visibility of funds."
    },
    {
      number: "2",
      title: "Blockchain Verified",
      description: "Every donation and transaction is verified through smart contracts on the blockchain."
    },
    {
      number: "3",
      title: "Secure & Trustless",
      description: "Our system removes any room for error or corruption by relying on trustless campaigns."
    },
    {
      number: "4",
      title: "Instant Settlement",
      description: "Impact is 3-5 days (1 sec for facilites to convert with centralized banking."
    }
  ];

  return (
    <section className="features">
      <div className="features-container">
        <div className="features-header">
          <span className="features-label">Blockchain Transparency</span>
          <h2>
            Why choose <span className="highlight">KANEC</span>
          </h2>
        </div>
        <p className="features-description">
          Built on Hedera's blockchain, every transaction is transparent, verified, and immutable. Trust through technology.
        </p>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.number} className="feature-card">
              <div className="feature-number">{feature.number}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
