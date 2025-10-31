import { motion } from 'framer-motion';
import { Check, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './hero.css';

const Hero = () => {
  const navigate = useNavigate();

  // ✅ Clear session if page is refreshed
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('hasRefreshed');
    if (!hasRefreshed) {
      sessionStorage.clear();
      sessionStorage.setItem('hasRefreshed', 'true');
    }
  }, []);

  const handleDonate = () => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
    }
  };

  const handleJoin = () => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
    }
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="badge">
            <Check size={14} />
            <span>Kanec Impact Transparency Ledger</span>
          </div>
          
          <h1 className="hero-title">
            Fund Verified African Impact. <span className="highlight">Guaranteed by Hedera.</span>
          </h1>
          
          <p className="hero-description">
            With <strong>Kanec Impact Ledger</strong>, donors see every dollar<br/> 
            move in real time ensuring funds reach verified African<br/> 
            impact projects without corruption.
          </p>
          
          <div className="hero-actions">
            <button className="btn-primary" onClick={handleDonate}>Donate Now</button>
            <button className="btn-secondary" onClick={handleJoin}>Join the Network</button>
          </div>
        </motion.div>

        <motion.div 
          className="hero-card"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="card-badge">
            <Check size={12} />
            <span>100% Verified</span>
          </div>
          
          <img 
            src="/mon2.PNG" 
            alt="Education for All Project" 
            className="card-image" 
          />
          
          <div className="card-content">
            <h3 className="card-title">Education for All</h3>
            <div className="card-stats">
              <div className="stat">
                <span className="stat-value">$45,000</span>
                <span className="stat-label">raised of $100,000</span>
              </div>
              <div className="stat">
                <span className="stat-value">850</span>
                <span className="stat-label">donors</span>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <TrendingUp size={16} />
            <span>Real-Time Impact Tracking</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
