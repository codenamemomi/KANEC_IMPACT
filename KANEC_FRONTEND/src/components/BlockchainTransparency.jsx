import React from 'react';
import './BlockchainTransparency.css';

const BlockchainTransparency = () => {
  return (
    <div className="blockchain-transparency">
      <h1>Blockchain Transparency</h1>

      <div className="why-choose-section">
        <h2 className="why-choose-title">
          Why choose <span className="kanec-highlight"><br />KANEC</span>
        </h2>
      </div>

      <p>
        Build on a Hedera blockchain, every transaction is transparent, verified,
        <br /> and immutable instant. Trust through technology.
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-number">1</div>
          <h3 className="feature-title">100% Transparency</h3>
          <p className="feature-description">
            Every transaction is recorded on Hedera’s public ledger, ensuring complete traceability of funds.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-number">2</div>
          <h3 className="feature-title">Blockchain Verified</h3>
          <p className="feature-description">
            Every donation is recorded on Hedera blockchain for complete transparency and immutable proof of impact.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-number">3</div>
          <h3 className="feature-title">Secure & Trustless</h3>
          <p className="feature-description">
            Smart contracts ensure funds reach their destination with no intermediaries or corruption.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-number">4</div>
          <h3 className="feature-title">Instant Settlement</h3>
          <p className="feature-description">
            Hedera’s 3–5 second finality means funds reach projects faster than traditional banking.
          </p>
        </div>
      </div>

      {/* ===== FIXED SECTION START ===== */}
      <div className="map-section">
        {/* Left: Map */}
        <div className="map-placeholder">
          <img
            src="/Map.jpg"
            alt="Global blockchain transparency map"
          />
        </div>

        {/* Right: Content + Steps */}
        <div className="map-content">
          <p className="powered-by">Powered by Hedera</p>
          <h2>See Every Transaction<br/>On-Chain</h2>
          <p className="map-description">
            Track your donation from wallet to impact. Every HBAR donated is recorded on Hedera’s public ledger,
            providing unprecedented transparency in charitable giving.
          </p>

          <div className="metrics">
            <div className="metric">
              <div className="metric-number">1</div>
              <div className="metric-text">
                <strong>You Donate</strong>
                <br />
                Wallet + Smart Contract
              </div>
            </div>

            <div className="metric">
              <div className="metric-number">2</div>
              <div className="metric-text">
                <strong>Blockchain Records</strong>
                <br />
                Immutable Ledger Entry
              </div>
            </div>

            <div className="metric">
              <div className="metric-number">3</div>
              <div className="metric-text">
                <strong>Project Receives</strong>
                <br />
                Verified Impact Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ===== FIXED SECTION END ===== */}
    </div>
  );
};

export default BlockchainTransparency;
