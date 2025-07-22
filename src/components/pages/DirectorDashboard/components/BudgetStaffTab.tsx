// src/components/pages/DirectorDashboard/components/BudgetStaffTab.tsx
// Budget Office Staff Tab - Clean with Essential Features

import React, { useState, useMemo } from 'react';
import { Search, Filter, FileText, Calendar, MapPin } from 'lucide-react';
import Table, { TableColumn } from '../../../common/Table';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';

export interface StaffMember {
  sn: number;
  nameOfOfficer: string;
  sex: string;
  dateOfBirth: string;
  dateOfFirstAppointment: string;
  dateOfConfirmation: string;
  dateOfLastPromotion: string;
  rank: string;
  gradeLevel: string;
  step: number;
  educationalQualification: string;
  lga: string;
  dateOfRetirement: string;
  remarks: string;
  department: string;
}

export interface BudgetStaffTabProps {
  staffData: StaffMember[];
  loading?: boolean;
}

const BudgetStaffTab: React.FC<BudgetStaffTabProps> = ({ staffData, loading = false }) => {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Smart filtering and stats
  const { filteredStaff, stats, departments } = useMemo(() => {
    const filtered = staffData.filter(staff => {
      const searchMatch = !search || 
        `${staff.nameOfOfficer} ${staff.rank} ${staff.department} ${staff.lga}`.toLowerCase().includes(search.toLowerCase());
      const deptMatch = departmentFilter === 'all' || staff.department === departmentFilter;
      const statusMatch = statusFilter === 'all' || getStaffStatus(staff).toLowerCase().includes(statusFilter);
      return searchMatch && deptMatch && statusMatch;
    });

    const departments = Array.from(new Set(staffData.map(s => s.department))).sort();
    
    const stats = {
      total: staffData.length,
      retirement: staffData.filter(s => s.remarks.toLowerCase().includes('retirement')).length,
      promotion: staffData.filter(s => s.remarks.toLowerCase().includes('promotion')).length,
      leave: staffData.filter(s => s.remarks.toLowerCase().includes('leave')).length
    };

    return { filteredStaff: filtered, stats, departments };
  }, [staffData, search, departmentFilter, statusFilter]);

  // Helper functions
  const getStaffStatus = (staff: StaffMember) => {
    const remarks = staff.remarks.toLowerCase();
    if (remarks.includes('retirement')) return 'Due for Retirement';
    if (remarks.includes('leave')) return 'On Leave';
    if (remarks.includes('promotion')) return 'Due for Promotion';
    if (remarks.includes('excellent')) return 'Excellent Performance';
    return 'Active';
  };

  const getStatusVariant = (staff: StaffMember) => {
    const remarks = staff.remarks.toLowerCase();
    if (remarks.includes('retirement')) return 'warning';
    if (remarks.includes('leave')) return 'info';
    if (remarks.includes('promotion')) return 'success';
    if (remarks.includes('excellent')) return 'success';
    return 'default';
  };

  const getGradeColor = (gradeLevel: string) => {
    const level = parseInt(gradeLevel.replace('GL-', ''));
    if (level >= 17) return 'danger';
    if (level >= 15) return 'warning';
    if (level >= 12) return 'primary';
    return 'info';
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    return today.getFullYear() - birth.getFullYear();
  };

  const calculateYearsOfService = (dateOfFirstAppointment: string) => {
    const today = new Date();
    const appointment = new Date(dateOfFirstAppointment);
    return today.getFullYear() - appointment.getFullYear();
  };

  // Table columns
  const columns: TableColumn[] = [
    {
      key: 'sn',
      header: 'S/N',
      width: '60px',
      render: (sn: number) => (
        <span style={{ fontWeight: '500', color: '#6B7280' }}>{sn}</span>
      )
    },
    {
      key: 'officer',
      header: 'Officer Details',
      width: '250px',
      render: (_, staff: StaffMember) => (
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
            {staff.nameOfOfficer}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>
            {staff.sex} • Age {calculateAge(staff.dateOfBirth)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin style={{ width: '0.75rem', height: '0.75rem', color: '#9CA3AF' }} />
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{staff.lga}</span>
          </div>
        </div>
      )
    },
    {
      key: 'position',
      header: 'Position & Grade',
      width: '200px',
      render: (_, staff: StaffMember) => (
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
            {staff.rank}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Badge variant={getGradeColor(staff.gradeLevel)} size="xs">
              {staff.gradeLevel}
            </Badge>
            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Step {staff.step}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{staff.department}</div>
        </div>
      )
    },
    {
      key: 'service',
      header: 'Service Record',
      width: '150px',
      render: (_, staff: StaffMember) => (
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>
            <strong>Appointed:</strong> {new Date(staff.dateOfFirstAppointment).getFullYear()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>
            <strong>Service:</strong> {calculateYearsOfService(staff.dateOfFirstAppointment)} years
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
            <strong>Retires:</strong> {new Date(staff.dateOfRetirement).getFullYear()}
          </div>
        </div>
      )
    },
    {
      key: 'qualification',
      header: 'Education',
      width: '180px',
      render: (qualification: string) => (
        <div style={{ fontSize: '0.8rem', color: '#374151', lineHeight: '1.3' }}>
          {qualification}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '140px',
      render: (_, staff: StaffMember) => (
        <Badge variant={getStatusVariant(staff)} size="sm">
          {getStaffStatus(staff)}
        </Badge>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: '0 0 0.5rem 0' }}>
            Budget Office Staff
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
            Staff working directly in the Budget Office building complex.
          </p>
        </div>
        
        <div style={{
          backgroundColor: '#F0FDF4',
          color: 'var(--akwa-green)',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FileText style={{ width: '1rem', height: '1rem' }} />
          {staffData.length} Active Staff
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Staff', value: stats.total, color: '#374151', icon: '👥' },
          { label: 'Due Retirement', value: stats.retirement, color: 'var(--akwa-orange)', icon: '📅' },
          { label: 'Due Promotion', value: stats.promotion, color: 'var(--akwa-green)', icon: '⬆️' },
          { label: 'On Leave', value: stats.leave, color: '#3B82F6', icon: '🏖️' }
        ].map(stat => (
          <div key={stat.label} style={{ 
            backgroundColor: 'white', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.25rem' }}>
              {stat.value}
            </div>
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
            placeholder="Search staff by name, rank, department..."
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

        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #D1D5DB',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
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
          <option value="retirement">Due for Retirement</option>
          <option value="promotion">Due for Promotion</option>
          <option value="leave">On Leave</option>
          <option value="excellent">Excellent Performance</option>
        </select>

        {/* Clear Filters */}
        {(search || departmentFilter !== 'all' || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => {
            setSearch('');
            setDepartmentFilter('all');
            setStatusFilter('all');
          }}>
            Clear
          </Button>
        )}
      </div>

      {/* Results Summary */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
        Showing {filteredStaff.length} of {staffData.length} staff members
        {search && ` matching "${search}"`}
      </div>

      {/* Staff Table */}
      <Table
        columns={columns}
        data={filteredStaff}
        keyField="sn"
        loading={loading}
        emptyMessage={
          search || departmentFilter !== 'all' || statusFilter !== 'all'
            ? "No staff members match your filters."
            : "No staff data available."
        }
        size="md"
        onRowClick={(staff) => {
          console.log('View staff details:', staff);
          // TODO: Open staff details modal
        }}
      />

      {/* Office Info Footer */}
      <div style={{
        backgroundColor: '#F9FAFB',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>
          Budget Office Complex
        </h4>
        <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>
          Governor's Office Annex Uyo • Akwa Ibom State - "The Land of Promise"
        </p>
      </div>
    </div>
  );
};

export default BudgetStaffTab;