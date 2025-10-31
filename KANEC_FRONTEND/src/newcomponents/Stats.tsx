import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import './stats.css';

const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { target: 5248, label: 'Trained Donors' },
    { target: 187, label: 'Verified Projects' },
    { target: 96, label: 'Communities Impacted' },
  ];

  return (
    <section className="digits-section" ref={ref}>
      <div className="digits-container">
        {stats.map((stat, index) => (
          <CountUpItem
            key={index}
            target={stat.target}
            label={stat.label}
            inView={inView}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
};

const CountUpItem = ({ target, label, inView, delay }: {
  target: number;
  label: string;
  inView: boolean;
  delay: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, target]);

  const formattedCount = count.toLocaleString('en-US');

  return (
    <motion.div
      className="digits-item"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="digits-value">{formattedCount}</h3>
      <p className="digits-label">{label}</p>
    </motion.div>
  );
};

export default Stats;