// src/components/pages/HomePage.tsx

import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import akwaIbomLogo from '../../assets/images/akwa-ibom-state-logo.jpg';

const HomePage: React.FC = () => {
  const { selectedOffice, setSelectedOffice, setCurrentPage } = useAppContext();

  const handleEnterOffice = () => {
    if (selectedOffice) {
      setCurrentPage('budget-office');
    }
  };

  const offices = [
    { id: 'budget', name: 'Budget Office', status: 'active' },
    { id: 'finance', name: 'Finance Office', status: 'coming-soon' },
    { id: 'planning', name: 'Planning Office', status: 'coming-soon' },
    { id: 'audit', name: 'Audit Office', status: 'coming-soon' },
    { id: 'internal-affairs', name: 'Internal Affairs', status: 'coming-soon' },
    { id: 'public-works', name: 'Public Works', status: 'coming-soon' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Header */}
      <header className="akwa-header">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <h1 className="header-title">
              Digital Administration System (DAS)
            </h1>
            <p className="header-subtitle">
              Government Of Akwa Ibom State Of Nigeria
            </p>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <h2 className="sidebar-title">Ministries and Parastatals</h2>
          
          <nav>
            {offices.map((office) => (
              <button
                key={office.id}
                onClick={() => office.status === 'active' && setSelectedOffice(office.name)}
                className={`office-button ${
                  selectedOffice === office.name ? 'active' : ''
                } ${office.status !== 'active' ? 'disabled' : ''}`}
                disabled={office.status !== 'active'}
              >
                <div className="office-info">
                  <Building2 className="office-icon" />
                  <span className="office-name">{office.name}</span>
                </div>
                
                {office.status === 'active' && (
                  <div className="status-indicator"></div>
                )}
                {office.status === 'coming-soon' && (
                  <span className="coming-soon-badge">Coming Soon</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          
          {/* Selected Office Name */}
          {selectedOffice && (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 className="selected-office-title">{selectedOffice}</h2>
              <div className="title-underline"></div>
            </div>
          )}

          {/* Akwa Ibom State Logo - Using Actual Image */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="state-logo-image-container">
              <img 
              src={akwaIbomLogo} // Corrected path using imported image
              alt="Government of Akwa Ibom State - Official Seal"
              className="state-logo-image"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
              />
              
              {/* Fallback element if image doesn't load */}
              <div className="state-logo-fallback" style={{ display: 'none' }}>
              <div className="fallback-content">
                <div className="fallback-shield">
                <span style={{ fontSize: '3rem' }}>🛡️</span>
                </div>
                <div className="fallback-text">
                <div style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold', 
                  color: 'var(--akwa-green)',
                  marginBottom: '0.5rem'
                }}>
                  GOVERNMENT OF AKWA IBOM STATE
                </div>
                <div style={{ 
                  fontSize: '1rem', 
                  fontWeight: 'bold', 
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--akwa-green)',
                  color: 'white',
                  borderRadius: '1rem',
                  marginBottom: '0.5rem'
                }}>
                  THE LAND OF PROMISE
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold', 
                  color: 'var(--akwa-green)'
                }}>
                  NIGERIA
                </div>
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Enter Button */}
          {selectedOffice ? (
            <button onClick={handleEnterOffice} className="enter-button">
              <span>ENTER</span>
              <ArrowRight className="enter-arrow" />
            </button>
          ) : (
            <div className="office-selection-message">
              <Building2 className="message-icon" />
              <h3 className="message-title">Select an Office</h3>
              <p className="message-text">
                Please choose a government office from the sidebar to continue
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;