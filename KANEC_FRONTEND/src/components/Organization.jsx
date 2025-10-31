import React from 'react';
import './Organization.css';

const Organization = () => {
  const organizations = [
    'UNICEF',
    'Red Cross',
    'WHO',
    'UNESCO',
    'UNDP',
    'World Bank',
    'Gates Foundation',
    'Hedera'
  ];

  return (
    <div className="trusted-container">
      <p className="trusted-title">Trusted by leading organizations</p>
      <div className="org-list">
        {organizations.map((org, index) => (
          <span key={index} className="org-item">{org}</span>
        ))}
      </div>
    </div>
  );
};

export default Organization;