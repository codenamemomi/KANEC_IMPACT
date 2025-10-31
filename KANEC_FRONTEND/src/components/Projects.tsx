import "./Projects.css";

const Projects = () => {
  return (
    <section className="projects" id="projects">
      <div className="projects-container">
        <div className="projects-header">
          <h2>
            Choose Your <span className="highlight">Verified</span> Community Project
          </h2>
          <p>
            We've selected verified deep networks of specialized community facilities driving real change.
          </p>
        </div>

        <div className="project-card">
          <div className="project-card-content">
            <h3>Clean Water Projects</h3>
            <p>
              Access our network of verified water initiatives to make your impact and drive your community forward. Whether you're looking to fund your next well or support existing facilities, our projects are easy to find – we support a wide range of areas.
            </p>
            <div className="project-badges">
              <span className="project-badge">Immediate Impact</span>
              <span className="project-badge">Verified</span>
              <span className="project-badge">Blockchain</span>
            </div>
            <div className="project-amount">
              <h4>$85,000</h4>
              <p>raised of $100,000</p>
            </div>
            <div className="project-stats">
              <div className="project-stat">
                <strong>1,842</strong>
                <span>donors</span>
              </div>
              <div className="project-stat">
                <strong>12</strong>
                <span>countries</span>
              </div>
              <div className="project-stat">
                <strong>45</strong>
                <span>villages impacted</span>
              </div>
            </div>
          </div>

          {/* ✅ Image embedded directly here */}
          <div className="project-card-image">
            <img
              src="https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=1200&q=80"
              alt="Clean Water Project"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
