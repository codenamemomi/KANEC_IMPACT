import { useState, useEffect } from "react";
import { RefreshCw, Heart, TrendingUp, Sparkles, BarChart3, PieChart, Target, CircleDot } from "lucide-react";
import { toast } from "sonner";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { API_CONFIG, API_BASE_URL } from "../../api/config";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import "./AIInsights.css";

const AIInsights = () => {
  const { user } = useAuth();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [insights, setInsights] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [platformOverview, setPlatformOverview] = useState(null);
  const [userComparison, setUserComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsightsData();
  }, []);

  const fetchInsightsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all analytics data in parallel
      const [insightsResponse, globalStatsResponse, platformResponse, compareResponse] = await Promise.all([
        axios({
          method: API_CONFIG.analytics.userInsights.method,
          url: `${API_BASE_URL}${API_CONFIG.analytics.userInsights.url}`,
        }),
        axios({
          method: API_CONFIG.analytics.globalStats.method,
          url: `${API_BASE_URL}${API_CONFIG.analytics.globalStats.url}`,
        }),
        axios({
          method: API_CONFIG.analytics.platformOverview.method,
          url: `${API_BASE_URL}${API_CONFIG.analytics.platformOverview.url}`,
        }),
        axios({
          method: API_CONFIG.analytics.compareUser.method,
          url: `${API_BASE_URL}${API_CONFIG.analytics.compareUser.url}`,
        })
      ]);

      setInsights(insightsResponse.data);
      setGlobalStats(globalStatsResponse.data);
      setPlatformOverview(platformResponse.data);
      setUserComparison(compareResponse.data);

      console.log("AI Insights data loaded:", {
        insights: insightsResponse.data,
        globalStats: globalStatsResponse.data,
        platformOverview: platformResponse.data,
        userComparison: compareResponse.data
      });

    } catch (error) {
      console.error("Error fetching insights data:", error);
      toast.error("Failed to load insights data");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    toast.success("Regenerating AI insights...");
    
    // Simulate AI regeneration (in a real app, this would call an AI endpoint)
    setTimeout(() => {
      fetchInsightsData();
      setIsRegenerating(false);
      toast.success("Insights updated!");
    }, 1500);
  };

  const handleQuickDonate = (projectTitle) => {
    toast.success(`Quick donation to ${projectTitle} initiated!`);
  };

  const getReasonIcon = (type) => {
    switch (type) {
      case "similar":
        return <Target size={14} />;
      case "trending":
        return <TrendingUp size={14} />;
      case "impact":
        return <Sparkles size={14} />;
      default:
        return <Sparkles size={14} />;
    }
  };

  // Transform data for charts
  const getCategoryData = () => {
    if (!insights?.insights?.category_distribution) return [];
    
    return Object.entries(insights.insights.category_distribution).map(([category, percentage], index) => {
      const colors = ["#10b981", "#fbbf24", "#22c55e", "#1f2937", "#8b5cf6", "#ef4444"];
      return {
        name: category,
        value: percentage,
        color: colors[index % colors.length]
      };
    });
  };

  const getMonthlyData = () => {
    if (!insights?.insights?.monthly_trends) return [];
    
    return insights.insights.monthly_trends.map(trend => ({
      month: trend.month.split('-')[1], // Get month number
      amount: trend.total_donated,
      donations: trend.donation_count
    }));
  };

  const getRecommendations = () => {
    if (!insights?.insights?.recommended_projects) return [];
    
    return insights.insights.recommended_projects.map((project, index) => ({
      id: project.id,
      title: project.title,
      reason: project.reason || "Recommended for you",
      reasonIcon: index === 0 ? "similar" : index === 1 ? "trending" : "impact",
      raised: project.amount_raised || 0,
      goal: project.target_amount || 0,
      category: project.category,
      completion_percentage: project.completion_percentage || 0
    }));
  };

  // Custom tooltip for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const formatCurrency = (amount) => {
    return `₦${parseInt(amount).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="ai-insights-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          Loading AI insights...
        </div>
      </div>
    );
  }

  const categoryData = getCategoryData();
  const monthlyData = getMonthlyData();
  const recommendations = getRecommendations();

  return (
    <div className="ai-insights-page">
      <div className="insights-header">
        <div>
          <h1 className="insights-title">AI Insights</h1>
          <p className="insights-subtitle">Personalized recommendations and giving patterns</p>
        </div>
        <button
          className={`regenerate-button ${isRegenerating ? 'loading' : ''}`}
          onClick={handleRegenerate}
          disabled={isRegenerating}
        >
          <RefreshCw size={16} className={isRegenerating ? "spin" : ""} />
          Regenerate
        </button>
      </div>

      <div className="insights-stats">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Most Supported</span>
            <Heart size={18} className="stat-icon green" />
          </div>
          <h3 className="stat-value">
            {insights?.insights?.most_supported_category?.category || "None"}
          </h3>
          <p className="stat-description">
            {insights?.insights?.most_supported_category?.percentage || 0}% of donations
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Avg. Frequency</span>
            <TrendingUp size={18} className="stat-icon yellow" />
          </div>
          <h3 className="stat-value">
            {insights?.insights?.donation_frequency_trend?.average_monthly_donations || 0}x/month
          </h3>
          <p className="stat-description positive">
            {insights?.insights?.donation_frequency_trend?.trend === "increasing" ? "↑" : 
             insights?.insights?.donation_frequency_trend?.trend === "decreasing" ? "↓" : "→"}
            {insights?.insights?.donation_frequency_trend?.change_percentage || 0}% from last month
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Impact Score</span>
            <Sparkles size={18} className="stat-icon green" />
          </div>
          <h3 className="stat-value">
            {insights?.insights?.user_impact_score?.score || 0}/100
          </h3>
          <p className="stat-description">
            {insights?.insights?.user_impact_score?.level || "Beginner"} Level
          </p>
        </div>
      </div>

      <div className="insights-charts">
        <div className="chart-card">
          <div className="chart-header">
            <PieChart size={18} />
            <h3 className="chart-title">Donation by Category</h3>
          </div>
          <div className="pie-chart-container">
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="chart-legend">
                  {categoryData.map((entry, index) => (
                    <div key={`legend-${index}`} className="legend-item">
                      <span 
                        className="legend-color" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span>{entry.name}: {entry.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-data">
                <p>No category data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <BarChart3 size={18} />
            <h3 className="chart-title">Monthly Giving Trend</h3>
          </div>
          <div className="bar-chart-container">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `Month ${value}`}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`₦${parseInt(value).toLocaleString()}`, 'Amount']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data">
                <p>No monthly trend data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="recommendations-section">
        <div className="recommendations-header">
          <CircleDot size={18} className="green-icon" />
          <h3 className="recommendations-title">Recommended For You</h3>
        </div>
        <p className="recommendations-subtitle">
          {insights?.insights?.most_supported_category ? 
            `Because you supported ${insights.insights.most_supported_category.category} projects, you may like these:` :
            "Discover projects that match your interests:"}
        </p>

        <div className="recommendations-grid">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <div key={rec.id} className="recommendation-card">
                <div className="recommendation-header">
                  <h4 className="recommendation-title">{rec.title}</h4>
                  <span className="recommendation-category">{rec.category}</span>
                </div>
                <div className="recommendation-reason">
                  {getReasonIcon(rec.reasonIcon)}
                  <span>{rec.reason}</span>
                </div>
                <div className="recommendation-funding">
                  <div className="funding-amounts">
                    <span className="amount-raised">{formatCurrency(rec.raised)}</span>
                    <span className="amount-goal">of {formatCurrency(rec.goal)}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${rec.completion_percentage || Math.round((rec.raised / rec.goal) * 100)}%` }}
                    />
                  </div>
                </div>
                <button
                  className="quick-donate-button"
                  onClick={() => handleQuickDonate(rec.title)}
                >
                  <Heart size={16} />
                  Quick Donate
                </button>
              </div>
            ))
          ) : (
            <div className="no-recommendations">
              <p>No recommendations available yet. Start donating to get personalized suggestions!</p>
            </div>
          )}
        </div>
      </div>

      {/* User Comparison Section */}
      {userComparison && (
        <div className="comparison-section">
          <div className="comparison-header">
            <TrendingUp size={18} />
            <h3 className="comparison-title">How You Compare</h3>
          </div>
          <div className="comparison-stats">
            <div className="comparison-item">
              <span className="comparison-label">Your Avg Donation</span>
              <span className="comparison-value">
                {formatCurrency(userComparison.user_stats.average_donation)}
              </span>
              <span className={`comparison-difference ${
                userComparison.comparison.donation_size_vs_average > 0 ? 'positive' : 
                userComparison.comparison.donation_size_vs_average < 0 ? 'negative' : 'neutral'
              }`}>
                {userComparison.comparison.donation_size_vs_average > 0 ? '+' : ''}
                {userComparison.comparison.donation_size_vs_average}% vs platform average
              </span>
            </div>
            <div className="comparison-item">
              <span className="comparison-label">Platform Avg Donation</span>
              <span className="comparison-value">
                {formatCurrency(userComparison.platform_averages.average_donation)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;