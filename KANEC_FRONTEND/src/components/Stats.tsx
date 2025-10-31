import "./Stats.css";

const Stats = () => {
  return (
    <section className="stats">
      <div className="stats-container">
        <div className="stat-item">
          <h2>5,248</h2>
          <p>Trusted Donors</p>
        </div>
        <div className="stat-item">
          <h2>187</h2>
          <p>Verified Projects</p>
        </div>
        <div className="stat-item">
          <h2>96</h2>
          <p>Communities Impacted</p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
