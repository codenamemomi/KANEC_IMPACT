import './StatsCard.css';

const StatsCard = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="stats-card">
      <div className="stats-header">
        <span className="stats-title">{title}</span>
        <div className="stats-icon" style={{ background: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="stats-value">{value}</div>
      {change && (
        <div className="stats-change">
          <span className="change-badge">{change}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;