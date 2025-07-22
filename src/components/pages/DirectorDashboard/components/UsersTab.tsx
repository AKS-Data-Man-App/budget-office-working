// src/components/pages/DirectorDashboard/components/UsersTab.tsx
// User Management Tab - Clean with Essential Features

import React, { useState, useMemo } from 'react';
import { UserPlus, Search, Filter } from 'lucide-react';
import Table, { TableColumn } from '../../../common/Table';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  status: string;
}

export interface UsersTabProps {
  users: User[];
  onCreateUser: () => void;
  loading?: boolean;
}

const UsersTab: React.FC<UsersTabProps> = ({ users, onCreateUser, loading = false }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Smart filtering with useMemo for performance
  const { filteredUsers, stats } = useMemo(() => {
    const filtered = users.filter(user => {
      const searchMatch = !search || 
        `${user.firstName} ${user.lastName} ${user.username} ${user.email}`.toLowerCase().includes(search.toLowerCase());
      const statusMatch = statusFilter === 'all' || user.status === statusFilter;
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      return searchMatch && statusMatch && roleMatch;
    });

    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'ACTIVE').length,
      pending: users.filter(u => u.status === 'PENDING_APPROVAL').length,
      activation: users.filter(u => u.status === 'APPROVED_PENDING_ACTIVATION').length
    };

    return { filteredUsers: filtered, stats };
  }, [users, search, statusFilter, roleFilter]);

  // Role and status mappings
  const roleLabels: Record<string, string> = {
    'ORGANIZATION_HEAD': 'Director',
    'ICT_HEAD': 'ICT Head',
    'STAFF': 'Staff'
  };

  const statusLabels: Record<string, string> = {
    'APPROVED_PENDING_ACTIVATION': 'Pending Activation',
    'PENDING_APPROVAL': 'Pending Approval'
  };

  const getStatusVariant = (status: string) => 
    status === 'ACTIVE' ? 'success' : status === 'PENDING_APPROVAL' ? 'warning' : 'info';

  const getRoleVariant = (role: string) => 
    role === 'ORGANIZATION_HEAD' ? 'danger' : role === 'ICT_HEAD' ? 'warning' : 'info';

  const columns: TableColumn[] = [
    {
      key: 'user',
      header: 'User',
      render: (_, user: User) => (
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
            {user.firstName} {user.lastName}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{user.username}</div>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{user.email}</div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (role: string) => (
        <Badge variant={getRoleVariant(role)} size="sm">
          {roleLabels[role] || role}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (status: string) => (
        <Badge variant={getStatusVariant(status)} size="sm">
          {statusLabels[status] || status}
        </Badge>
      )
    },
    {
      key: 'created',
      header: 'Created',
      render: () => <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{new Date().toLocaleDateString()}</span>
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>
          User Management
        </h3>
        <Button variant="gradient" icon={<UserPlus />} onClick={onCreateUser}>
          Create User
        </Button>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total', value: stats.total, color: '#6B7280' },
          { label: 'Active', value: stats.active, color: 'var(--akwa-green)' },
          { label: 'Pending', value: stats.pending, color: 'var(--akwa-orange)' },
          { label: 'Activation', value: stats.activation, color: '#3B82F6' }
        ].map(stat => (
          <div key={stat.label} style={{ 
            backgroundColor: 'white', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1rem', 
        borderRadius: '0.5rem', 
        border: '1px solid #E5E7EB',
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
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
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.5rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #D1D5DB',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="all">All Roles</option>
          <option value="ORGANIZATION_HEAD">Director</option>
          <option value="ICT_HEAD">ICT Head</option>
          <option value="STAFF">Staff</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #D1D5DB',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="all">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="APPROVED_PENDING_ACTIVATION">Pending Activation</option>
        </select>

        {/* Clear Filters */}
        {(search || statusFilter !== 'all' || roleFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => {
            setSearch('');
            setStatusFilter('all');
            setRoleFilter('all');
          }}>
            Clear
          </Button>
        )}
      </div>

      {/* Results Summary */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
        Showing {filteredUsers.length} of {users.length} users
        {search && ` matching "${search}"`}
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredUsers}
        keyField="id"
        loading={loading}
        emptyMessage={
          search || statusFilter !== 'all' || roleFilter !== 'all'
            ? "No users match your filters."
            : "No users created yet. Click 'Create User' to add the first user."
        }
      />
    </div>
  );
};

export default UsersTab;