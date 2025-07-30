// src/components/pages/StaffDashboard.tsx  
// Staff Dashboard - Beautiful Government Portal Design

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { FileText, Users, Search, Building2, MapPin, Shield, Eye } from 'lucide-react';

const StaffDashboard: React.FC = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter staff based on search
  const filteredStaff = state.staffData.filter(staff =>
    staff.nameOfOfficer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    pageBackground: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 50%, #F0FDF4 100%)'
    },
    container: {
      maxWidth: '80rem',
      margin: '0 auto',
      padding: '2rem 1rem'
    },
    header: {
      background: 'linear-gradient(135deg, var(--akwa-green) 0%, var(--akwa-orange) 100%)',
      borderRadius: '1.5rem',
      padding: '2rem',
      marginBottom: '2rem',
      color: 'white',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    welcomeCard: {
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      marginBottom: '2rem',
      border: '1px solid #F3F4F6'
    },
    avatar: {
      width: '5rem',
      height: '5rem',
      background: 'linear-gradient(135deg, var(--akwa-green) 0%, var(--akwa-orange) 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginRight: '1.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      border: '1px solid #F3F4F6',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    directoryCard: {
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      border: '1px solid #F3F4F6'
    },
    searchContainer: {
      position: 'relative' as const,
      maxWidth: '20rem'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '2.5rem',
      paddingRight: '1rem',
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
      border: '1px solid #D1D5DB',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const
    },
    tableHeader: {
      backgroundColor: '#F9FAFB',
      borderBottom: '1px solid #E5E7EB'
    },
    tableHeaderCell: {
      textAlign: 'left' as const,
      padding: '1rem',
      fontWeight: '600' as const,
      color: '#374151',
      fontSize: '0.875rem'
    },
    tableRow: {
      borderBottom: '1px solid #F3F4F6',
      transition: 'background-color 0.2s ease'
    },
    tableCell: {
      padding: '1rem',
      fontSize: '0.875rem',
      color: '#6B7280'
    },
    infoCard: {
      background: 'linear-gradient(135deg, #FFF7ED 0%, #F0FDF4 100%)',
      border: '1px solid #FED7AA',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginTop: '2rem'
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Staff Portal
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                Akwa Ibom State Budget Office • Staff Directory Access
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '1rem',
              padding: '1rem',
              textAlign: 'center' as const,
              backdropFilter: 'blur(10px)'
            }}>
              <Shield style={{ width: '2rem', height: '2rem', margin: '0 auto 0.5rem auto' }} />
              <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>Read-Only Access</p>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div style={styles.welcomeCard}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={styles.avatar}>
              {state.user?.firstName?.[0]}{state.user?.lastName?.[0]}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.25rem' }}>
                Welcome, {state.user?.firstName} {state.user?.lastName}
              </h2>
              <p style={{ color: '#6B7280', fontSize: '1rem', marginBottom: '0.5rem' }}>
                {state.user?.office} • Staff Member
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Building2 style={{ width: '1rem', height: '1rem' }} />
                  Budget Office
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin style={{ width: '1rem', height: '1rem' }} />
                  Akwa Ibom State
                </span>
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #FFF7ED 100%)',
              borderRadius: '0.75rem',
              padding: '1rem',
              textAlign: 'center' as const,
              border: '1px solid #FED7AA'
            }}>
              <Eye style={{ width: '1.5rem', height: '1.5rem', color: 'var(--akwa-green)', margin: '0 auto 0.25rem auto' }} />
              <p style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500' }}>Directory View</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div 
            style={styles.statCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#F0FDF4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <FileText style={{ width: '1.5rem', height: '1.5rem', color: 'var(--akwa-green)' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                  Total Staff Records
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937' }}>
                  {state.staffData.length.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div 
            style={styles.statCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#FFF7ED',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <Users style={{ width: '1.5rem', height: '1.5rem', color: 'var(--akwa-orange)' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                  Departments
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937' }}>
                  {new Set(state.staffData.map(s => s.department)).size}
                </p>
              </div>
            </div>
          </div>

          <div 
            style={styles.statCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #F0FDF4 0%, #FFF7ED 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <Building2 style={{ width: '1.5rem', height: '1.5rem', color: '#6B7280' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                  Local Gov. Areas
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937' }}>
                  {new Set(state.staffData.map(s => s.lga)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Directory */}
        <div style={styles.directoryCard}>
          {/* Directory Header */}
          <div style={{
            background: 'linear-gradient(135deg, #F9FAFB 0%, #FFF7ED 100%)',
            padding: '1.5rem',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                  Staff Directory
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  Browse and search through the staff database
                </p>
              </div>
              
              <div style={styles.searchContainer}>
                <Search style={{
                  width: '1rem',
                  height: '1rem',
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF'
                }} />
                <input
                  type="text"
                  placeholder="Search staff, department, rank..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                  onFocus={(e) => e.target.style.borderColor = 'var(--akwa-green)'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ padding: '1.5rem' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.tableHeaderCell}>S/N</th>
                    <th style={styles.tableHeaderCell}>Name of Officer</th>
                    <th style={styles.tableHeaderCell}>Rank</th>
                    <th style={styles.tableHeaderCell}>Grade Level</th>
                    <th style={styles.tableHeaderCell}>Department</th>
                    <th style={styles.tableHeaderCell}>LGA</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff, index) => (
                    <tr 
                      key={staff.sn} 
                      style={styles.tableRow}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{...styles.tableCell, fontWeight: '500', color: '#374151'}}>
                        {staff.sn}
                      </td>
                      <td style={{...styles.tableCell, fontWeight: '600', color: '#1F2937'}}>
                        {staff.nameOfOfficer}
                      </td>
                      <td style={styles.tableCell}>{staff.rank}</td>
                      <td style={styles.tableCell}>
                        <span style={{
                          backgroundColor: '#F0FDF4',
                          color: 'var(--akwa-green)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {staff.gradeLevel}
                        </span>
                      </td>
                      <td style={styles.tableCell}>{staff.department}</td>
                      <td style={styles.tableCell}>{staff.lga}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStaff.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}>
                  <Search style={{ width: '1.5rem', height: '1.5rem', color: '#9CA3AF' }} />
                </div>
                <p style={{ color: '#6B7280', fontSize: '1rem', marginBottom: '0.5rem' }}>
                  No staff found matching your search
                </p>
                <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                  Try adjusting your search terms or browse all records
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Card */}
        <div style={styles.infoCard}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: '#FFF7ED',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem',
              marginTop: '0.125rem'
            }}>
              <Shield style={{ width: '1.25rem', height: '1.25rem', color: 'var(--akwa-orange)' }} />
            </div>
            <div>
              <h5 style={{
                fontWeight: '600',
                color: '#1F2937',
                fontSize: '1rem',
                marginBottom: '0.5rem'
              }}>
                Staff Portal Access Information
              </h5>
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                lineHeight: '1.5',
                margin: 0
              }}>
                <strong>Read-Only Access:</strong> You have view-only permissions to browse the staff directory and contact information. 
                For data updates, user management, or administrative tasks, please contact your ICT Administrator or Director. 
                All activities in this portal are monitored and logged for security purposes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Variables */}
      <style>{`
        :root {
          --akwa-green: #16a34a;
          --akwa-orange: #ea580c;
        }
      `}</style>
    </div>
  );
};

export default StaffDashboard;