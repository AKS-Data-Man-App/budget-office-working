// src/components/pages/DirectorDashboard/index.tsx
// Main Director Dashboard - Integrates all tab components

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { BarChart3, Users, CheckCircle, Database, Building2, FileText } from 'lucide-react';

// Import all our tab components
import OverviewTab from './components/OverviewTab';
import UsersTab from './components/UsersTab';
import ApprovalsTab from './components/ApprovalTabs';
import BudgetStaffTab from './components/BudgetStaffTab';
import GovernmentDatabaseTab from './components/GovernmentDatabaseTab';
import StatsCard from './components/StatsCard';
import Button from '../../common/Button';

// Import types from auth types (using existing types)
import { User } from '../../../types/auth.types';

type TabKey = 'overview' | 'users' | 'approvals' | 'budget-staff' | 'government-database';

const DirectorDashboard: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [showCreateUser, setShowCreateUser] = useState(false);

  // Load data on component mount
  useEffect(() => {
    if (!state.allUsers.length) {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Load real data from API or context
      setTimeout(() => {
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 1000);
    }
  }, []);

  // Get real pending users from allUsers
  const pendingUsers = state.allUsers.filter(user => 
    user.status === 'PENDING_APPROVAL' || user.status === 'APPROVED_PENDING_ACTIVATION'
  );

  // Tab configuration
  const tabs = [
    { key: 'overview' as TabKey, label: 'Overview', icon: BarChart3, color: 'var(--akwa-green)' },
    { key: 'users' as TabKey, label: 'Users', icon: Users, color: 'var(--akwa-orange)' },
    { key: 'approvals' as TabKey, label: 'Approvals', icon: CheckCircle, color: '#EF4444', badge: pendingUsers.length },
    { key: 'budget-staff' as TabKey, label: 'Budget Staff', icon: Building2, color: '#3B82F6' },
    { key: 'government-database' as TabKey, label: 'Government Database', icon: Database, color: '#8B5CF6' }
  ];

  // Mock data for demo (replace with actual API calls)
  const mockUsers: User[] = [
    { 
      id: '1', 
      firstName: 'John', 
      lastName: 'Doe', 
      username: 'john.doe', 
      email: 'john@budgetoffice.gov.ng', 
      role: 'STAFF', 
      status: 'ACTIVE',
      office: 'Budget Office',
      state: 'Akwa Ibom'
    },
    { 
      id: '2', 
      firstName: 'Jane', 
      lastName: 'Smith', 
      username: 'jane.smith', 
      email: 'jane@budgetoffice.gov.ng', 
      role: 'ICT_HEAD', 
      status: 'ACTIVE',
      office: 'Budget Office',
      state: 'Akwa Ibom'
    },
    { 
      id: '3', 
      firstName: 'Mike', 
      lastName: 'Johnson', 
      username: 'mike.johnson', 
      email: 'mike@budgetoffice.gov.ng', 
      role: 'STAFF', 
      status: 'PENDING_APPROVAL',
      office: 'Budget Office',
      state: 'Akwa Ibom'
    }
  ];

  // Event handlers
  const handleCreateUser = () => {
    setShowCreateUser(true);
    // TODO: Open create user modal
    console.log('Opening create user modal...');
  };

  const handleApproveUser = async (userId: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Find user and update status
      const updatedUsers = state.allUsers.map(user => 
        user.id === userId 
          ? { ...user, status: 'APPROVED_PENDING_ACTIVATION' as any }
          : user
      );
      
      dispatch({ type: 'SET_ALL_USERS', payload: updatedUsers });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      console.log('User approved:', userId);
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to approve user' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const handleRejectUser = async (userId: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Remove user from list (rejected users are removed)
      const updatedUsers = state.allUsers.filter(user => user.id !== userId);
      
      dispatch({ type: 'SET_ALL_USERS', payload: updatedUsers });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      console.log('User rejected and removed:', userId);
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to reject user' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  // Stats for overview cards
  const stats = {
    totalUsers: state.allUsers.length || mockUsers.length,
    activeUsers: state.allUsers.filter(u => u.status === 'ACTIVE').length || mockUsers.filter(u => u.status === 'ACTIVE').length,
    pendingApprovals: pendingUsers.length,
    budgetStaff: state.staffData?.length || 0,
    governmentDatabase: state.staffData?.length || 15420
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
        return (
          <ApprovalsTab
            pendingUsers={pendingUsers as any}
            onApprove={handleApproveUser}
            onReject={handleRejectUser}
            loading={state.isLoading}
          />
        );
      
      case 'budget-staff':
        return (
          <BudgetStaffTab
            staffData={state.staffData || []}
            loading={state.isLoading}
          />
        );
      
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
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '1rem 2rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0 0 0.25rem 0'
            }}>
              Director Dashboard
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0
            }}>
              Akwa Ibom State Budget Office Management System
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {state.user && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                  {state.user.firstName} {state.user.lastName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  Director
                </div>
              </div>
            )}
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                dispatch({ type: 'LOGOUT' });
                dispatch({ type: 'SET_PAGE', payload: 'login' });
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div style={{ padding: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
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
          />
          
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={<CheckCircle />}
            color="var(--akwa-orange)"
            onClick={() => setActiveTab('approvals')}
          />
          
          <StatsCard
            title="Budget Office Staff"
            value={stats.budgetStaff}
            icon={<Building2 />}
            color="#3B82F6"
            onClick={() => setActiveTab('budget-staff')}
          />
          
          <StatsCard
            title="Government Database"
            value={stats.governmentDatabase}
            icon={<Database />}
            color="#8B5CF6"
            subtitle="Total employees"
            onClick={() => setActiveTab('government-database')}
          />
        </div>

        {/* Tab Navigation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Tab Headers */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB'
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
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    backgroundColor: isActive ? 'white' : 'transparent',
                    borderBottom: isActive ? `3px solid ${tab.color}` : '3px solid transparent',
                    color: isActive ? tab.color : '#6B7280',
                    fontWeight: isActive ? '500' : '400',
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <Icon style={{ width: '1rem', height: '1rem' }} />
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <span style={{
                      backgroundColor: '#EF4444',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '9999px',
                      minWidth: '1.25rem',
                      height: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '2rem' }}>
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'white',
        borderTop: '1px solid #E5E7EB',
        padding: '1.5rem 2rem',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '0.875rem',
          color: '#6B7280',
          margin: 0
        }}>
          © 2025 Akwa Ibom State Budget Office. All rights reserved. • "The Land of Promise"
        </p>
      </footer>
    </div>
  );
};

export default DirectorDashboard;