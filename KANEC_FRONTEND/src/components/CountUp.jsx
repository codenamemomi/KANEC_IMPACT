import React from 'react';
import ReactCountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import './CountUp.css';

const CountUp = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <div ref={ref} className="count-up-container">
      <div className="count-box">
        <span className="count-number">
          {inView && <ReactCountUp end={5248} duration={2.5} />}
        </span>
        <p className="count-label">Trusted Donor</p>
      </div>
      <div className="count-box">
        <span className="count-number">
          {inView && <ReactCountUp end={187} duration={2.5} />}
        </span>
        <p className="count-label">Verified Projects</p>
      </div>
      <div className="count-box">
        <span className="count-number">
          {inView && <ReactCountUp end={96} duration={2.5} />}
        </span>
        <p className="count-label">Communities Impact</p>
      </div>
    </div>
  );
};

export default CountUp;