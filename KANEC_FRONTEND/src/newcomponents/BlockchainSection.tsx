import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Eye, FileCheck, DollarSign } from 'lucide-react';
import './blockchain.css';

const BlockchainSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: Eye,
      title: 'Fully Portable',
      description: 'Watch your funds flow',
    },
    {
      icon: FileCheck,
      title: 'Blockchain Records',
      description: 'Immutable audit trail',
    },
    {
      icon: DollarSign,
      title: 'Project Escrows',
      description: 'Secured on-chain',
    },
  ];

  return (
    <section className="blockchain-section" ref={ref}>
      <div className="blockchain-container">
        <motion.div 
          className="blockchain-visual"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <img 
            src="/Map.jpg" 
            alt="Blockchain Network" 
            className="blockchain-image" 
          />
          <div className="blockchain-overlay"></div>
        </motion.div>

        <motion.div 
          className="blockchain-content"
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="blockchain-badge">Powered by Hedera</p>
          <h2 className="blockchain-title">See Every Transaction<br/> On-Chain</h2>
          <p className="blockchain-description">
            Every dollar donated is recorded on Hedera's public ledger, providing an undeniable, transparent record of all transactions.
          </p>

          <div className="blockchain-features">
            {features.map((feature, index) => (
              <div key={index} className="blockchain-feature">
                <div className="feature-icon-wrapper">
                  <feature.icon size={20} />
                </div>
                <div className="feature-content">
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlockchainSection;