// src/components/pages/DirectorDashboard/index.tsx
// Main Director Dashboard - Fixed and Streamlined

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { BarChart3, Users, CheckCircle, Database, UserPlus } from 'lucide-react';

// Import components
import OverviewTab from './components/OverviewTab';
import UsersTab from './components/UsersTab';
import ApprovalsTab from './components/ApprovalTabs';
import GovernmentDatabaseTab from './components/GovernmentDatabaseTab';
import StatsCard from './components/StatsCard';
import Button from '../../common/Button';

// Import types
import { User } from '../../../types/auth.types';

type TabKey = 'overview' | 'users' | 'approvals' | 'government-database';

const DirectorDashboard: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Load pending users count for badge
  const loadPendingCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://budget-office-backend.onrender.com/api/v1/users/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setPendingCount((result.data || []).length);
      }
    } catch (error) {
      console.error('Failed to load pending count:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadPendingCount();
    // Refresh pending count every 30 seconds
    const interval = setInterval(loadPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Tab configuration - removed budget-staff tab
  const tabs = [
    { key: 'overview' as TabKey, label: 'Overview', icon: BarChart3, color: 'var(--akwa-green)' },
    { key: 'users' as TabKey, label: 'Users', icon: Users, color: 'var(--akwa-orange)' },
    { key: 'approvals' as TabKey, label: 'Approvals', icon: CheckCircle, color: '#EF4444', badge: pendingCount },
    { key: 'government-database' as TabKey, label: 'Government Database', icon: Database, color: '#8B5CF6' }
  ];

  // Mock data for users tab (if needed)
  const mockUsers: User[] = [
    { 
      id: '1', firstName: 'John', lastName: 'Doe', username: 'john.doe', 
      email: 'john@budgetoffice.gov.ng', role: 'STAFF', status: 'ACTIVE',
      office: 'Budget Office', state: 'Akwa Ibom'
    },
    { 
      id: '2', firstName: 'Jane', lastName: 'Smith', username: 'jane.smith', 
      email: 'jane@budgetoffice.gov.ng', role: 'ICT_HEAD', status: 'ACTIVE',
      office: 'Budget Office', state: 'Akwa Ibom'
    }
  ];

  // Event handlers
  const handleCreateUser = () => {
    setShowCreateUser(true);
    console.log('Opening create user modal...');
  };

  // Stats for overview cards
  const stats = {
    totalUsers: state.allUsers.length || mockUsers.length,
    activeUsers: state.allUsers.filter(u => u.status === 'ACTIVE').length || mockUsers.filter(u => u.status === 'ACTIVE').length,
    pendingApprovals: pendingCount,
    governmentDatabase: state.staffData?.length || 5
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      
      case 'users':
        return (
          <UsersTab
            users={(state.allUsers.length ? state.allUsers : mockUsers) as any}
            onCreateUser={handleCreateUser}
            loading={state.isLoading}
          />
        );
      
      case 'approvals':
        // ApprovalsTab is now self-contained, no props needed
        return <ApprovalsTab />;
      
      case 'government-database':
        return <GovernmentDatabaseTab />;
      
      default:
        return <OverviewTab />;
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
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: '0 0 0.5rem 0',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                Director Dashboard
              </h1>
              <p style={{ fontSize: '1.125rem', margin: 0, opacity: 0.9 }}>
                Akwa Ibom State Budget Office Management System
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {state.user && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {state.user.firstName} {state.user.lastName}
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Director</div>
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
      <div style={{ 
        padding: activeTab === 'government-database' ? '2rem 1rem' : '2rem', 
        maxWidth: activeTab === 'government-database' ? 'none' : '1280px', 
        margin: '0 auto' 
      }}>
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users />}
            color="var(--akwa-green)"
            trend={{ value: 12, isPositive: true, label: "this month" }}
            onClick={() => setActiveTab('users')}
            size="lg"
          />
          
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={<CheckCircle />}
            color="var(--akwa-orange)"
            subtitle="Awaiting review"
            onClick={() => setActiveTab('approvals')}
            size="lg"
          />
          
          <StatsCard
            title="Government Database"
            value={stats.governmentDatabase}
            icon={<Database />}
            color="#8B5CF6"
            subtitle="Total employees"
            trend={{ value: 5, isPositive: true, label: "new hires" }}
            onClick={() => setActiveTab('government-database')}
            size="lg"
          />
          
          <StatsCard
            title="Quick Actions"
            value=""
            icon={<UserPlus />}
            color="#3B82F6"
            subtitle="System management"
            onClick={() => setActiveTab('users')}
            size="lg"
          />
        </div>

        {/* Tab Navigation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          width: activeTab === 'government-database' ? '100%' : 'auto'
        }}>
          {/* Tab Headers */}
          <div style={{
            display: 'flex',
            background: 'linear-gradient(90deg, #F8FAFC 0%, #F1F5F9 100%)',
            borderBottom: '1px solid #E2E8F0',
            overflowX: 'auto'
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: activeTab === 'government-database' ? '0 0 auto' : '1',
                    minWidth: activeTab === 'government-database' ? '200px' : 'auto',
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
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: isActive ? '0 -2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.color = tab.color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#64748B';
                    }
                  }}
                >
                  <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <span style={{
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      minWidth: '1.5rem',
                      height: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
                      animation: 'pulse 2s infinite'
                    }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div style={{ 
            padding: activeTab === 'government-database' ? '1.5rem 0.5rem' : '2.5rem',
            minHeight: '500px',
            backgroundColor: 'white',
            overflowX: activeTab === 'government-database' ? 'auto' : 'visible'
          }}>
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
            © 2025 Akwa Ibom State Budget Office. All rights reserved.
          </p>
          <p style={{ fontSize: '0.875rem', margin: 0, opacity: 0.7, fontStyle: 'italic' }}>
            "The Land of Promise" - Secure • Efficient • Transparent
          </p>
        </div>
      </footer>

      {/* Animation Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .7; }
        }
      `}</style>
    </div>
  );
};

export default DirectorDashboard;