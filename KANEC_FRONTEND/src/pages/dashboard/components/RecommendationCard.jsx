import { ExternalLink } from 'lucide-react';
import './RecommendationCard.css';

const RecommendationCard = ({ 
  title, 
  matchScore, 
  description, 
  category, 
  amount_raised, 
  target_amount, 
  completion_percentage 
}) => {
  const progress = completion_percentage || (amount_raised && target_amount ? (amount_raised / target_amount * 100) : 0);
  
  return (
    <div className="recommendation-card">
      <div className="rec-header">
        <h4 className="rec-title">{title}</h4>
        <span className="match-badge">{matchScore}</span>
      </div>
      <p className="rec-description">{description}</p>
      
      {amount_raised !== undefined && target_amount !== undefined && (
        <div className="funding-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="progress-text">
            ₦{parseInt(amount_raised).toLocaleString()} of ₦{parseInt(target_amount).toLocaleString()} raised
          </div>
        </div>
      )}
      
      <div className="rec-footer">
        <span className="category-badge">{category}</span>
        <button className="donate-btn">
          Donate Now
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;