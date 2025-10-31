import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  CheckCircle,
  TrendingUp,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';
import { API_CONFIG, API_BASE_URL } from '../../api/config';
import axios from 'axios';
import './Projects.css';

const ProjectsPage = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // MODAL STATE
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = `${API_BASE_URL}${API_CONFIG.projects.list.url}`;
      const response = await axios({
        method: API_CONFIG.projects.list.method,
        url: apiUrl,
        timeout: 10000,
      });
      const transformed = transformProjectsData(response.data);
      setProjects(transformed);
    } catch (err) {
      setError(`Failed to load projects: ${err.message}`);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // FETCH SINGLE PROJECT DETAILS
  const fetchProjectDetails = async (projectId) => {
    try {
      setModalLoading(true);
      setModalError(null);
      const response = await axios.get(`${API_BASE_URL}/api/v1/projects/${projectId}`);
      setSelectedProject(response.data);
    } catch (err) {
      setModalError(`Failed to load project: ${err.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  const openModal = (projectId) => {
    fetchProjectDetails(projectId);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setModalError(null);
  };

  const goToDonate = () => {
    if (selectedProject?.id) {
      navigate(`/dashboard/donate?project=${selectedProject.id}`);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const transformProjectsData = (apiData) => {
    if (!apiData) return [];
    let projectsArray = [];
    if (Array.isArray(apiData)) {
      projectsArray = apiData;
    } else if (apiData.data && Array.isArray(apiData.data)) {
      projectsArray = apiData.data;
    } else if (apiData.results && Array.isArray(apiData.results)) {
      projectsArray = apiData.results;
    } else if (apiData.projects && Array.isArray(apiData.projects)) {
      projectsArray = apiData.projects;
    } else {
      console.warn('Unknown API response structure:', apiData);
      return [];
    }

    return projectsArray.map((project, idx) => {
      const projectId = project.id || project._id;
      let imageUrl = '/placeholder-image.jpg';

      if (project.image) {
        if (project.image.startsWith('/')) {
          if (project.image.startsWith('/api/v1/')) {
            imageUrl = `${API_BASE_URL}${project.image}`;
          } else {
            imageUrl = `${API_BASE_URL}/api/v1${project.image}`;
          }
        } else if (project.image.startsWith('http')) {
          imageUrl = project.image;
        }
      } else if (projectId) {
        imageUrl = `${API_BASE_URL}/api/v1/projects/${projectId}/image`;
      }

      return {
        id: projectId || `project-${idx}`,
        title: project.title || project.name || 'Untitled Project',
        description: project.description || project.summary || 'No description available',
        category: project.category || project.type || project.tags?.[0] || 'General',
        image: imageUrl,
        raised: Number(project.amount_raised) || Number(project.raised) || 0,
        goal: Number(project.target_amount) || Number(project.goal) || 1000,
        location: project.location || project.country || project.region || 'Africa',
        verified: Boolean(project.verified || project.is_verified || true),
        trending: Boolean(project.backers_count > 10 || project.trending || false),
        new: Boolean(
          project.created_at &&
          new Date(project.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ),
        backers_count: project.backers_count || 0,
        wallet_address: project.wallet_address || '',
        created_at: project.created_at || new Date().toISOString(),
        updated_at: project.updated_at || new Date().toISOString(),
      };
    });
  };

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'verified' && project.verified) ||
      (statusFilter === 'trending' && project.trending) ||
      (statusFilter === 'new' && project.new);
    return matchesCategory && matchesStatus;
  });

  const calculateProgress = (raised, goal) => Math.min(Math.round((raised / goal) * 100), 100);
  const categories = ['all', ...new Set(projects.map((p) => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="projects-page">
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-page">
        <div className="error-message">
          <h3>Error Loading Projects</h3>
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
    <div className="projects-page">
      <div className="projects-header">
        <h1 className="projects-title">Projects</h1>
        <p className="projects-subtitle">
          Discover and support verified social impact projects
        </p>
      </div>

      <div className="projects-filters">
        <div className="filter-left">
          <span className="filter-label">Filter by:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories
              .filter((c) => c !== 'all')
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
        </div>
        <div className="filter-right">
          <button
            className={`status-badge verified ${statusFilter === 'verified' ? 'active' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'verified' ? 'all' : 'verified')}
          >
            <CheckCircle size={14} />
            Verified
          </button>
          <button
            className={`status-badge trending ${statusFilter === 'trending' ? 'active' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'trending' ? 'all' : 'trending')}
          >
            <TrendingUp size={14} />
            Trending
          </button>
          <button
            className={`status-badge new ${statusFilter === 'new' ? 'active' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'new' ? 'all' : 'new')}
          >
            <Sparkles size={14} />
            New
          </button>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Sparkles size={48} />
            </div>
            <h3>No Projects Found</h3>
            <p>
              {projects.length === 0
                ? 'There are no projects in the system yet. Check back later for new projects!'
                : 'No projects match your current filters. Try adjusting your criteria.'}
            </p>
            <button onClick={fetchProjects} className="retry-button">
              <RefreshCw size={16} />
              Refresh Projects
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image-container">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                {project.verified && (
                  <div className="verified-badge">
                    <CheckCircle size={18} />
                  </div>
                )}
                {project.trending && (
                  <div className="trending-badge">
                    <TrendingUp size={18} />
                  </div>
                )}
                {project.new && (
                  <div className="new-badge">
                    <Sparkles size={18} />
                  </div>
                )}
              </div>
             <div className="project-card-content">
  <h3 className="project-card-title">{project.title}</h3>
  <p className="project-card-description">{project.description}</p>
  <div className="project-meta">
    <div className="project-location">
      <MapPin size={14} />
      <span>{project.location}</span>
    </div>
    <span className="project-category-badge">{project.category}</span>
  </div>
  <div className="project-funding">
    <div className="funding-amounts">
      <span className="amount-raised">₦{project.raised.toLocaleString()}</span>
      <span className="amount-goal">of ₦{project.goal.toLocaleString()}</span>
    </div>
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{
          width: `${calculateProgress(project.raised, project.goal)}%`,
        }}
      />
    </div>
    <div className="progress-percentage">
      {calculateProgress(project.raised, project.goal)}% funded
    </div>
  </div>

  {/* NEW: Direct Donate Button */}
  <button
    className="donate-btn"
    onClick={() => navigate(`/dashboard/donations`)}
  >
    Donate Now
  </button>
</div>
            </div>
          ))
        )}
      </div>  
    </div>
  );
};

export default ProjectsPage;