import { Download, Users, Wallet, CheckCircle, BarChart2, MapPin } from "lucide-react";
import { toast } from "sonner";
import "./Reports.css";

interface RegionData {
  name: string;
  projects: number;
  beneficiaries: number;
}

interface ProjectUpdate {
  id: number;
  title: string;
  description: string;
  image: string;
  timeAgo: string;
  verified: boolean;
}

const regionData: RegionData[] = [
  { name: "Nigeria", projects: 12, beneficiaries: 8500 },
  { name: "Kenya", projects: 8, beneficiaries: 6200 },
  { name: "Ghana", projects: 6, beneficiaries: 4100 },
  { name: "Uganda", projects: 5, beneficiaries: 3800 },
];

const projectUpdates: ProjectUpdate[] = [
  {
    id: 1,
    title: "Clean Water Nigeria",
    description: "Installed 12 new water pumps serving 2,000 families",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop",
    timeAgo: "2 days ago",
    verified: true,
  },
  {
    id: 2,
    title: "Solar Power for Schools",
    description: "Completed installation in 5 schools, powering 1,200 students",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
    timeAgo: "1 week ago",
    verified: true,
  },
  {
    id: 3,
    title: "Healthcare for Rural Women",
    description: "Mobile clinic reached 800 women this month",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    timeAgo: "1 week ago",
    verified: true,
  },
];

const Reports = () => {
  const handleDownloadReport = () => {
    toast.success("Downloading full impact report...");
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1 className="reports-title">Impact Reports</h1>
          <p className="reports-subtitle">Track real-world impact and transparency</p>
        </div>
        <button className="download-report-btn" onClick={handleDownloadReport}>
          <Download size={16} />
          Download Full Report
        </button>
      </div>

      <div className="reports-stats">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Beneficiaries</span>
            <Users size={18} className="stat-icon blue" />
          </div>
          <h3 className="stat-value">23,400</h3>
          <p className="stat-trend positive">↑7.5% this month</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Funds Disbursed</span>
            <Wallet size={18} className="stat-icon yellow" />
          </div>
          <h3 className="stat-value">₦3.2M</h3>
          <p className="stat-trend positive">↑12% this month</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Verified Transactions</span>
            <CheckCircle size={18} className="stat-icon green" />
          </div>
          <h3 className="stat-value">847</h3>
          <p className="stat-trend">+26% on-chain</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Active Projects</span>
            <BarChart2 size={18} className="stat-icon green" />
          </div>
          <h3 className="stat-value">31</h3>
          <p className="stat-trend positive">+3 new projects</p>
        </div>
      </div>

      <div className="impact-chart-section">
        <h3 className="section-title">Impact Over Time</h3>
        <div className="area-chart-container">
          <svg viewBox="0 0 800 300" className="area-chart">
            <defs>
              <linearGradient id="beneficiariesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="fundsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            <line x1="50" y1="50" x2="750" y2="50" stroke="var(--border)" strokeWidth="1" strokeDasharray="4" />
            <line x1="50" y1="100" x2="750" y2="100" stroke="var(--border)" strokeWidth="1" strokeDasharray="4" />
            <line x1="50" y1="150" x2="750" y2="150" stroke="var(--border)" strokeWidth="1" strokeDasharray="4" />
            <line x1="50" y1="200" x2="750" y2="200" stroke="var(--border)" strokeWidth="1" strokeDasharray="4" />
            <line x1="50" y1="250" x2="750" y2="250" stroke="var(--border)" strokeWidth="1" strokeDasharray="4" />
            
            {/* Y-axis labels */}
            <text x="30" y="55" fontSize="10" fill="var(--text-muted)">100000</text>
            <text x="30" y="105" fontSize="10" fill="var(--text-muted)">75000</text>
            <text x="30" y="155" fontSize="10" fill="var(--text-muted)">50000</text>
            <text x="30" y="205" fontSize="10" fill="var(--text-muted)">25000</text>
            <text x="30" y="255" fontSize="10" fill="var(--text-muted)">0</text>
            
            {/* X-axis labels */}
            <text x="90" y="275" fontSize="11" fill="var(--text-muted)">Aug</text>
            <text x="220" y="275" fontSize="11" fill="var(--text-muted)">Sep</text>
            <text x="350" y="275" fontSize="11" fill="var(--text-muted)">Oct</text>
            <text x="480" y="275" fontSize="11" fill="var(--text-muted)">Nov</text>
            <text x="610" y="275" fontSize="11" fill="var(--text-muted)">Dec</text>
            <text x="730" y="275" fontSize="11" fill="var(--text-muted)">Jan</text>
            
            {/* Beneficiaries Area */}
            <path
              d="M 50,150 L 150,140 L 250,130 L 350,125 L 450,110 L 550,95 L 650,75 L 750,50 L 750,250 L 50,250 Z"
              fill="url(#beneficiariesGradient)"
            />
            
            {/* Funds Area */}
            <path
              d="M 50,200 L 150,190 L 250,180 L 350,160 L 450,140 L 550,120 L 650,100 L 750,80 L 750,250 L 50,250 Z"
              fill="url(#fundsGradient)"
            />
            
            {/* Beneficiaries Line */}
            <path
              d="M 50,150 L 150,140 L 250,130 L 350,125 L 450,110 L 550,95 L 650,75 L 750,50"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
            />
            
            {/* Funds Line */}
            <path
              d="M 50,200 L 150,190 L 250,180 L 350,160 L 450,140 L 550,120 L 650,100 L 750,80"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            
            {/* Data points - Beneficiaries */}
            <circle cx="50" cy="150" r="4" fill="#fbbf24" />
            <circle cx="150" cy="140" r="4" fill="#fbbf24" />
            <circle cx="250" cy="130" r="4" fill="#fbbf24" />
            <circle cx="350" cy="125" r="4" fill="#fbbf24" />
            <circle cx="450" cy="110" r="4" fill="#fbbf24" />
            <circle cx="550" cy="95" r="4" fill="#fbbf24" />
            <circle cx="650" cy="75" r="4" fill="#fbbf24" />
            <circle cx="750" cy="50" r="4" fill="#fbbf24" />
            
            {/* Data points - Funds */}
            <circle cx="50" cy="200" r="4" fill="#3b82f6" />
            <circle cx="150" cy="190" r="4" fill="#3b82f6" />
            <circle cx="250" cy="180" r="4" fill="#3b82f6" />
            <circle cx="350" cy="160" r="4" fill="#3b82f6" />
            <circle cx="450" cy="140" r="4" fill="#3b82f6" />
            <circle cx="550" cy="120" r="4" fill="#3b82f6" />
            <circle cx="650" cy="100" r="4" fill="#3b82f6" />
            <circle cx="750" cy="80" r="4" fill="#3b82f6" />
          </svg>
          
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot beneficiaries"></span>
              <span>Beneficiaries</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot funds"></span>
              <span>Funds ₦</span>
            </div>
          </div>
        </div>
      </div>

      <div className="impact-region-section">
        <h3 className="section-title">Impact by Region</h3>
        <div className="region-list">
          {regionData.map((region) => (
            <div key={region.name} className="region-item">
              <div className="region-info">
                <MapPin size={16} className="region-icon" />
                <div>
                  <h4 className="region-name">{region.name}</h4>
                  <p className="region-projects">{region.projects} active projects</p>
                </div>
              </div>
              <div className="region-beneficiaries">
                <span className="beneficiaries-count">{region.beneficiaries.toLocaleString()}</span>
                <span className="beneficiaries-label">beneficiaries</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-updates-section">
        <h3 className="section-title">Recent Project Updates</h3>
        <div className="updates-list">
          {projectUpdates.map((update) => (
            <div key={update.id} className="update-card">
              <img src={update.image} alt={update.title} className="update-image" />
              <div className="update-content">
                <div className="update-header">
                  <h4 className="update-title">{update.title}</h4>
                  {update.verified && (
                    <span className="verified-badge">
                      <CheckCircle size={14} />
                      Verified
                    </span>
                  )}
                </div>
                <p className="update-description">{update.description}</p>
                <span className="update-time">{update.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;