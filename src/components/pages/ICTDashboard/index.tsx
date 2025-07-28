// src/components/pages/ICTDashboard/index.tsx
// ICT Head Dashboard - Clean Main Component

import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Database, Users, Settings } from 'lucide-react';
import Button from '../../common/Button';
import Modal from '../../common/Modal';

// Import components
import StatsCards from './components/StatsCards';
import GovernmentDatabaseTab from '../DirectorDashboard/components/GovernmentDatabaseTab';
import UserAccountsTab from './components/UserAccountsTab';
import SystemSettingsTab from './components/SystemSettingsTab';
import CreateStaffForm from '../DirectorDashboard/components/CreateStaffForm';

type TabKey = 'staff' | 'users' | 'settings';

const ICTDashboard: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabKey>('staff');
  const [showCreateStaff, setShowCreateStaff] = useState(false);

  // Ensure we have default values for stats
  const staffCount = state.staffData?.length || 0;
  const userCount = state.allUsers?.length || 0;

  // Tab configuration
  const tabs = [
    { key: 'staff' as TabKey, label: 'Government Database', icon: Database, color: 'var(--akwa-green)' },
    { key: 'users' as TabKey, label: 'User Accounts', icon: Users, color: 'var(--akwa-orange)' },
    { key: 'settings' as TabKey, label: 'System Settings', icon: Settings, color: '#8B5CF6' }
  ];

  // Handle staff creation
  const handleCreateStaff = async (staffData: any) => {
    try {
      console.log('Creating new staff:', staffData);
      // TODO: Call backend API
      alert('Staff member created successfully!');
      setShowCreateStaff(false);
    } catch (error) {
      console.error('Error creating staff:', error);
      alert('Failed to create staff member. Please try again.');
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'staff':
        return <GovernmentDatabaseTab />;
      case 'users':
        return <UserAccountsTab users={state.allUsers || []} />;
      case 'settings':
        return <SystemSettingsTab />;
      default:
        return <GovernmentDatabaseTab />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, var(--akwa-green) 0%, var(--akwa-orange) 100%)',
        color: 'white',
        padding: '2rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Element */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: '0 0 0.5rem 0',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                ICT Dashboard
              </h1>
              <p style={{ fontSize: '1.125rem', margin: 0, opacity: 0.9 }}>
                Database Management & Staff Administration
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {state.user && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {state.user.firstName} {state.user.lastName}
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                    ICT Administrator
                  </div>
                </div>
              )}
              
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  dispatch({ type: 'LOGOUT' });
                  dispatch({ type: 'SET_PAGE', payload: 'login' });
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                🚪 Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto' }}>
        {/* Stats Cards */}
        <div style={{ marginBottom: '2rem' }}>
          <StatsCards 
            staffCount={staffCount}
            userCount={userCount}
            onCreateStaff={() => setShowCreateStaff(true)}
          />
        </div>

        {/* Tab Navigation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}>
          {/* Tab Headers */}
          <div style={{
            display: 'flex',
            background: 'linear-gradient(90deg, #F8FAFC 0%, #F1F5F9 100%)',
            borderBottom: '1px solid #E2E8F0'
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1,
                    padding: '1.25rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    backgroundColor: isActive ? 'white' : 'transparent',
                    borderBottom: isActive ? `4px solid ${tab.color}` : '4px solid transparent',
                    color: isActive ? tab.color : '#64748B',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '0.925rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '2rem', minHeight: '500px', backgroundColor: 'white' }}>
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', opacity: 0.9 }}>
            © 2025 Akwa Ibom State Budget Office - ICT Administration
          </p>
          <p style={{ fontSize: '0.875rem', margin: 0, opacity: 0.7, fontStyle: 'italic' }}>
            "The Land of Promise" - Secure Database Management
          </p>
        </div>
      </footer>

      {/* Create Staff Modal */}
      <Modal
        isOpen={showCreateStaff}
        onClose={() => setShowCreateStaff(false)}
        title="Create New Government Staff Record"
        size="xl"
      >
        <CreateStaffForm
          onSubmit={handleCreateStaff}
          onCancel={() => setShowCreateStaff(false)}
        />
      </Modal>
    </div>
  );
};

export default ICTDashboard;