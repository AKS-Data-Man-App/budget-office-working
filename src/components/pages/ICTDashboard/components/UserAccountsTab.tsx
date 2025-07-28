// src/components/pages/ICTDashboard/components/UserAccountsTab.tsx
// User Accounts Management Tab - Fixed ESLint Errors

import React, { useState, useMemo } from 'react';
import { Search, UserPlus, Shield, Key, Settings } from 'lucide-react';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';

interface UserAccountsTabProps {
  users: any[];
}

const UserAccountsTab: React.FC<UserAccountsTabProps> = ({ users }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter users
  const { filteredUsers, roles, statuses } = useMemo(() => {
    const filtered = users.filter((user: any) => {
      const searchMatch = !search || `${user.firstName} ${user.lastName} ${user.email || user.username}`.toLowerCase().includes(search.toLowerCase());
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      const statusMatch = statusFilter === 'all' || user.status === statusFilter;
      return searchMatch && roleMatch && statusMatch;
    });

    const roles = Array.from(new Set(users.map((u: any) => u.role))).filter(Boolean);
    const statuses = Array.from(new Set(users.map((u: any) => u.status))).filter(Boolean);

    return { filteredUsers: filtered, roles, statuses };
  }, [users, search, roleFilter, statusFilter]);

  // Helper functions
  const getRoleColor = (role: string): 'default' | 'success' | 'warning' | 'info' | 'danger' | 'primary' | 'secondary' => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'info' | 'danger' | 'primary' | 'secondary'> = {
      'ORGANIZATION_HEAD': 'danger', 
      'ICT_HEAD': 'warning', 
      'STAFF': 'info'
    };
    return colors[role] || 'default';
  };

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'info' | 'danger' | 'primary' | 'secondary' => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'info' | 'danger' | 'primary' | 'secondary'> = {
      'ACTIVE': 'success', 
      'PENDING_APPROVAL': 'warning', 
      'APPROVED_PENDING_ACTIVATION': 'info', 
      'INACTIVE': 'default', 
      'SUSPENDED': 'danger'
    };
    return colors[status] || 'default';
  };

  // Action handlers
  const handleAction = (user: any, action: string) => {
    const actions = {
      reset: () => window.confirm(`Reset password for ${user.firstName} ${user.lastName}?`) && alert('Password reset email sent!'),
      toggle: () => window.confirm(`${user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} ${user.firstName} ${user.lastName}?`) && alert('Status updated!'),
      permissions: () => alert('Permissions management coming soon!')
    };
    actions[action as keyof typeof actions]?.();
  };

  const stats = [
    { label: 'Total', value: users.length, color: 'var(--akwa-green)' },
    { label: 'Active', value: users.filter(u => u.status === 'ACTIVE').length, color: '#22C55E' },
    { label: 'Pending', value: users.filter(u => u.status === 'PENDING_APPROVAL').length, color: 'var(--akwa-orange)' },
    { label: 'Directors', value: users.filter(u => u.role === 'ORGANIZATION_HEAD').length, color: '#EF4444' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
            System User Accounts
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
            Manage user access, roles, and permissions
          </p>
        </div>
        <Button variant="primary" size="sm" icon={<UserPlus />} onClick={() => alert('Create user coming soon!')}>
          Create User
        </Button>
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem' }}
          />
        </div>
        
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: '0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', minWidth: '130px' }}>
          <option value="all">All Roles</option>
          {roles.map(role => <option key={role} value={role}>{role.replace('_', ' ')}</option>)}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.875rem', minWidth: '130px' }}>
          <option value="all">All Status</option>
          {statuses.map(status => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
        </select>

        {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); }}>Clear</Button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Results */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
        Showing {filteredUsers.length} of {users.length} user accounts{search && ` matching "${search}"`}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map(header => (
                  <th key={header} style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>No users found</td></tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id || index} style={{ borderBottom: '1px solid #F3F4F6' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>{user.firstName} {user.lastName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>ID: {user.id?.slice(-8) || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>{user.email || user.username}</td>
                    <td style={{ padding: '0.75rem' }}><Badge variant={getRoleColor(user.role)} size="sm">{user.role?.replace('_', ' ') || 'Unknown'}</Badge></td>
                    <td style={{ padding: '0.75rem' }}><Badge variant={getStatusColor(user.status)} size="sm">{user.status?.replace('_', ' ') || 'Unknown'}</Badge></td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6B7280' }}>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[
                          { icon: Key, action: 'reset', color: 'var(--akwa-orange)', title: 'Reset Password' },
                          { icon: Shield, action: 'toggle', color: user.status === 'ACTIVE' ? '#EF4444' : 'var(--akwa-green)', title: user.status === 'ACTIVE' ? 'Deactivate' : 'Activate' },
                          { icon: Settings, action: 'permissions', color: '#8B5CF6', title: 'Manage Permissions' }
                        ].map(({ icon: Icon, action, color, title }) => (
                          <button key={action} onClick={() => handleAction(user, action)} title={title} style={{ padding: '0.25rem', border: 'none', borderRadius: '0.25rem', backgroundColor: color, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon style={{ width: '0.875rem', height: '0.875rem' }} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAccountsTab;