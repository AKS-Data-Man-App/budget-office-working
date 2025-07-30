// src/App.tsx
// Role-Based Router for Akwa Ibom State Budget Office
// 3-Tier Authentication System: Director → ICT Head → Staff
// Updated with React Hot Toast Notifications and Password Reset

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useAppContext } from './context/AppContext';
import { UserRole } from './types/auth.types';

// Import page components
import LoginPage from './components/pages/LoginPage';
import HomePage from './components/pages/HomePage';
import DirectorDashboard from './components/pages/DirectorDashboard';
import ICTDashboard from './components/pages/ICTDashboard';
import StaffDashboard from './components/pages/StaffDashboard';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import LoadingSpinner from './components/common/LoadingSpinner';

// ===================================================================
// ROLE-BASED ROUTE GUARD
// ===================================================================

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback = <LoginPage /> 
}) => {
  const { state } = useAppContext();
  
  if (!state.isAuthenticated || !state.user) {
    return <>{fallback}</>;
  }
  
  if (!allowedRoles.includes(state.user.role)) {
    return <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
      <p className="text-gray-600">You don't have permission to access this page.</p>
    </div>;
  }
  
  return <>{children}</>;
};

// ===================================================================
// APP CONTENT WITH ROUTING
// ===================================================================

const AppContent: React.FC = () => {
  const { state } = useAppContext();

  // Show loading spinner during authentication check
  if (state.isLoading) {
    return <LoadingSpinner />;
  }

  // Render current page based on state
  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'home':
        return <HomePage />;
        
      case 'budget-office':
        // return <BudgetOfficePage />;
        
      case 'database':
        // return <DatabasePage />;
        
      case 'login':
        return <LoginPage />;

      case 'reset-password':
        return <ResetPasswordPage />;
      
      case 'director-dashboard':
        return (
          <RouteGuard allowedRoles={['ORGANIZATION_HEAD']}>
            <DirectorDashboard />
          </RouteGuard>
        );
      
      case 'ict-dashboard':
        return (
          <RouteGuard allowedRoles={['ICT_HEAD']}>
            <ICTDashboard />
          </RouteGuard>
        );
      
      case 'staff-dashboard':
        return (
          <RouteGuard allowedRoles={['STAFF']}>
            <StaffDashboard />
          </RouteGuard>
        );
      
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      {/* Global Error Display */}
      {state.error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{state.error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      {renderCurrentPage()}
      
      {/* Toast Notifications - Akwa Ibom Colors */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            fontSize: '14px',
            fontWeight: '500'
          },
          success: {
            style: {
              background: 'var(--akwa-green)',
              color: 'white'
            },
            iconTheme: {
              primary: 'white',
              secondary: 'var(--akwa-green)'
            }
          },
          error: {
            style: {
              background: '#EF4444',
              color: 'white'
            },
            iconTheme: {
              primary: 'white',
              secondary: '#EF4444'
            }
          },
          loading: {
            style: {
              background: 'var(--akwa-orange)',
              color: 'white'
            }
          }
        }}
      />
    </div>
  );
};

// ===================================================================
// MAIN APP COMPONENT
// ===================================================================

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

// ===================================================================
// USER INFO COMPONENT
// ===================================================================

const UserInfo: React.FC = () => {
  const { state, signOut } = useAppContext();
  
  if (!state.isAuthenticated || !state.user) {
    return null;
  }
  
  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'ORGANIZATION_HEAD':
        return 'Director';
      case 'ICT_HEAD':
        return 'ICT Administrator';
      case 'STAFF':
        return 'Staff Member';
      default:
        return role;
    }
  };
  
  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <p className="text-sm font-medium">
          {state.user.firstName} {state.user.lastName}
        </p>
        <p className="text-xs opacity-75">
          {getRoleDisplayName(state.user.role)}
        </p>
      </div>
      
      <button
        onClick={signOut}
        className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default App;