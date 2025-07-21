// src/components/pages/LoginPage.tsx
// Beautiful Login page using same styling techniques as HomePage

import React from 'react';
import SignInForm from '../auth/SignInForm';

const LoginPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 50%, #F0FDF4 100%)' }}>
      {/* Header matching homepage style */}
      <header className="akwa-header">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <h1 className="header-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              Staff Access Portal
            </h1>
            <p className="header-subtitle" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
              Akwa Ibom State Budget Office • Database Management System
            </p>
          </div>
        </div>
      </header>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '3rem 1rem',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <div style={{ maxWidth: '28rem', width: '100%' }}>
          {/* Main Login Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            border: '1px solid #F3F4F6'
          }}>
            {/* Card Header with Logo */}
            <div style={{
              background: 'linear-gradient(135deg, var(--akwa-green) 0%, var(--akwa-orange) 100%)',
              padding: '2rem',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{
                width: '5rem',
                height: '5rem',
                margin: '0 auto 1rem auto',
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <img 
                  src="/src/assets/images/akwa-ibom-state-logo.jpg" 
                  alt="Akwa Ibom State Logo" 
                  style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = target.nextElementSibling as HTMLElement;
                    target.style.display = 'none';
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: '#F0FDF4',
                  borderRadius: '50%',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--akwa-green)',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}>
                  AK
                </div>
              </div>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>
                Budget Office
              </h2>
              <p style={{
                fontSize: '0.875rem',
                opacity: 0.8
              }}>
                Enter your credentials to access the system
              </p>
            </div>

            {/* Card Body */}
            <div style={{ padding: '2rem' }}>
              <SignInForm />
            </div>

            {/* Card Footer with Account Info */}
            <div style={{
              background: 'linear-gradient(135deg, #F9FAFB 0%, #FFF7ED 100%)',
              padding: '1.5rem',
              borderTop: '1px solid #E5E7EB'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  Government Access Portal
                </h3>
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    marginBottom: '0.5rem',
                    fontSize: '0.75rem'
                  }}>
                    <span style={{ fontWeight: '500', color: 'var(--akwa-green)' }}>Director:</span>
                    <span style={{ color: '#6B7280' }}>director@aksgov.ng</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontSize: '0.75rem'
                  }}>
                    <span style={{ fontWeight: '500', color: 'var(--akwa-orange)' }}>ICT Head:</span>
                    <span style={{ color: '#6B7280' }}>ict@aksgov.ng</span>
                  </div>
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontStyle: 'italic',
                  marginTop: '0.75rem'
                }}>
                  Contact your administrator for access credentials
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div style={{ marginTop: '2rem' }}>
            {/* Services Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              borderLeft: '4px solid var(--akwa-green)',
              marginBottom: '1rem'
            }}>
              <h4 style={{
                fontWeight: '600',
                color: '#1F2937',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  backgroundColor: '#F0FDF4',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.5rem'
                }}>
                  <span style={{ color: 'var(--akwa-green)', fontSize: '0.75rem' }}>📊</span>
                </div>
                Budget Office Services
              </h4>
              <ul style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                lineHeight: '1.4',
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '0.25rem' }}>• State Budget Planning & Analysis</li>
                <li style={{ marginBottom: '0.25rem' }}>• Financial Resource Allocation</li>
                <li style={{ marginBottom: '0.25rem' }}>• Budget Implementation Monitoring</li>
                <li style={{ marginBottom: '0.25rem' }}>• Staff Database Management</li>
                <li>• Performance Tracking & Reporting</li>
              </ul>
            </div>

            {/* Security Notice */}
            <div style={{
              background: 'linear-gradient(135deg, #FFF7ED 0%, #F0FDF4 100%)',
              borderRadius: '0.75rem',
              padding: '1rem',
              border: '1px solid #FED7AA'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: '#FFF7ED',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem',
                  marginTop: '0.125rem'
                }}>
                  <span style={{ color: 'var(--akwa-orange)', fontSize: '0.875rem' }}>🔒</span>
                </div>
                <div>
                  <h5 style={{
                    fontWeight: '500',
                    color: '#1F2937',
                    fontSize: '0.875rem',
                    marginBottom: '0.25rem'
                  }}>
                    Secure Government Portal
                  </h5>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    lineHeight: '1.4',
                    margin: 0
                  }}>
                    This system is restricted to authorized government personnel only. 
                    All activities are monitored and logged for security purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer matching homepage */}
      <footer style={{
        background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
        color: 'white',
        padding: '1.5rem 0',
        marginTop: 'auto'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            © 2025 Akwa Ibom State Government - Budget Office Database Management System
          </p>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
            "The Land of Promise" - Secure • Efficient • Transparent
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '0.75rem',
            gap: '1rem',
            fontSize: '0.75rem',
            color: '#D1D5DB'
          }}>
            <span>🏛️ Government Portal</span>
            <span>•</span>
            <span>🔐 Secure Access</span>
            <span>•</span>
            <span>📊 Data Management</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;