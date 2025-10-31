import { useState, useEffect } from "react";
import {
  CheckCircle,
  Wallet,
  RefreshCw,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG, buildUrl } from "../../api/config";
import axios from "axios";
import "./Donations.css";

const currencies = [{ code: "HBAR", name: "Hedera HBAR", symbol: "ℏ" }];

const Donations = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("HBAR");
  const [donating, setDonating] = useState(false);
  const [view, setView] = useState("donate");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastDonation, setLastDonation] = useState(null);

  const walletAddress = "0xA3D...F98";
  const transactionFee = "~0.0001 HBAR";
  const network = "Hedera Mainnet";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = buildUrl(API_CONFIG.projects.list.url);
      console.log("Fetching projects:", apiUrl);

      const { data } = await axios({
        method: API_CONFIG.projects.list.method,
        url: apiUrl,
        timeout: 10000,
      });

      console.log("API response:", data);
      if (!data) {
        console.warn("Empty response");
        setProjects([]);
        return;
      }

      const transformed = transformProjectsData(data);
      console.log("Transformed:", transformed);
      setProjects(transformed);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const transformProjectsData = (apiData) => {
    if (!apiData) return [];

    let arr = [];
    if (Array.isArray(apiData)) arr = apiData;
    else if (apiData?.data && Array.isArray(apiData.data)) arr = apiData.data;
    else if (apiData?.results && Array.isArray(apiData.results)) arr = apiData.results;
    else if (apiData?.projects && Array.isArray(apiData.projects)) arr = apiData.projects;
    else {
      console.warn("Unknown structure:", apiData);
      return [];
    }

    return arr.map((p, i) => ({
      id: p.id || p._id || `project-${i}`,
      name: p.title || p.name || "Untitled Project",
      description: p.description || p.summary || "No description",
      category: p.category || p.type || p.tags?.[0] || "General",
      verified: Boolean(p.verified || p.is_verified || p.verified_status),
    }));
  };

  const handleDonate = async () => {
    if (!selectedProject) return toast.error("Select a project");
    if (!amount || Number(amount) <= 0) return toast.error("Enter valid amount");

    setDonating(true);
    try {
      const proj = projects.find((p) => p.name === selectedProject);
      if (!proj) return toast.error("Project not found");

      const response = await axios({
        method: API_CONFIG.donations.make.method,
        url: buildUrl(API_CONFIG.donations.make.url),
        data: { project_id: proj.id, amount: Number(amount), currency: selectedCurrency },
        timeout: 15000,
      });

      // Store donation details for success modal
      setLastDonation({
        project: selectedProject,
        amount: amount,
        currency: selectedCurrency,
        symbol: getCurrencySymbol()
      });

      // Show success modal
      setShowSuccessModal(true);

      // Also show toast
      toast.success("Donation Successful!", {
        description: `Thank you for your generous donation to ${selectedProject}!`,
        duration: 5000,
      });

      // Reset form
      setSelectedProject("");
      setAmount("");
      
    } catch (err) {
      console.error("Donation error:", err);
      toast.error("Donation Failed", {
        description: err.response?.data?.message || "There was an error processing your donation",
        duration: 5000,
      });
    } finally {
      setDonating(false);
    }
  };

  const getCurrencySymbol = () => {
    const c = currencies.find((c) => c.code === selectedCurrency);
    return c?.symbol ?? "ℏ";
  };

  const selectedProj = projects.find((p) => p.name === selectedProject);

  // Donation History View Component
  const DonationHistoryView = () => {
    const [donationHistory, setDonationHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState(null);

    useEffect(() => {
      fetchDonationHistory();
    }, []);

    const fetchDonationHistory = async () => {
      try {
        setHistoryLoading(true);
        setHistoryError(null);
        
        // Add safety check for the API config
        if (!API_CONFIG.donations?.history?.url) {
          throw new Error("Donation history endpoint not configured");
        }
        
        const apiUrl = buildUrl(API_CONFIG.donations.history.url);
        console.log("Fetching donation history:", apiUrl);

        const { data } = await axios({
          method: API_CONFIG.donations.history.method,
          url: apiUrl,
          timeout: 10000,
        });

        console.log("Donation history response:", data);
        
        // Transform the API response to match our expected format
        const transformedHistory = transformDonationHistoryData(data);
        setDonationHistory(transformedHistory);
      } catch (err) {
        console.error("Donation history fetch error:", err);
        const errorMessage = err.message || "Failed to load donation history";
        setHistoryError(errorMessage);
        toast.error(errorMessage);
        setDonationHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    const transformDonationHistoryData = (apiData) => {
      if (!apiData) return [];

      let arr = [];
      if (Array.isArray(apiData)) arr = apiData;
      else if (apiData?.data && Array.isArray(apiData.data)) arr = apiData.data;
      else if (apiData?.donations && Array.isArray(apiData.donations)) arr = apiData.donations;
      else if (apiData?.results && Array.isArray(apiData.results)) arr = apiData.results;
      else {
        console.warn("Unknown donation history structure:", apiData);
        return [];
      }

      return arr.map((donation, i) => ({
        id: donation.id || donation._id || `donation-${i}`,
        project_name: donation.project_name || donation.project?.name || donation.project_id || "Unknown Project",
        amount: donation.amount || 0,
        currency: donation.currency || "HBAR",
        status: donation.status || "confirmed",
        created_at: donation.created_at || donation.date || new Date().toISOString(),
        transaction_id: donation.transaction_id || donation.tx_hash || `tx-${i}`
      }));
    };

    if (historyLoading) {
      return (
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading donation history...</p>
        </div>
      );
    }

    if (historyError && donationHistory.length === 0) {
      return (
        <div className="error-message">
          <h3>Error</h3>
          <p>{historyError}</p>
          <button onClick={fetchDonationHistory} className="retry-button">
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div className="donation-history-view">
        <div className="donations-header">
          <div>
            <h1 className="donations-title">My Donations</h1>
            <p className="donations-subtitle">Track and manage all your contributions</p>
          </div>
          <button 
            className="make-donation-button" 
            onClick={() => setView("donate")}
          >
            Make New Donation
          </button>
        </div>

        {donationHistory.length === 0 ? (
          <div className="empty-state">
            <p>No donation history found</p>
            <button 
              className="make-donation-button" 
              onClick={() => setView("donate")}
            >
              Make Your First Donation
            </button>
          </div>
        ) : (
          <div className="donations-table-wrapper">
            <table className="donations-history-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {donationHistory.map((donation) => (
                  <tr key={donation.id}>
                    <td className="project-name-cell">{donation.project_name}</td>
                    <td className="amount-cell">
                      {getCurrencySymbol()}{donation.amount}
                    </td>
                    <td className="currency-cell">{donation.currency}</td>
                    <td className="date-cell">
                      {new Date(donation.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>
                      <span className={`status-badge ${donation.status.toLowerCase()}`}>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </td>
                    <td className="transaction-cell">
                      {donation.transaction_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  if (view === "history") {
    return <DonationHistoryView />;
  }

  if (loading) {
    return (
      <div className="donations-page">
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="donations-page">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={fetchProjects} className="retry-button">
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donations-page">
      <div className="donations-header">
        <div>
          <h1 className="donations-title">Make a Donation</h1>
          <p className="donations-subtitle">
            Support verified social impact projects on Hedera
          </p>
        </div>
        <button 
          className="view-donations-button" 
          onClick={() => setView("history")}
        >
          <Eye size={16} />
          View My Donations
        </button>
      </div>

      <div className="donations-content">
        {/* Project Details */}
        <div className="project-details-card">
          <div className="card-header">
            <h2 className="card-title">Project Details</h2>
            {selectedProj?.verified && (
              <span className="verified-badge">
                <CheckCircle size={14} />
                Verified
              </span>
            )}
          </div>
          <div className="project-placeholder">
            {selectedProject ? (
              <div className="project-info">
                <h3 className="project-name">{selectedProject}</h3>
                <p className="project-category">{selectedProj?.category}</p>
                <p className="project-description">{selectedProj?.description}</p>
              </div>
            ) : (
              <p>Select a project to see details</p>
            )}
          </div>
        </div>

        {/* Donation Form */}
        <div className="donation-details-card">
          <div className="card-header">
            <h2 className="card-title">Donation Details</h2>
          </div>
          <p className="blockchain-note">
            All transactions are recorded on Hedera blockchain
          </p>

          <div className="donation-form">
            {/* Project Select */}
            <div className="form-field">
              <label htmlFor="project" className="form-label">Select Project</label>
              <div className="custom-select">
                <select
                  id="project"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="select-trigger"
                  disabled={projects.length === 0}
                >
                  <option value="">Choose a project to support</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} {p.verified && "(Verified)"}
                    </option>
                  ))}
                </select>
              </div>
              {projects.length === 0 && (
                <p className="no-projects-note">No projects available</p>
              )}
            </div>

            {/* Amount + Currency */}
            <div className="amount-section">
              <div className="form-field amount-input-field">
                <label htmlFor="amount" className="form-label">Donation Amount</label>
                <div className="amount-input-container">
                  <span className="currency-symbol">{getCurrencySymbol()}</span>
                  <input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="custom-input amount-input"
                    min="0"
                    step="0.01"
                    disabled={!selectedProject || donating}
                  />
                </div>
              </div>

              <div className="form-field currency-field">
                <label htmlFor="currency" className="form-label">Currency</label>
                <div className="custom-select">
                  <select
                    id="currency"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="select-trigger"
                    disabled={donating}
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="transaction-info">
              <div className="info-row">
                <span className="info-label">Network</span>
                <span className="info-value">{network}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Transaction Fee</span>
                <span className="info-value">{transactionFee}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Wallet</span>
                <span className="info-value">{walletAddress}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Selected Currency</span>
                <span className="info-value">
                  {selectedCurrency} ({getCurrencySymbol()})
                </span>
              </div>
            </div>

            <button
              className="donate-button"
              onClick={handleDonate}
              disabled={!selectedProject || !amount || Number(amount) <= 0 || donating}
            >
              <Wallet size={18} />
              {donating ? "Processing..." : "Donate via Hedera"}
            </button>

            {donating && (
              <div className="donating-spinner">
                <div className="spinner small" />
                <p>Processing on Hedera...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && lastDonation && (
        <div className="dialog-overlay">
          <div className="success-donation-dialog">
            <div className="dialog-header success">
              <div className="success-icon">🎉</div>
              <h3 className="dialog-title">Donation Successful!</h3>
              <p className="dialog-description">
                Thank you for your generous contribution to {lastDonation.project}
              </p>
            </div>
            
            <div className="confirmation-details">
              <div className="confirmation-row">
                <span className="confirmation-label">Project:</span>
                <span className="confirmation-value">{lastDonation.project}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-label">Amount:</span>
                <span className="confirmation-value">{lastDonation.symbol}{lastDonation.amount} {lastDonation.currency}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-label">Status:</span>
                <span className="confirmation-value success-status">Confirmed</span>
              </div>
            </div>

            <div className="dialog-actions">
              <button 
                className="view-history-button" 
                onClick={() => {
                  setShowSuccessModal(false);
                  setView("history");
                }}
              >
                View Donation History
              </button>
              <button 
                className="close-button" 
                onClick={() => setShowSuccessModal(false)}
              >
                Make Another Donation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations;