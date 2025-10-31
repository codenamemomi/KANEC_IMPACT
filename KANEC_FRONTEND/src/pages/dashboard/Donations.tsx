import { useState, useEffect } from "react";
import {
  CheckCircle,
  Wallet,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG, buildUrl } from "../../api/config";
import axios from "axios";
import "./Donations.css";

const currencies = [{ code: "HBAR", name: "Hedera HBAR", symbol: "ℏ" }];

const Donations = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("HBAR");
  const [donating, setDonating] = useState(false);

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
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Failed to load projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const transformProjectsData = (apiData: any): any[] => {
    if (!apiData) return [];

    let arr: any[] = [];
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

      await axios({
        method: API_CONFIG.donations.make.method,
        url: buildUrl(API_CONFIG.donations.make.url),
        data: { project_id: proj.id, amount: Number(amount), currency: selectedCurrency },
        timeout: 15000,
      });

      toast.success(`${getCurrencySymbol()}${amount} ${selectedCurrency} donated!`);
      setSelectedProject("");
      setAmount("");
    } catch (err: any) {
      console.error("Donation error:", err);
      toast.error(err.response?.data?.message || "Donation failed");
    } finally {
      setDonating(false);
    }
  };

  const getCurrencySymbol = () => {
    const c = currencies.find((c) => c.code === selectedCurrency);
    return c?.symbol ?? "ℏ";
  };

  const selectedProj = projects.find((p) => p.name === selectedProject);

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
        <h1 className="donations-title">Make a Donation</h1>
        <p className="donations-subtitle">
          Support verified social impact projects on Hedera
        </p>
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
    </div>
  );
};

export default Donations;