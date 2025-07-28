// src/components/pages/ICTDashboard/components/StaffDatabaseTab.tsx
// Staff Database Tab with Search and Management Features

import React, { useState, useMemo } from 'react';
import { Search, Download, Edit, Trash2 } from 'lucide-react';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';

interface StaffDatabaseTabProps {
  staffData: any[];
}

const StaffDatabaseTab: React.FC<StaffDatabaseTabProps> = ({ staffData }) => {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Filter and search staff data
  const { filteredStaff, departments } = useMemo(() => {
    const data = staffData || [];
    
    const filtered = data.filter((staff: any) => {
      const searchMatch = !search || 
        `${staff.firstName} ${staff.lastName} ${staff.rank} ${staff.department?.name || staff.department}`
          .toLowerCase().includes(search.toLowerCase());
      
      const deptMatch = departmentFilter === 'all' || 
        (staff.department?.name || staff.department) === departmentFilter;
      
      return searchMatch && deptMatch;
    });

    const departments = Array.from(
      new Set(data.map((s: any) => s.department?.name || s.department))
    ).filter(Boolean).sort();

    return { filteredStaff: filtered, departments };
  }, [staffData, search, departmentFilter]);

  // Helper function for grade level colors
  const getGradeColor = (grade: string) => {
    if (!grade) return 'default';
    const level = parseInt(grade.replace('GL-', ''));
    return level >= 17 ? 'danger' : level >= 15 ? 'warning' : level >= 12 ? 'primary' : 'info';
  };

  // Handle staff actions
  const handleEditStaff = (staff: any) => {
    console.log('Edit staff:', staff);
    // TODO: Open edit modal
  };

  const handleDeleteStaff = (staff: any) => {
    if (confirm(`Are you sure you want to delete ${staff.firstName} ${staff.lastName}?`)) {
      console.log('Delete staff:', staff);
      // TODO: Call delete API
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#111827', 
            margin: '0 0 0.5rem 0' 
          }}>
            Staff Nominal Roll Database
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
            Complete government staff records and management
          </p>
        </div>
        
        <Button 
          variant="success" 
          size="sm" 
          icon={<Download />}
          onClick={() => {
            console.log(`Exporting ${filteredStaff.length} staff records...`);
            alert(`Exporting ${filteredStaff.length} records to Excel...`);
          }}
        >
          Export Database
        </Button>
      </div>

      {/* Search and Filters */}
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
        {/* Search Bar */}
        <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
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
            placeholder="Search by name, rank, or department..."
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

        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          style={{
            padding: '0.75rem',
            border: '1px solid #D1D5DB',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            minWidth: '150px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* Clear Filters */}
        {(search || departmentFilter !== 'all') && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setSearch('');
              setDepartmentFilter('all');
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Results Summary */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
        Showing {filteredStaff.length} of {staffData.length} staff records
        {search && ` matching "${search}"`}
      </div>

      {/* Staff Table */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  borderBottom: '1px solid #E5E7EB' 
                }}>
                  S/N
                </th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  borderBottom: '1px solid #E5E7EB' 
                }}>
                  Name
                </th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  borderBottom: '1px solid #E5E7EB' 
                }}>
                  Employee ID
                </th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  borderBottom: '1px solid #E5E7EB' 
                }}>
                  Rank
                </th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  borderBottom: '1px solid #E5E7EB' 
                }}>
                  Grade Level
                </th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  borderBottom: '1px solid #E5E7EB' 
                }}>
                  Department
                </th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  borderBottom: '1px solid #E5E7EB' 
                }}>
                  Status
                </th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'center', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  borderBottom: '1px solid #E5E7EB' 
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td 
                    colSpan={8} 
                    style={{ 
                      padding: '2rem', 
                      textAlign: 'center', 
                      color: '#6B7280', 
                      fontSize: '0.875rem' 
                    }}
                  >
                    {search || departmentFilter !== 'all' 
                      ? 'No staff records match your filters.' 
                      : 'No staff records found.'}
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff, index) => (
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
                    <td style={{ padding: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>
                          {staff.firstName} {staff.lastName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {staff.sex} • {staff.lga}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                      {staff.employeeId}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                      {staff.rank}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div>
                        <Badge variant={getGradeColor(staff.gradeLevel)} size="sm">
                          {staff.gradeLevel}
                        </Badge>
                        {staff.step && (
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                            Step {staff.step}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                      {staff.department?.name || staff.department}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <Badge 
                        variant={staff.status === 'ACTIVE' ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {staff.status || 'Active'}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEditStaff(staff)}
                          style={{
                            padding: '0.25rem',
                            border: 'none',
                            borderRadius: '0.25rem',
                            backgroundColor: 'var(--akwa-green)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Edit Staff"
                        >
                          <Edit style={{ width: '0.875rem', height: '0.875rem' }} />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff)}
                          style={{
                            padding: '0.25rem',
                            border: 'none',
                            borderRadius: '0.25rem',
                            backgroundColor: '#EF4444',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Delete Staff"
                        >
                          <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
                        </button>
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

export default StaffDatabaseTab;