import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './vision.css';

const Vision = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="vision" ref={ref}>
      <motion.div 
        className="vision-container"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="vision-title">Our Vision</h2>
        <p className="vision-description">
          To create a world where every donation is transparent, accountable, and impactful, empowering donors and<br/> communities through a decentralized ledger on Hedera.
        </p>
      </motion.div>
    </section>
  );
};

export default Vision;