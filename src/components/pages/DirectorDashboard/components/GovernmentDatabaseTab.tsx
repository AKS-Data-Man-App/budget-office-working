// src/components/pages/DirectorDashboard/components/GovernmentDatabaseTab.tsx
// Government Database Tab - Director View Only (No Create Staff)

import React, { useState, useMemo } from 'react';
import { Search, Download, Database } from 'lucide-react';
import Table, { TableColumn } from '../../../common/Table';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';
import { useAppContext } from '../../../../context/AppContext';

const GovernmentDatabaseTab: React.FC = () => {
  const { state } = useAppContext();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [lgaFilter, setLgaFilter] = useState('all');

  // Filter staff data from your backend API
  const { filteredStaff, departments, lgas } = useMemo(() => {
    const data = state.staffData || [];
    
    const filtered = data.filter((staff: any) => {
      const searchMatch = !search || `${staff.nameOfOfficer} ${staff.rank} ${staff.department} ${staff.lga}`.toLowerCase().includes(search.toLowerCase());
      const deptMatch = departmentFilter === 'all' || staff.department === departmentFilter;
      const lgaMatch = lgaFilter === 'all' || staff.lga === lgaFilter;
      return searchMatch && deptMatch && lgaMatch;
    });

    const departments = Array.from(new Set(data.map((s: any) => s.department))).sort();
    const lgas = Array.from(new Set(data.map((s: any) => s.lga))).sort();

    return { filteredStaff: filtered, departments, lgas };
  }, [state.staffData, search, departmentFilter, lgaFilter]);

  // Helper functions
  const getGradeColor = (grade: string) => {
    const level = parseInt(grade.replace('GL-', ''));
    return level >= 17 ? 'danger' : level >= 15 ? 'warning' : level >= 12 ? 'primary' : 'info';
  };

  const getStatusFromRemarks = (remarks: string) => {
    if (remarks.toLowerCase().includes('retirement')) return { label: 'Due for Retirement', variant: 'warning' as const };
    if (remarks.toLowerCase().includes('leave')) return { label: 'On Leave', variant: 'info' as const };
    if (remarks.toLowerCase().includes('excellent')) return { label: 'Excellent', variant: 'success' as const };
    return { label: 'Active', variant: 'default' as const };
  };

  // Table columns matching ALL fields from your backend API
  const columns: TableColumn[] = [
    {
      key: 'sn',
      header: 'S/N',
      width: '60px',
      render: (sn: number) => <span style={{ fontWeight: '500', color: '#6B7280' }}>{sn}</span>
    },
    {
      key: 'officer',
      header: 'Name of Officer',
      width: '200px',
      render: (_, staff: any) => (
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{staff.nameOfOfficer}</div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{staff.sex} • {staff.lga}</div>
        </div>
      )
    },
    {
      key: 'dates',
      header: 'Birth & Age',
      width: '120px',
      render: (_, staff: any) => {
        const age = new Date().getFullYear() - new Date(staff.dateOfBirth).getFullYear();
        return (
          <div>
            <div style={{ fontSize: '0.875rem', color: '#111827' }}>{staff.dateOfBirth}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Age: {age}</div>
          </div>
        );
      }
    },
    {
      key: 'appointment',
      header: 'First Appointment',
      width: '130px',
      render: (_, staff: any) => <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{staff.dateOfFirstAppointment}</div>
    },
    {
      key: 'confirmation',
      header: 'Date of Confirmation',
      width: '140px',
      render: (_, staff: any) => <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{staff.dateOfConfirmation}</div>
    },
    {
      key: 'promotion',
      header: 'Last Promotion',
      width: '130px',
      render: (_, staff: any) => <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{staff.dateOfLastPromotion}</div>
    },
    {
      key: 'rank',
      header: 'Rank',
      width: '180px',
      render: (rank: string) => <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>{rank}</div>
    },
    {
      key: 'grade',
      header: 'Grade Level',
      width: '120px',
      render: (_, staff: any) => (
        <div>
          <Badge variant={getGradeColor(staff.gradeLevel)} size="sm">{staff.gradeLevel}</Badge>
          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>Step {staff.step}</div>
        </div>
      )
    },
    {
      key: 'education',
      header: 'Educational Qualification',
      width: '220px',
      render: (qualification: string) => <div style={{ fontSize: '0.8rem', color: '#374151', lineHeight: '1.3' }}>{qualification}</div>
    },
    {
      key: 'department',
      header: 'Department',
      width: '160px',
      render: (department: string) => <div style={{ fontSize: '0.875rem', color: '#374151' }}>{department}</div>
    },
    {
      key: 'retirement',
      header: 'Retirement Date',
      width: '130px',
      render: (_, staff: any) => {
        const isNear = new Date(staff.dateOfRetirement).getFullYear() <= new Date().getFullYear() + 2;
        return (
          <div style={{ fontSize: '0.875rem', color: isNear ? '#EF4444' : '#6B7280', fontWeight: isNear ? '500' : '400' }}>
            {staff.dateOfRetirement}
          </div>
        );
      }
    },
    {
      key: 'remarks',
      header: 'Remarks',
      width: '200px',
      render: (remarks: string, staff: any) => {
        const status = getStatusFromRemarks(remarks);
        return (
          <div>
            <Badge variant={status.variant} size="sm" style={{ marginBottom: '0.25rem' }}>
              {status.label}
            </Badge>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: '1.3' }}>
              {remarks}
            </div>
          </div>
        );
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header - Director View Only */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: '0 0 0.5rem 0' }}>
            STAFF NOMINAL ROLL OF STATE BUDGET OFFICE
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
            Governor's Office Annex Uyo - July 2025 • Akwa Ibom State - "The Land of Promise"
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Total Staff Badge */}
          <div style={{
            background: 'linear-gradient(135deg, var(--akwa-orange) 0%, var(--akwa-green) 100%)',
            color: 'white',
            padding: '0.75rem 1.25rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Database style={{ width: '1rem', height: '1rem' }} />
            {state.staffData?.length || 0} Total Staff
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Staff', value: state.staffData?.length || 0, color: '#374151', icon: '👥' },
          { label: 'Departments', value: departments.length, color: 'var(--akwa-green)', icon: '🏢' },
          { label: 'LGAs', value: lgas.length, color: 'var(--akwa-orange)', icon: '🗺️' },
          { label: 'Near Retirement', value: filteredStaff.filter((s: any) => 
            new Date(s.dateOfRetirement).getFullYear() <= new Date().getFullYear() + 2).length, 
            color: '#EF4444', icon: '📅' }
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
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
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
            placeholder="Search by name, rank, department, or LGA..."
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
            backgroundColor: 'white',
            minWidth: '150px'
          }}
        >
          <option value="all">All Departments</option>
          {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>

        {/* LGA Filter */}
        <select
          value={lgaFilter}
          onChange={(e) => setLgaFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #D1D5DB',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            minWidth: '120px'
          }}
        >
          <option value="all">All LGAs</option>
          {lgas.map(lga => <option key={lga} value={lga}>{lga}</option>)}
        </select>

        {/* Export Button */}
        <Button
          variant="success"
          size="sm"
          icon={<Download />}
          onClick={() => {
            console.log(`Exporting ${filteredStaff.length} staff records...`);
            alert(`Exporting ${filteredStaff.length} records to Excel...`);
          }}
        >
          Export
        </Button>

        {/* Clear Filters */}
        {(search || departmentFilter !== 'all' || lgaFilter !== 'all') && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setSearch('');
              setDepartmentFilter('all');
              setLgaFilter('all');
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Results Summary */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
        Showing {filteredStaff.length} of {state.staffData?.length || 0} government employees
        {search && ` matching "${search}"`}
      </div>

      {/* Staff Table */}
      <Table
        columns={columns}
        data={filteredStaff}
        keyField="sn"
        loading={state.isLoading}
        emptyMessage={
          search || departmentFilter !== 'all' || lgaFilter !== 'all'
            ? "No government employees match your filters."
            : "Loading official government staff database..."
        }
        size="md"
        onRowClick={(staff) => console.log('View staff record:', staff)}
      />

      {/* Footer */}
      <div style={{
        backgroundColor: '#F9FAFB',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>
          Official Government Database
        </h4>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 0.5rem 0' }}>
          Budget Office • Governor's Office Annex Uyo • Akwa Ibom State
        </p>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>
          "The Land of Promise" - Official Records • Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default GovernmentDatabaseTab;