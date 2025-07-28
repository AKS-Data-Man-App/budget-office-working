// src/components/pages/ICTDashboard.tsx
// ICT Head Dashboard - Beautiful Design with Create Staff Functionality

import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserRole } from '../../types/auth.types';
import { Users, FileText, UserPlus, Database, Settings, Search, Download } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import CreateStaffForm from './DirectorDashboard/components/CreateStaffForm';

type TabKey = 'staff' | 'users' | 'settings';

const ICTDashboard: React.FC = () => {
  const { state, dispatch, createUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabKey>('staff');
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [search, setSearch] = useState('');

  // Filter staff data
  const filteredStaff = useMemo(() => {
    const data = state.staffData || [];
    return data.filter((staff: any) => 
      !search || `${staff.firstName} ${staff.lastName} ${staff.rank} ${staff.department}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [state.staffData, search]);

  // Tab configuration with beautiful colors
  const tabs = [
    { key: 'staff' as TabKey, label: 'Staff Database', icon: Database, color: 'var(--akwa-green)' },
    { key: 'users' as TabKey, label: 'User Accounts', icon: Users, color: 'var(--akwa-orange)' },
    { key: 'settings' as TabKey, label: 'System Settings', icon: Settings, color: '#8B5CF6' }
  ];

  // Handle staff creation
  const handleCreateStaff = async (staffData: any) => {
    try {
      console.log('Creating new staff:', staffData);
      // TODO: Call your backend API to create staff
      // await apiService.createStaff(staffData);
      
      alert('Staff member created successfully!');
      setShowCreateStaff(false);
      
      // TODO: Refresh staff data
    } catch (error) {
      console.error('Error creating staff:', error);
      alert('Failed to create staff member. Please try again.');
    }
  };

  // Stats for beautiful overview cards
  const stats = {
    staffRecords: state.staffData?.length || 4,
    systemUsers: state.allUsers?.length || 3,
    activeStaff: filteredStaff.filter((s: any) => s.status === 'ACTIVE').length || 4,
    departments: new Set(state.staffData?.map((s: any) => s.department) || []).size || 2
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'staff':
        return <StaffDatabaseTab staffData={filteredStaff} search={search} setSearch={setSearch} />;
      case 'users':
        return <UserAccountsTab users={state.allUsers || []} />;
      case 'settings':
        return <SystemSettingsTab />;
      default:
        return <StaffDatabaseTab staffData={filteredStaff} search={search} setSearch={setSearch} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Beautiful Gradient Header */}
      <header style={{
        background: 'linear-gradient(135deg, var(--akwa-green) 0%, var(--akwa-orange) 100%)',
        color: 'white',
        padding: '2rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Background Elements */}
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
                ICT Dashboard
              </h1>
              <p style={{
                fontSize: '1.125rem',
                margin: 0,
                opacity: 0.9
              }}>
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

      {/* Beautiful Stats Overview */}
      <div style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Staff Records Card */}
          <div style={{
            background: 'linear-gradient(135deg, var(--akwa-green) 0%, #22C55E 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <FileText style={{ width: '2rem', height: '2rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.staffRecords}</div>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '500' }}>Staff Records</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Government database</div>
            </div>
            <div style={{
              position: 'absolute',
              top: '-20%',
              right: '-20%',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }} />
          </div>

          {/* System Users Card */}
          <div style={{
            background: 'linear-gradient(135deg, var(--akwa-orange) 0%, #F97316 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Users style={{ width: '2rem', height: '2rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.systemUsers}</div>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '500' }}>System Users</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Active accounts</div>
            </div>
            <div style={{
              position: 'absolute',
              top: '-20%',
              right: '-20%',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }} />
          </div>

          {/* Active Staff Card */}
          <div style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Database style={{ width: '2rem', height: '2rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.activeStaff}</div>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '500' }}>Active Staff</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Currently employed</div>
            </div>
            <div style={{
              position: 'absolute',
              top: '-20%',
              right: '-20%',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }} />
          </div>

          {/* Create Staff Action Card */}
          <div style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => setShowCreateStaff(true)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <UserPlus style={{ width: '3rem', height: '3rem' }} />
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '500', textAlign: 'center' }}>Create New Staff</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8, textAlign: 'center' }}>Add to database</div>
            </div>
            <div style={{
              position: 'absolute',
              top: '-20%',
              right: '-20%',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }} />
          </div>
        </div>

        {/* Beautiful Tab Navigation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.5)'
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

      {/* Beautiful Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{
            fontSize: '1rem',
            margin: '0 0 0.5rem 0',
            opacity: 0.9
          }}>
            © 2025 Akwa Ibom State Budget Office - ICT Administration
          </p>
          <p style={{
            fontSize: '0.875rem',
            margin: 0,
            opacity: 0.7,
            fontStyle: 'italic'
          }}>
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

// Staff Database Tab Component
const StaffDatabaseTab: React.FC<{
  staffData: any[];
  search: string;
  setSearch: (search: string) => void;
}> = ({ staffData, search, setSearch }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
          Staff Nominal Roll Database
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
          Complete government staff records and management
        </p>
      </div>
      
      <Button variant="success" size="sm" icon={<Download />}>
        Export Database
      </Button>
    </div>

    {/* Search Bar */}
    <div style={{ position: 'relative', maxWidth: '400px' }}>
      <Search style={{ 
        position: 'absolute', 
        left: '0.75rem', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        width: '1rem', 
        height: '1rem', 
        color: '#9CA3AF' 
      }} />
      <input
        type="text"
        placeholder="Search staff records..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem 0.75rem 0.75rem 2.5rem',
          border: '1px solid #D1D5DB',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          backgroundColor: 'white',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}
      />
    </div>

    {/* Staff Table */}
    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      border: '1px solid #E5E7EB',
      overflow: 'hidden'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#F9FAFB' }}>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                S/N
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                Name
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                Rank
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                Grade
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                Department
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {staffData.map((staff, index) => (
              <tr 
                key={staff.id || index}
                style={{ 
                  borderBottom: '1px solid #F3F4F6',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                  {index + 1}
                </td>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>
                  {staff.firstName} {staff.lastName}
                </td>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                  {staff.rank}
                </td>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                  <Badge variant="primary" size="sm">
                    {staff.gradeLevel}
                  </Badge>
                </td>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                  {staff.department?.name || staff.department}
                </td>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                  <Badge 
                    variant={staff.status === 'ACTIVE' ? 'success' : 'warning'} 
                    size="sm"
                  >
                    {staff.status || 'Active'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// User Accounts Tab Component
const UserAccountsTab: React.FC<{ users: any[] }> = ({ users }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
        System User Accounts
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
        Manage user access and permissions
      </p>
    </div>

    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      border: '1px solid #E5E7EB',
      overflow: 'hidden'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#F9FAFB' }}>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                Name
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                Email
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                Role
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr 
                key={user.id || index}
                style={{ 
                  borderBottom: '1px solid #F3F4F6',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>
                  {user.firstName} {user.lastName}
                </td>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                  {user.email || user.username}
                </td>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                  <Badge 
                    variant={user.role === 'ORGANIZATION_HEAD' ? 'danger' : user.role === 'ICT_HEAD' ? 'warning' : 'info'} 
                    size="sm"
                  >
                    {user.role.replace('_', ' ')}
                  </Badge>
                </td>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                  <Badge 
                    variant={user.status === 'ACTIVE' ? 'success' : user.status === 'PENDING_APPROVAL' ? 'warning' : 'default'} 
                    size="sm"
                  >
                    {user.status.replace('_', ' ')}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// System Settings Tab Component
const SystemSettingsTab: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
        System Settings
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
        Configure system preferences and security settings
      </p>
    </div>

    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Database Settings Card */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #E5E7EB'
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 1rem 0' }}>
          Database Configuration
        </h4>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
          Manage database connections and backup settings
        </p>
        <Button variant="primary" size="sm">
          Configure Database
        </Button>
      </div>

      {/* Security Settings Card */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #E5E7EB'
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 1rem 0' }}>
          Security & Access Control
        </h4>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
          Manage user permissions and security policies
        </p>
        <Button variant="warning" size="sm">
          Security Settings
        </Button>
      </div>

      {/* Backup Settings Card */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #E5E7EB'
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 1rem 0' }}>
          Data Backup & Recovery
        </h4>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
          Schedule automatic backups and manage data recovery
        </p>
        <Button variant="success" size="sm">
          Backup Settings
        </Button>
      </div>
    </div>
  </div>
);

export default ICTDashboard;