import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, CheckCircle, Lock, Zap } from 'lucide-react';
import './whychoose.css';

const WhyChoose = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits = [
    {
      number: '1',
      title: '100% Transparency',
      description: 'Every transaction is recorded on Hedera\'s blockchain, giving donors an auditable trail of funds.',
      icon: Shield,
    },
    {
      number: '2',
      title: 'Blockchain Verified',
      description: 'Every project has been verified by our team and recorded on-chain with immutable proof of impact.',
      icon: CheckCircle,
    },
    {
      number: '3',
      title: 'Secure & Trustless',
      description: 'Smart contracts ensure money goes exactly where it\'s promised, removing human corruption.',
      icon: Lock,
    },
    {
      number: '4',
      title: 'Instant Settlement',
      description: 'Hedera\'s 3-5 second finality means your funds reach projects almost instantly with minimal fees.',
      icon: Zap,
    },
  ];

  return (
    <section className="features-section" ref={ref}>
      <div className="features-container">
        <div className="features-header">
          <p className="features-badge">Blockchain Transparency</p>
          <h2 className="features-title">
            Why choose<br/><span className="features-highlight">KANEC</span>
          </h2>
          <p className="features-description">
            Built on Hedera's blockchain, every transaction is transparent, verified, and immutable. Trust through technology.
          </p>
        </div>

        <div className="features-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="feature-number">{benefit.number}</div>
              <div className="feature-icon">
                <benefit.icon size={28} />
              </div>
              <h3 className="feature-title">{benefit.title}</h3>
              <p className="feature-description">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;