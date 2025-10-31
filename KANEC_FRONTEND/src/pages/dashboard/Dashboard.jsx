import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { ArrowRight, TrendingUp, FolderOpen, CheckCircle, ExternalLink, Calendar, Hash } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { API_CONFIG, API_BASE_URL } from '../../api/config';
import axios from 'axios';
import DonationChart from './components/DonationChart';
import StatsCard from './components/StatsCard';
import RecommendationCard from './components/RecommendationCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // Added navigate hook
  const [dashboardData, setDashboardData] = useState({
    totalDonations: 0,
    projectsSupported: 0,
    verifiedTransactions: 0,
    recentDonations: [],
    recommendations: [],
    insights: null,
    loading: true
  });
  const [currentRecommendationIndex, setCurrentRecommendationIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Carousel effect for recommendations
  useEffect(() => {
    if (dashboardData.recommendations.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentRecommendationIndex(prev => 
          prev === dashboardData.recommendations.length - 1 ? 0 : prev + 1
        );
        setIsTransitioning(false);
      }, 500); // Half of the transition time for fade out
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [dashboardData.recommendations.length]);

  const handleRecommendationClick = (recommendation) => {
    // Store the selected project in localStorage or state management
    // so the donations page can pre-select it
    const projectData = {
      name: recommendation.title,
      id: recommendation.id,
      category: recommendation.category
    };
    
    localStorage.setItem('selectedProject', JSON.stringify(projectData));
    
    // Navigate to donations page
    navigate('/dashboard/donations');
  };

  const calculateGrowthRate = (insights) => {
    if (!insights?.monthly_trends || insights.monthly_trends.length < 2) {
      return '+0%';
    }
    
    const currentMonth = insights.monthly_trends[insights.monthly_trends.length - 1];
    const previousMonth = insights.monthly_trends[insights.monthly_trends.length - 2];
    
    if (previousMonth.total_donated === 0) return '+100%';
    
    const growth = ((currentMonth.total_donated - previousMonth.total_donated) / previousMonth.total_donated) * 100;
    return `${growth > 0 ? '+' : ''}${Math.round(growth)}%`;
  };

  const formatCurrency = (amount) => {
    return `₦${parseInt(amount).toLocaleString()}`;
  };

  const formatDonationData = (donation) => ({
    project: donation.project_name || 'Unknown Project',
    amount: formatCurrency(donation.amount || 0),
    status: donation.status || 'Completed',
    date: new Date(donation.donated_at).toLocaleDateString('en-CA'),
    transactionHash: donation.tx_hash ? `${donation.tx_hash.slice(0, 6)}...${donation.tx_hash.slice(-4)}` : 'Pending...'
  });

  const getImpactMessage = () => {
    if (!dashboardData.insights?.user_impact_score) {
      return `₦${dashboardData.totalDonations.toLocaleString()} donated to ${dashboardData.projectsSupported} projects`;
    }
    
    const score = dashboardData.insights.user_impact_score;
    return `₦${dashboardData.totalDonations.toLocaleString()} donated to ${dashboardData.projectsSupported} projects • ${score.level} Impact Level`;
  };

  const getDefaultRecommendations = (projects) => {
    if (projects.length > 0) {
      return projects.slice(0, 3).map(project => ({
        id: project.id,
        title: project.title,
        matchScore: '85% match',
        description: project.description,
        category: project.category,
        amount_raised: project.amount_raised,
        target_amount: project.target_amount,
        completion_percentage: project.amount_raised / project.target_amount * 100
      }));
    }

    return [
      {
        title: 'Healthcare for Rural Women',
        matchScore: '95% match',
        description: 'Based on your support for social welfare projects',
        category: 'Healthcare',
      },
      {
        title: 'Youth Empowerment Program',
        matchScore: '88% match',
        description: 'Aligns with your education impact focus',
        category: 'Education',
      },
      {
        title: 'Renewable Energy Initiative',
        matchScore: '82% match',
        description: 'Similar to your solar power donations',
        category: 'Environment',
      }
    ];
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));
      
      const [insightsResponse, donationsResponse, projectsResponse] = await Promise.all([
        axios({
          method: API_CONFIG.analytics.userInsights.method,
          url: `${API_BASE_URL}${API_CONFIG.analytics.userInsights.url}`,
        }),
        axios({
          method: 'GET',
          url: `${API_BASE_URL}/api/v1/donations/my-donations`,
        }),
        axios({
          method: API_CONFIG.projects.list.method,
          url: `${API_BASE_URL}${API_CONFIG.projects.list.url}`,
        })
      ]);

      const insights = insightsResponse.data;
      const donations = donationsResponse.data || [];
      const projects = projectsResponse.data || [];

      const donationSummary = insights.insights?.donation_summary || {};
      const totalDonated = donationSummary.total_donated || 0;
      const totalDonations = donationSummary.total_donations || 0;
      const projectsSupported = new Set(donations.map(d => d.project_name)).size;

      setDashboardData({
        totalDonations: totalDonated,
        projectsSupported: projectsSupported,
        verifiedTransactions: totalDonations,
        recentDonations: donations.slice(0, 4),
        recommendations: insights.insights?.recommended_projects || getDefaultRecommendations(projects),
        insights: insights.insights,
        loading: false
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      
      if (error.response?.status === 401) {
        logout();
        return;
      }
      
      setDashboardData({
        totalDonations: 0,
        projectsSupported: 0,
        verifiedTransactions: 0,
        recentDonations: [],
        recommendations: getDefaultRecommendations([]),
        insights: null,
        loading: false
      });
    }
  };

  const stats = [
    {
      title: 'Total Donations',
      value: formatCurrency(dashboardData.totalDonations),
      change: calculateGrowthRate(dashboardData.insights),
      icon: TrendingUp,
      color: '#22c55e'
    },
    {
      title: 'Projects Supported',
      value: dashboardData.projectsSupported.toString(),
      change: `+${dashboardData.projectsSupported}`,
      icon: FolderOpen,
      color: '#22c55e'
    },
    {
      title: 'Verified Transactions',
      value: dashboardData.verifiedTransactions.toString(),
      icon: CheckCircle,
      color: '#22c55e'
    }
  ];

  if (dashboardData.loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-spinner">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back{user?.name ? `, ${user.name}` : ''}! Here's your impact overview.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="impact-hero">
        <div className="heros-content">
          <h2>Your Impact This Year</h2>
          <p className="hero-text">
            {getImpactMessage()}
          </p>
        </div>
        <Link to="/dashboard/donations" className="hero-btn">
          Start New Donation
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Recommendations */}
      <div className="content-grid">
        <div className="chart-section">
          <DonationChart monthlyTrends={dashboardData.insights?.monthly_trends} />
        </div>
        
        <div className="recommendations-section">
          <div className="section-header">
            <h3 className="section-title">
              Recommendations
            </h3>
            <p className="section-subtitle">Based on your impact history and preferences</p>
          </div>
          <div className="recommendations-carousel">
            {dashboardData.recommendations.length > 0 ? (
              <div 
                className={`recommendation-item ${isTransitioning ? 'fade-out' : 'fade-in'}`}
                onClick={() => handleRecommendationClick(dashboardData.recommendations[currentRecommendationIndex])}
                style={{ cursor: 'pointer' }}
              >
                <RecommendationCard 
                  key={dashboardData.recommendations[currentRecommendationIndex].id || currentRecommendationIndex}
                  title={dashboardData.recommendations[currentRecommendationIndex].title}
                  matchScore={dashboardData.recommendations[currentRecommendationIndex].matchScore || '85% match'}
                  description={dashboardData.recommendations[currentRecommendationIndex].description}
                  category={dashboardData.recommendations[currentRecommendationIndex].category}
                  amount_raised={dashboardData.recommendations[currentRecommendationIndex].amount_raised}
                  target_amount={dashboardData.recommendations[currentRecommendationIndex].target_amount}
                  completion_percentage={dashboardData.recommendations[currentRecommendationIndex].completion_percentage}
                />
              </div>
            ) : (
              <div className="no-recommendations">
                <p>No recommendations available at the moment.</p>
              </div>
            )}
            
            {/* Carousel indicators */}
            {dashboardData.recommendations.length > 1 && (
              <div className="carousel-indicators">
                {dashboardData.recommendations.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentRecommendationIndex ? 'active' : ''}`}
                    onClick={() => setCurrentRecommendationIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Donations Cards */}
      <div className="donations-cards-section">
        <div className="section-header">
          <h3 className="section-title">Recent Donations</h3>
          <p className="section-subtitle">Your latest impact contributions</p>
        </div>
        <div className="donations-cards-grid">
          {dashboardData.recentDonations.length > 0 ? (
            dashboardData.recentDonations.map((donation, index) => {
              const formattedDonation = formatDonationData(donation);
              return (
                <div key={donation.id || index} className="donation-card">
                  <div className="donation-header">
                    <h4 className="donation-project">{formattedDonation.project}</h4>
                    <span className="donation-amount">{formattedDonation.amount}</span>
                  </div>
                  <div className="donation-details">
                    <div className="donation-meta">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>{formattedDonation.date}</span>
                      </div>
                      <div className="meta-item">
                        <Hash size={14} />
                        <span className="transaction-hash">{formattedDonation.transactionHash}</span>
                      </div>
                    </div>
                    <div className="donation-status">
                      <span className="status-badge">{formattedDonation.status}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-donations">
              <p>No donations yet. Start making an impact!</p>
              <Link to="/dashboard/donations" className="hero-btn">
                Make Your First Donation
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Additional Insights */}
      {dashboardData.insights && (
        <div className="insights-section">
          <div className="section-header">
            <h3 className="section-title">Your Impact Insights</h3>
          </div>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>Most Supported Category</h4>
              <p>{dashboardData.insights.most_supported_category?.category || 'None'}</p>
              <small>{dashboardData.insights.most_supported_category?.percentage || 0}% of your donations</small>
            </div>
            <div className="insight-card">
              <h4>Donation Frequency</h4>
              <p>{dashboardData.insights.donation_frequency_trend?.trend || 'Stable'}</p>
              <small>{dashboardData.insights.donation_frequency_trend?.average_monthly_donations || 0} donations/month</small>
            </div>
            <div className="insight-card">
              <h4>Impact Level</h4>
              <p>{dashboardData.insights.user_impact_score?.level || 'Beginner'}</p>
              <small>Score: {dashboardData.insights.user_impact_score?.score || 0}/100</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;