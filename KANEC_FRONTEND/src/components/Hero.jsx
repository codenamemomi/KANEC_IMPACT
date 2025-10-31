import React from "react";
import "./Hero.css";

function Hero() {
  return (
    <section className="heros">
      {/* LEFT SIDE */}
      <div className="hero-contents">
        <span className="transparency-badges">
          🌍 Global Donor Transparency Ledger
        </span>

        <h1>
          Fund Verified African Impact.
          <span className="highlights">Guaranteed <br />by Hedera.</span>
        </h1>

        <p>
          With <span className="bolds">Kanec Impact Ledger</span>, donors see
          every dollar <br />
          move in real time ensuring funds reach verified African <br />
          impact projects without corruption.
        </p>

        <div className="hero-buttons">
          <button className="donate-btns">Donate Now</button>
          <button className="join-btns">Join the Network</button>
        </div>
      </div>

      {/* RIGHT SIDE (recreated cleanly) */}
      <div className="hero-visuals">
        {/* Top Floating Tag */}
        <div className="verified-tags">100% Verified<br/> Blockchain Proven</div>

        {/* Main Project Card */}
        <div className="project-cards">
          <img
            src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80"
            alt="Education for All"
          />
          <div className="project-infos">
            <div className="header-rows">
              <h3>Education for All</h3>
              <span className="statuss">Active</span>
            </div>

            <div className="detailss">
              <p>
                <strong>$45,000</strong> raised of $100,000
              </p>
              <p>
                <strong>850</strong> donors
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Floating Tag */}
        <div className="tracking-tags">Real-Time<br/>Impact Tracking</div>
      </div>
    </section>
  );
}

export default Hero;
