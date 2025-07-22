// src/components/pages/DirectorDashboard/components/OverviewTab.tsx
// Overview Tab Component - System status and recent activities

import React from 'react';

const OverviewTab: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Title */}
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '500', 
        color: '#111827', 
        margin: 0 
      }}>
        System Overview
      </h3>

      {/* Overview Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* Recent Activities Card */}
        <div style={{
          backgroundColor: '#F9FAFB',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: 'var(--akwa-green)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem'
            }}>
              <span style={{ color: 'white', fontSize: '1rem' }}>📋</span>
            </div>
            <h4 style={{ 
              fontWeight: '500', 
              color: '#111827', 
              margin: 0,
              fontSize: '1rem'
            }}>
              Recent Activities
            </h4>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6B7280', 
              margin: '0 0 1rem 0',
              lineHeight: '1.5'
            }}>
              Track user management and system activities in real-time.
            </p>
            
            {/* Sample Activity Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#374151' }}>New user approval pending</span>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>2 hours ago</span>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#374151' }}>Staff database updated</span>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>1 day ago</span>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#374151' }}>System backup completed</span>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>2 days ago</span>
                </div>
              </div>
            </div>
          </div>

          <button style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: 'var(--akwa-green)',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>
            View All Activities
          </button>
        </div>

        {/* System Status Card */}
        <div style={{
          backgroundColor: '#F9FAFB',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: 'var(--akwa-orange)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem'
            }}>
              <span style={{ color: 'white', fontSize: '1rem' }}>⚡</span>
            </div>
            <h4 style={{ 
              fontWeight: '500', 
              color: '#111827', 
              margin: 0,
              fontSize: '1rem'
            }}>
              System Status
            </h4>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '0.75rem',
                height: '0.75rem',
                backgroundColor: '#10B981',
                borderRadius: '50%',
                marginRight: '0.5rem'
              }} />
              <span style={{ 
                fontSize: '1rem', 
                color: 'var(--akwa-green)', 
                fontWeight: '500' 
              }}>
                All systems operational
              </span>
            </div>
            
            {/* System Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#374151' }}>Database Connection</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: '#10B981',
                    backgroundColor: '#DCFCE7',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px',
                    fontWeight: '500'
                  }}>
                    Online
                  </span>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#374151' }}>API Response Time</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: '#10B981',
                    backgroundColor: '#DCFCE7',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px',
                    fontWeight: '500'
                  }}>
                    Fast
                  </span>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#374151' }}>Last Backup</span>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>2 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          <button style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: 'var(--akwa-orange)',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>
            System Settings
          </button>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h4 style={{ 
          fontWeight: '500', 
          color: '#111827', 
          margin: '0 0 1rem 0',
          fontSize: '1rem'
        }}>
          Quick Actions
        </h4>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <button style={{
            padding: '1rem',
            backgroundColor: '#F0FDF4',
            border: '1px solid var(--akwa-green)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</div>
            <div style={{ fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>Manage Users</div>
            <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Create and approve user accounts</div>
          </button>
          
          <button style={{
            padding: '1rem',
            backgroundColor: '#FFF7ED',
            border: '1px solid var(--akwa-orange)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
            <div style={{ fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>View Reports</div>
            <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Generate staff and system reports</div>
          </button>
          
          <button style={{
            padding: '1rem',
            backgroundColor: '#F0F9FF',
            border: '1px solid #3B82F6',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚙️</div>
            <div style={{ fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>System Settings</div>
            <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Configure system preferences</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;