import { motion } from "framer-motion";
import { Users, Globe, DollarSign } from "lucide-react";
import "./About.css";

const About = () => {
  const teamMembers = [
    {
      name: "Elizabeth Okokon",
      role: "PROJECT MANAGER / HEDERA DEVELOPER",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    },
    {
      name: "Akinrogunde Omomijudeoluwa",
      role: "BACKEND & BLOCKCHAIN DEVELOPER",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      name: "Eze kelechi Joseph",
      role: "FRONTEND DEVELOPER",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
    },
    {
      name: "Esimke Chisom Emmanuel",
      role: "FRONTEND DEVELOPER",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
    },
    {
      name: "Olise Oseyenum Kenneth",
      role: "UI/UX DESIGNER",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    },
  ];

  return (
    <div className="about-page">
      {/* ---------- HERO ---------- */}
      <section className="about-hero">
        <div className="about-container">
          <motion.div
            className="about-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="about-hero-label">Our Story</p>
            <h1 className="about-hero-title">Who We Are</h1>
            <p className="about-hero-description">
              We're a team of innovators, blockchain enthusiasts, and social impact
              advocates building the future of transparent charitable giving. Our
              mission is to connect donors with verified projects through the power
              of Hedera's distributed ledger technology.
            </p>
            <button className="about-hero-button">Read Donating</button>
          </motion.div>
        </div>
      </section>

      {/* ---------- MISSION & VISION ---------- */}
      <section className="about-mission-vision">
        <div className="about-container">
          <div className="about-mission-vision-grid">
            <motion.div
              className="about-mission-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="about-section-subtitle about-green">Our Mission</h3>
              <p className="about-section-text">
                To revolutionize charitable giving by using Hedera's blockchain and AI
                to ensure every donation is traceable, transparent, and impactful,
                empowering both donors and communities through a decentralized ledger
                approach.
              </p>
            </motion.div>

            <motion.div
              className="about-vision-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="about-section-subtitle about-yellow">Our Vision</h3>
              <p className="about-section-text">
                To create a world where every donation is transparent, accountable,
                and impactful, empowering donors and communities through a
                decentralized ledger system on Hedera.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- IMPACT ---------- */}
      <section className="about-impact-section">
        <div className="about-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="about-text-title">Our Impact</h3>
            <p className="about-section-description">
              Real numbers that demonstrate our commitment to transparency and
              measurable change
            </p>
          </motion.div>

          <div className="about-impact-grid">
            <motion.div
              className="about-impact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="about-impact-icon about-green">
                <Users size={32} />
              </div>
              <h3 className="about-impact-number">50K+ Donors</h3>
              <p className="about-impact-text">Building a community of transparent</p>
            </motion.div>

            <motion.div
              className="about-impact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="about-impact-icon about-green">
                <Globe size={32} />
              </div>
              <h3 className="about-impact-number">100+ Projects</h3>
              <p className="about-impact-text">Verified social impact initiatives</p>
            </motion.div>

            <motion.div
              className="about-impact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="about-impact-icon about-green">
                <Globe size={32} />
              </div>
              <h3 className="about-impact-number">25 Countries</h3>
              <p className="about-impact-text">Global reach and impact</p>
            </motion.div>

            <motion.div
              className="about-impact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="about-impact-icon about-green">
                <DollarSign size={32} />
              </div>
              <h3 className="about-impact-number">$2M+ Raised</h3>
              <p className="about-impact-text">Transparent donations on blockchain</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- TEAM ---------- */}
      <section className="about-team-section">
        <div className="about-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="about-section-label">Meet The Team</p>
            <h3 className="about-text-title">The People Behind KANEC</h3>
            <p className="about-section-description">
              Our diverse team brings together expertise in blockchain technology,
              social impact, and community building to create meaningful change.
            </p>
          </motion.div>

          <div className="about-team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="about-team-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="about-team-image-wrapper">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3 className="about-team-name">{member.name}</h3>
                <p className="about-team-role">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CORE VALUES ---------- */}
      <section className="about-values-section">
        <div className="about-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="about-text-title">Our Core Values</h3>
          </motion.div>

          <div className="about-values-grid">
            <motion.div
              className="about-value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="about-value-icon">T</div>
              <h3 className="about-value-title">Transparency</h3>
              <p className="about-value-text">
                Every transaction is recorded on the blockchain, ensuring complete
                visibility and accountability.
              </p>
            </motion.div>

            <motion.div
              className="about-value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="about-value-icon">I</div>
              <h3 className="about-value-title">Impact</h3>
              <p className="about-value-text">
                We measure and report real-world outcomes, ensuring donations create
                meaningful change.
              </p>
            </motion.div>

            <motion.div
              className="about-value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="about-value-icon">C</div>
              <h3 className="about-value-title">Community</h3>
              <p className="about-value-text">
                Building a global network of donors, projects, and changemakers
                working together.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- CTA (still uses the animated gradient) ---------- */}
      <section className="about-cta-section">
        <div className="about-container">
          <motion.div
            className="about-cta-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="about-cta-title">Ready to Make an Impact?</h3>
            <p className="about-cta-description">
              Join thousands of donors making a difference through transparent,
              blockchain-verified donations
            </p>
            <div className="about-cta-buttons">
              <button className="about-cta-button about-primary">
                Start Donating
              </button>
              <button className="about-cta-button about-secondary">
                Explore Projects
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;