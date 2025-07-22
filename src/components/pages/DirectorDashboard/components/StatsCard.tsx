// src/components/pages/DirectorDashboard/components/StatsCard.tsx
// Reusable Stats Card Component for Dashboard Metrics

import React from 'react';

export interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  subtitle?: string;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  subtitle,
  loading = false,
  onClick,
  className = '',
  size = 'md'
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      padding: '1rem',
      iconSize: '1.25rem',
      valueSize: '1.5rem',
      titleSize: '0.8rem'
    },
    md: {
      padding: '1.5rem',
      iconSize: '1.5rem',
      valueSize: '1.875rem',
      titleSize: '0.875rem'
    },
    lg: {
      padding: '2rem',
      iconSize: '2rem',
      valueSize: '2.25rem',
      titleSize: '1rem'
    }
  };

  const config = sizeConfig[size];

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: config.padding,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    border: '1px solid #F3F4F6',
    position: 'relative',
    overflow: 'hidden'
  };

  const iconStyle: React.CSSProperties = {
    backgroundColor: color,
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'fit-content',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const valueStyle: React.CSSProperties = {
    fontSize: config.valueSize,
    fontWeight: 'bold',
    color: '#111827',
    margin: '0.5rem 0 0 0',
    lineHeight: '1'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: config.titleSize,
    fontWeight: '500',
    color: '#6B7280',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }
  };

  if (loading) {
    return (
      <div style={cardStyle} className={className}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Loading Icon Skeleton */}
          <div
            style={{
              ...iconStyle,
              backgroundColor: '#E5E7EB',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          >
            <div style={{ width: config.iconSize, height: config.iconSize }} />
          </div>
          
          <div style={{ marginLeft: '1rem', flex: 1 }}>
            {/* Loading Title Skeleton */}
            <div
              style={{
                height: '1rem',
                backgroundColor: '#E5E7EB',
                borderRadius: '0.25rem',
                marginBottom: '0.5rem',
                width: '60%',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
            
            {/* Loading Value Skeleton */}
            <div
              style={{
                height: '2rem',
                backgroundColor: '#E5E7EB',
                borderRadius: '0.25rem',
                width: '40%',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={cardStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Decorative Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          width: '80px',
          height: '80px',
          backgroundColor: color,
          opacity: 0.05,
          borderRadius: '50%',
          zIndex: 0
        }}
      />
      
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* Icon Section */}
        <div style={iconStyle}>
          <div style={{ width: config.iconSize, height: config.iconSize }}>
            {icon}
          </div>
        </div>
        
        {/* Content Section */}
        <div style={{ marginLeft: '1rem', flex: 1 }}>
          <p style={titleStyle}>{title}</p>
          <p style={valueStyle}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {/* Subtitle */}
          {subtitle && (
            <p style={{
              fontSize: '0.75rem',
              color: '#9CA3AF',
              margin: '0.25rem 0 0 0'
            }}>
              {subtitle}
            </p>
          )}
          
          {/* Trend Indicator */}
          {trend && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '0.5rem'
            }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: trend.isPositive ? '#10B981' : '#EF4444',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {trend.isPositive ? '↗️' : '↘️'}
                {Math.abs(trend.value)}%
              </span>
              {trend.label && (
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginLeft: '0.5rem'
                }}>
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Click Indicator */}
      {onClick && (
        <div style={{
          position: 'absolute',
          bottom: '0.5rem',
          right: '0.5rem',
          fontSize: '0.75rem',
          color: '#9CA3AF'
        }}>
          →
        </div>
      )}
    </div>
  );
};

// Predefined color variants for common use cases
export const StatsCardVariants = {
  primary: 'var(--akwa-green)',
  secondary: 'var(--akwa-orange)',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  purple: '#8B5CF6',
  indigo: '#6366F1'
};

// Helper component for government stats
export const GovernmentStatsCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  variant: keyof typeof StatsCardVariants;
  trend?: StatsCardProps['trend'];
  onClick?: () => void;
}> = ({ title, value, icon, variant, trend, onClick }) => (
  <StatsCard
    title={title}
    value={value}
    icon={icon}
    color={StatsCardVariants[variant]}
    trend={trend}
    onClick={onClick}
  />
);

export default StatsCard;

