import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './cta.css';

const CTASection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const navigate = useNavigate();

  // ✅ Clear session if page is refreshed
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('hasRefreshed');
    if (!hasRefreshed) {
      sessionStorage.clear();
      sessionStorage.setItem('hasRefreshed', 'true');
    }
  }, []);

  const handleStartDonating = () => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      navigate('/dashboard/donations');
    } else {
      sessionStorage.setItem('redirectAfterLogin', '/dashboard/donations');
      navigate('/signin');
    }
  };

  const handleLaunchProject = () => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      navigate('/dashboard/projects');
    } else {
      sessionStorage.setItem('redirectAfterLogin', '/dashboard/projects');
      navigate('/signin');
    }
  };

  return (
    <section className="cta-section" ref={ref}>
      <motion.div 
        className="cta-container"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="cta-title">Join the Movement</h2>
        <p className="cta-description">
          Let's rebuild trust in giving and create lasting change across Africa 
        </p>
        <div className="cta-actions">
          <button className="cta-button primary" onClick={handleStartDonating}>
            Start Donating
          </button>
          <button className="cta-button secondary" onClick={handleLaunchProject}>
            Launch Your Project
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
