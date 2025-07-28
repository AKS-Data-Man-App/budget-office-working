// src/components/pages/ICTDashboard/components/StatsCards.tsx
// Beautiful Stats Cards with Akwa Ibom Colors

import React from 'react';
import { FileText, Users, Database, UserPlus } from 'lucide-react';

interface StatsCardsProps {
  staffCount: number;
  userCount: number;
  onCreateStaff: () => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({ 
  staffCount, 
  userCount, 
  onCreateStaff 
}) => {
  // Calculate derived stats
  const activeStaff = staffCount; // Assuming all staff are active for now
  const departments = Math.max(2, Math.ceil(staffCount / 5)); // Estimate departments

  const stats = [
    {
      title: 'Staff Records',
      value: staffCount,
      icon: FileText,
      gradient: 'linear-gradient(135deg, var(--akwa-green) 0%, #22C55E 100%)',
      subtitle: 'Government database'
    },
    {
      title: 'System Users',
      value: userCount,
      icon: Users,
      gradient: 'linear-gradient(135deg, var(--akwa-orange) 0%, #F97316 100%)',
      subtitle: 'Active accounts'
    },
    {
      title: 'Active Staff',
      value: activeStaff,
      icon: Database,
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      subtitle: 'Currently employed'
    }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '1.5rem'
    }}>
      {/* Stats Cards */}
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={index}
            style={{
              background: stat.gradient,
              color: 'white',
              padding: '1.5rem',
              borderRadius: '1rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '1rem' 
              }}>
                <Icon style={{ width: '2rem', height: '2rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {stat.value}
                </div>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '500' }}>
                {stat.title}
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                {stat.subtitle}
              </div>
            </div>
            
            {/* Decorative Circle */}
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
        );
      })}

      {/* Create Staff Action Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
        onClick={onCreateStaff}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '1rem' }}>
            <UserPlus style={{ width: '3rem', height: '3rem' }} />
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Create New Staff
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            Add to database
          </div>
        </div>
        
        {/* Decorative Circle */}
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
  );
};

export default StatsCards;