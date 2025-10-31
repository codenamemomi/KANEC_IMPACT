import "./Blockchain.css";

const Blockchain = () => {
  const features = [
    {
      icon: "1",
      title: "On-Chain",
      description:
        "Verify on Hedera's blockchain that your donation reached the intended recipient.",
    },
    {
      icon: "2",
      title: "Blockchain Records",
      description:
        "Financial audits have never been easier with immutable transaction records.",
    },
    {
      icon: "3",
      title: "Project Reviews",
      description:
        "Select from our curated list of verified African projects for impact.",
    },
  ];

  return (
    <section className="blockchain">
      <div className="blockchain-container">
        <span className="blockchain-label">On-Chain Visibility</span>

        <div className="blockchain-content">
          <div className="blockchain-visual">
            <img
              src="https://images.unsplash.com/photo-1642104704073-3c5e5ad2f3b0?auto=format&fit=crop&w=1200&q=80"
              alt="Blockchain Network Visualization"
            />
          </div>

          <div className="blockchain-text">
            <h2>See Every Transaction On-Chain</h2>
            <p>
              With Kanec, you're empowered to see exactly where your donations
              go. Search Hedera's public ledger, verify it with our verification
              portal, or access detailed reports by transaction ID or date
              range.
            </p>

            <div className="blockchain-features">
              {features.map((feature) => (
                <div key={feature.icon} className="blockchain-feature">
                  <div className="blockchain-feature-icon">{feature.icon}</div>
                  <div className="blockchain-feature-content">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blockchain;
