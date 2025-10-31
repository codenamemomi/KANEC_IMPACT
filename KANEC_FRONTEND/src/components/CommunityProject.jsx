import React from 'react';
import './CommunityProject.css';

const CommunityProject = () => {
  return (
    <div className="page-containers">
      <header className="header-contents">
        <h1 className="main-titles">
          Choose Your <span className="verified-texts">Verified</span>
          <br />
          Community Project
        </h1>
        <p className="subtexts">
          Work smarter with deep network of verified, specialized community
          <br />
          initiatives driving real change.
        </p>
      </header>
      <div className="main-boards">
        <div className="text-sections">
          <h2 className="project-titles">Clean Water Projects</h2>
          <p className="project-descriptions">
            Access our network of verified water initiatives to<br/> scale your impact and drive your community forward.<br/>
            Whether you're looking to fund your next well or<br/>
            support overflow needs, our projects are well<br/> positioned to provide
            action-oriented solutions across<br/> a wide range of areas.
          </p>
          <div className="tag-groups">
            <span className="tag1">Sustainable Solutions</span>
            <span className="tag2">Impact</span>
            <span className="tag3">Verified</span>
          </div>
          <p className="funding-infos"> <span className='Bold-texts'>$85,000</span> raised of $100,000</p>
        </div>
        <div className="image-sections">
          <img
            src="/water.jpg" // Replace with actual image URL
            alt="Children at a water pump"
            className="project-images"
          />
        </div>
        <div className="inner-boards">
          <div className="stat-rows">
            <span className="stat-keys">Location</span>
            <span className="stat-values">Kenya</span>
          </div>
          <div className="stat-rows">
            <span className="stat-keys">Donors</span>
            <span className="stat-values">1240</span>
          </div>
          <div className="stat-rows">
            <span className="stat-keys">Impact</span>
            <span className="stat-values">15,000 people</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityProject;