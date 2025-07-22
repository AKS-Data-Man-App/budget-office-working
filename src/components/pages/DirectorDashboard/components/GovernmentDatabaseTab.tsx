// src/components/pages/DirectorDashboard/components/GovernmentDatabaseTab.tsx
// Government Database Tab - All Features, Streamlined

import React, { useState, useMemo } from 'react';
import { Search, Download, Filter, Database } from 'lucide-react';
import Table, { TableColumn } from '../../../common/Table';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';
import { useAppContext } from '../../../../context/AppContext';

const GovernmentDatabaseTab: React.FC = () => {
  const { state } = useAppContext();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [lgaFilter, setLgaFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // All filtering and stats in one useMemo
  const { filteredStaff, stats, filters } = useMemo(() => {
    const data = state.staffData || [];
    
    const filtered = data.filter((staff: any) => {
      const searchMatch = !search || `${staff.nameOfOfficer} ${staff.rank} ${staff.department} ${staff.lga}`.toLowerCase().includes(search.toLowerCase());
      const deptMatch = departmentFilter === 'all' || staff.department === departmentFilter;
      const lgaMatch = lgaFilter === 'all' || staff.lga === lgaFilter;
      const gradeMatch = gradeFilter === 'all' || staff.gradeLevel === gradeFilter;
      return searchMatch && deptMatch && lgaMatch && gradeMatch;
    });

    const departments = Array.from(new Set(data.map((s: any) => s.department))).sort();
    const lgas = Array.from(new Set(data.map((s: any) => s.lga))).sort();
    const grades = Array.from(new Set(data.map((s: any) => s.gradeLevel))).sort();
    
    const stats = {
      total: data.length,
      departments: departments.length,
      lgas: lgas.length,
      retirement: data.filter((s: any) => new Date(s.dateOfRetirement).getFullYear() <= new Date().getFullYear() + 2).length,
      newHires: data.filter((s: any) => new Date().getFullYear() - new Date(s.dateOfFirstAppointment).getFullYear() <= 1).length
    };

    return { filteredStaff: filtered, stats, filters: { departments, lgas, grades } };
  }, [state.staffData, search, departmentFilter, lgaFilter, gradeFilter]);

  // Helper functions
  const getGradeColor = (grade: string) => {
    const level = parseInt(grade.replace('GL-', ''));
    return level >= 17 ? 'danger' : level >= 15 ? 'warning' : level >= 12 ? 'primary' : 'info';
  };

  const getServiceYears = (date: string) => new Date().getFullYear() - new Date(date).getFullYear();
  const isNearRetirement = (date: string) => new Date(date).getFullYear() <= new Date().getFullYear() + 2;

  // Streamlined table columns
  const columns: TableColumn[] = [
    {
      key: 'sn',
      header: 'S/N',
      width: '60px',
      render: (sn: number) => <span style={{ fontWeight: '500', color: '#6B7280' }}>{sn}</span>
    },
    {
      key: 'officer',
      header: 'Officer Information',
      width: '220px',
      render: (_, staff: any) => (
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{staff.nameOfOfficer}</div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{staff.sex} • {staff.lga} • {getServiceYears(staff.dateOfFirstAppointment)} years</div>
        </div>
      )
    },
    {
      key: 'position',
      header: 'Position & Grade',
      width: '180px',
      render: (_, staff: any) => (
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{staff.rank}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant={getGradeColor(staff.gradeLevel)} size="xs">{staff.gradeLevel}</Badge>
            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Step {staff.step}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{staff.department}</div>
        </div>
      )
    },
    {
      key: 'dates',
      header: 'Key Dates',
      width: '140px',
      render: (_, staff: any) => (
        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
          <div>Appointed: {new Date(staff.dateOfFirstAppointment).getFullYear()}</div>
          <div>Confirmed: {new Date(staff.dateOfConfirmation).getFullYear()}</div>
          <div style={{ color: isNearRetirement(staff.dateOfRetirement) ? 'var(--akwa-orange)' : '#6B7280' }}>
            Retires: {new Date(staff.dateOfRetirement).getFullYear()}
          </div>
        </div>
      )
    },
    {
      key: 'education',
      header: 'Education',
      width: '160px',
      render: (qualification: string) => <div style={{ fontSize: '0.8rem', color: '#374151', lineHeight: '1.3' }}>{qualification}</div>
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (_, staff: any) => {
        if (isNearRetirement(staff.dateOfRetirement)) return <Badge variant="warning" size="sm">Near Retirement</Badge>;
        if (staff.remarks.toLowerCase().includes('leave')) return <Badge variant="info" size="sm">On Leave</Badge>;
        if (staff.remarks.toLowerCase().includes('excellent')) return <Badge variant="success" size="sm">Excellent</Badge>;
        return <Badge variant="default" size="sm">Active</Badge>;
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: '0 0 0.5rem 0' }}>
            Akwa Ibom State Government Database
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
            Complete database of all government employees across ministries, departments, and agencies.
          </p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, var(--akwa-orange) 0%, var(--akwa-green) 100%)',
          color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <Database style={{ width: '1rem', height: '1rem' }} />
          {stats.total.toLocaleString()} Total Workers
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Staff', value: stats.total, color: '#374151', icon: '👥' },
          { label: 'Departments', value: stats.departments, color: 'var(--akwa-green)', icon: '🏢' },
          { label: 'LGAs Covered', value: stats.lgas, color: 'var(--akwa-orange)', icon: '🗺️' },
          { label: 'Near Retirement', value: stats.retirement, color: '#EF4444', icon: '📅' },
          { label: 'New Hires', value: stats.newHires, color: '#3B82F6', icon: '✨' }
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.25rem' }}>{stat.value.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: showAdvanced ? '1rem' : '0' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9CA3AF' }} />
            <input type="text" placeholder="Search by name, rank, department, or LGA..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.5rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }} />
          </div>

          {/* Filters */}
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: 'white', minWidth: '150px' }}>
            <option value="all">All Departments</option>
            {filters.departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>

          <select value={lgaFilter} onChange={(e) => setLgaFilter(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: 'white', minWidth: '120px' }}>
            <option value="all">All LGAs</option>
            {filters.lgas.map(lga => <option key={lga} value={lga}>{lga}</option>)}
          </select>

          <Button variant="ghost" size="sm" icon={<Filter />} onClick={() => setShowAdvanced(!showAdvanced)}>Advanced</Button>
          <Button variant="secondary" size="sm" icon={<Download />} onClick={() => {
            console.log(`Exporting ${filteredStaff.length} records...`);
            alert(`Exporting ${filteredStaff.length} records to CSV...`);
          }}>Export</Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
            <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: 'white', minWidth: '120px' }}>
              <option value="all">All Grades</option>
              {filters.grades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
            </select>
            <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>More filters coming soon...</span>
          </div>
        )}

        {/* Clear Filters */}
        {(search || departmentFilter !== 'all' || lgaFilter !== 'all' || gradeFilter !== 'all') && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
            <Button variant="ghost" size="sm" onClick={() => {
              setSearch('');
              setDepartmentFilter('all');
              setLgaFilter('all');
              setGradeFilter('all');
            }}>Clear All Filters</Button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
        Showing {filteredStaff.length.toLocaleString()} of {stats.total.toLocaleString()} government employees
        {search && ` matching "${search}"`}
      </div>

      {/* Table */}
      <Table columns={columns} data={filteredStaff} keyField="sn" loading={state.isLoading}
        emptyMessage={search || departmentFilter !== 'all' || lgaFilter !== 'all' || gradeFilter !== 'all' 
          ? "No government employees match your search criteria." 
          : "Government database is empty or still loading."} 
        size="md" onRowClick={(staff) => console.log('View staff details:', staff)} />

      {/* Footer */}
      <div style={{ backgroundColor: '#F9FAFB', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', textAlign: 'center' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>Akwa Ibom State Government Database</h4>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 0.5rem 0' }}>Official staff database covering all 31 Local Government Areas</p>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>"The Land of Promise" - Secure • Efficient • Transparent</p>
      </div>
    </div>
  );
};

export default GovernmentDatabaseTab;