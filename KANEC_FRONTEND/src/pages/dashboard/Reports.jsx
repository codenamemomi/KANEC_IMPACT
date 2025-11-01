import { useState, useEffect } from "react";
import { Download, Users, Wallet, CheckCircle, BarChart2, MapPin, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG, API_BASE_URL } from "../../api/config";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import "./Reports.css";

const Reports = () => {
  const { user } = useAuth();
  const [globalStats, setGlobalStats] = useState(null);
  const [platformOverview, setPlatformOverview] = useState(null);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all reports data in parallel
      const [globalStatsResponse, platformResponse, categoriesResponse] = await Promise.all([
        axios({
          method: API_CONFIG.analytics.globalStats.method,
          url: `${API_BASE_URL}${API_CONFIG.analytics.globalStats.url}`,
        }),
        axios({
          method: API_CONFIG.analytics.platformOverview.method,
          url: `${API_BASE_URL}${API_CONFIG.analytics.platformOverview.url}`,
        }),
        axios({
          method: API_CONFIG.analytics.topCategories.method,
          url: `${API_BASE_URL}${API_CONFIG.analytics.topCategories.url}`,
        })
      ]);

      setGlobalStats(globalStatsResponse.data);
      setPlatformOverview(platformResponse.data);
      setTopCategories(categoriesResponse.data.categories || []);

      console.log("Reports data loaded:", {
        globalStats: globalStatsResponse.data,
        platformOverview: platformResponse.data,
        topCategories: categoriesResponse.data.categories
      });

    } catch (error) {
      console.error("Error fetching reports data:", error);
      toast.error("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    toast.success("Downloading full impact report...");
    // In a real implementation, this would generate and download a PDF report
  };

  const formatCurrency = (amount) => {
    return `₦${parseInt(amount).toLocaleString()}`;
  };

  const formatCompactCurrency = (amount) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(1)}K`;
    }
    return `₦${parseInt(amount)}`;
  };

  if (loading) {
    return (
      <div className="reports-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          Loading impact reports...
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <p className="reports-subtitle">Track real-world impact and transparency</p>
        </div>
        {/* <button className="download-report-btn" onClick={handleDownloadReport}>
          <Download size={16} />
          Download Full Report
        </button> */}
      </div>

      {/* Real Stats from Backend */}
      <div className="reports-stats">
        {/* Replaced Total Beneficiaries with Average Donation */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Average Donation</span>
            <Users size={18} className="stat-icon blue" />
          </div>
          <h3 className="stat-value">
            {globalStats ? formatCompactCurrency(globalStats.average_donation) : "₦0"}
          </h3>
          <p className="stat-trend positive">
            <TrendingUp size={14} />
            {platformOverview?.recent_activity?.recent_donations ? `+${platformOverview.recent_activity.recent_donations} this week` : "Community support"}
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Funds Disbursed</span>
            <Wallet size={18} className="stat-icon yellow" />
          </div>
          <h3 className="stat-value">
            {globalStats ? formatCompactCurrency(globalStats.total_amount_raised) : "₦0"}
          </h3>
          <p className="stat-trend positive">
            <TrendingUp size={14} />
            {platformOverview?.top_categories?.[0] ? `${platformOverview.top_categories[0].category} leading` : "Loading..."}
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Verified Projects</span>
            <CheckCircle size={18} className="stat-icon green" />
          </div>
          <h3 className="stat-value">
            {globalStats?.total_projects || 0}
          </h3>
          <p className="stat-trend">
            {platformOverview?.recent_activity?.recent_projects ? `+${platformOverview.recent_activity.recent_projects} new` : "Active projects"}
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Active Donors</span>
            <BarChart2 size={18} className="stat-icon green" />
          </div>
          <h3 className="stat-value">
            {globalStats?.total_donors || 0}
          </h3>
          <p className="stat-trend positive">
            <TrendingUp size={14} />
            {globalStats ? `${globalStats.total_donations} donations` : "Community growing"}
          </p>
        </div>
      </div>

      {/* Funding by Category Table */}
      <div className="funding-table-section">
        <h3 className="section-title">Funding by Category</h3>
        <div className="funding-table-container">
          <table className="funding-table">
            <thead>
              <tr>
                <th className="table-header">Category</th>
                <th className="table-header text-right">Total Raised</th>
                <th className="table-header text-right">Projects</th>
                <th className="table-header text-right">Donations</th>
                <th className="table-header text-right">Avg Donation</th>
                <th className="table-header text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {platformOverview?.top_categories?.map((category, index) => (
                <tr key={category.category} className="table-row">
                  <td className="table-cell category-name">
                    <div className="category-info">
                      <span className="category-rank">#{index + 1}</span>
                      <span className="category-text">{category.category}</span>
                    </div>
                  </td>
                  <td className="table-cell text-right amount-cell">
                    <span className="amount-value">{formatCurrency(category.total_raised)}</span>
                  </td>
                  <td className="table-cell text-right">
                    <span className="project-count">{category.project_count}</span>
                  </td>
                  <td className="table-cell text-right">
                    <span className="donation-count">{category.donation_count}</span>
                  </td>
                  <td className="table-cell text-right">
                    <span className="avg-donation">{formatCompactCurrency(category.average_donation)}</span>
                  </td>
                  <td className="table-cell text-right">
                    <div className="percentage-container">
                      <span className="percentage-value">{category.percentage_of_total.toFixed(1)}%</span>
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill" 
                          style={{ width: `${category.percentage_of_total}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!platformOverview?.top_categories || platformOverview.top_categories.length === 0) && (
            <div className="no-data-message">
              <p>No category data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Impact by Region */}
      <div className="impact-region-section">
        <h3 className="section-title">Impact by Category</h3>
        <div className="region-list">
          {platformOverview?.top_categories?.slice(0, 6).map((category, index) => (
            <div key={category.category} className="region-item">
              <div className="region-info">
                <MapPin size={16} className="region-icon" />
                <div>
                  <h4 className="region-name">{category.category}</h4>
                  <p className="region-projects">{category.project_count} active projects</p>
                </div>
              </div>
              <div className="region-beneficiaries">
                <span className="beneficiaries-count">{formatCompactCurrency(category.total_raised)}</span>
                <span className="beneficiaries-label">raised</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Updates - Coming Soon */}
      <div className="recent-updates-section">
        <h3 className="section-title">Recent Impact Updates</h3>
        <div className="coming-soon-container">
          <div className="coming-soon-content">
            <CheckCircle size={48} className="coming-soon-icon" />
            <br />
            <h4 className="coming-soon-title">Live Updates Coming Soon</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;