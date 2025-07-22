// src/components/common/Badge.tsx
// Reusable Badge Component for Status Indicators

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: boolean;
  outlined?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  rounded = true,
  outlined = false,
  className = '',
  style = {},
  onClick
}) => {
  // Size configurations
  const sizeConfig = {
    xs: { padding: '0.125rem 0.375rem', fontSize: '0.625rem' },
    sm: { padding: '0.25rem 0.5rem', fontSize: '0.75rem' },
    md: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
    lg: { padding: '0.5rem 1rem', fontSize: '1rem' }
  };

  // Variant configurations (solid background)
  const solidVariants = {
    default: {
      backgroundColor: '#F3F4F6',
      color: '#374151',
      border: undefined
    },
    success: {
      backgroundColor: '#DCFCE7',
      color: '#166534',
      border: undefined
    },
    warning: {
      backgroundColor: '#FEF3C7',
      color: '#92400E',
      border: undefined
    },
    danger: {
      backgroundColor: '#FEE2E2',
      color: '#DC2626',
      border: undefined
    },
    info: {
      backgroundColor: '#DBEAFE',
      color: '#1E40AF',
      border: undefined
    },
    primary: {
      backgroundColor: '#F0FDF4',
      color: 'var(--akwa-green)',
      border: undefined
    },
    secondary: {
      backgroundColor: '#FFF7ED',
      color: 'var(--akwa-orange)',
      border: undefined
    }
  };

  // Variant configurations (outlined)
  const outlinedVariants = {
    default: {
      backgroundColor: 'transparent',
      color: '#374151',
      border: '1px solid #D1D5DB'
    },
    success: {
      backgroundColor: 'transparent',
      color: '#166534',
      border: '1px solid #22C55E'
    },
    warning: {
      backgroundColor: 'transparent',
      color: '#92400E',
      border: '1px solid #F59E0B'
    },
    danger: {
      backgroundColor: 'transparent',
      color: '#DC2626',
      border: '1px solid #EF4444'
    },
    info: {
      backgroundColor: 'transparent',
      color: '#1E40AF',
      border: '1px solid #3B82F6'
    },
    primary: {
      backgroundColor: 'transparent',
      color: 'var(--akwa-green)',
      border: '1px solid var(--akwa-green)'
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--akwa-orange)',
      border: '1px solid var(--akwa-orange)'
    }
  };

  const sizeStyles = sizeConfig[size];
  const variantStyles = outlined ? outlinedVariants[variant] : solidVariants[variant];

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: sizeStyles.padding,
    fontSize: sizeStyles.fontSize,
    fontWeight: '500',
    borderRadius: rounded ? '9999px' : '0.375rem',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    border: variantStyles.border || 'none',
    backgroundColor: variantStyles.backgroundColor,
    color: variantStyles.color,
    whiteSpace: 'nowrap',
    ...style
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (onClick) {
      e.currentTarget.style.opacity = '0.8';
      e.currentTarget.style.transform = 'scale(1.05)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (onClick) {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.transform = 'scale(1)';
    }
  };

  return (
    <span
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={badgeStyle}
      className={className}
    >
      {children}
    </span>
  );
};

// Helper function to auto-detect status variant
export const getStatusVariant = (status: string): BadgeProps['variant'] => {
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('active') || statusLower.includes('approved') || statusLower.includes('success')) {
    return 'success';
  }
  
  if (statusLower.includes('pending') || statusLower.includes('waiting') || statusLower.includes('review')) {
    return 'warning';
  }
  
  if (statusLower.includes('rejected') || statusLower.includes('failed') || statusLower.includes('error')) {
    return 'danger';
  }
  
  if (statusLower.includes('info') || statusLower.includes('draft')) {
    return 'info';
  }
  
  return 'default';
};

// Helper function for grade level badges
export const GradeLevelBadge: React.FC<{ gradeLevel: string }> = ({ gradeLevel }) => (
  <Badge variant="primary" size="sm">
    {gradeLevel}
  </Badge>
);

// Helper function for status badges
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <Badge variant={getStatusVariant(status)} size="sm">
    {status}
  </Badge>
);

// Helper function for remarks badges
export const RemarksBadge: React.FC<{ remarks: string }> = ({ remarks }) => {
  let variant: BadgeProps['variant'] = 'default';
  
  if (remarks.toLowerCase().includes('retirement')) {
    variant = 'warning';
  } else if (remarks.toLowerCase().includes('leave')) {
    variant = 'info';
  } else if (remarks.toLowerCase().includes('excellent') || remarks.toLowerCase().includes('good')) {
    variant = 'success';
  }
  
  return (
    <Badge variant={variant} size="xs">
      {remarks}
    </Badge>
  );
};

export default Badge;

// Usage Examples:

// Basic badge
// <Badge>Default</Badge>

// Status badge with auto-detection
// <StatusBadge status="ACTIVE" />
// <StatusBadge status="PENDING_APPROVAL" />

// Grade level badge
// <GradeLevelBadge gradeLevel="GL-14" />

// Custom badge
// <Badge variant="success" size="lg" outlined>
//   Approved
// </Badge>

// Clickable badge
// <Badge variant="primary" onClick={() => console.log('clicked')}>
//   Clickable
// </Badge>