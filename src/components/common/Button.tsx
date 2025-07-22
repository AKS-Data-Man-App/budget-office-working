// src/components/common/Button.tsx
// Reusable Button Component for Director Dashboard

import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  style = {}
}) => {
  // Size configurations
  const sizeConfig = {
    xs: { padding: '0.25rem 0.5rem', fontSize: '0.75rem', iconSize: '0.875rem' },
    sm: { padding: '0.375rem 0.75rem', fontSize: '0.875rem', iconSize: '1rem' },
    md: { padding: '0.5rem 1rem', fontSize: '0.875rem', iconSize: '1rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1rem', iconSize: '1.25rem' },
    xl: { padding: '1rem 2rem', fontSize: '1.125rem', iconSize: '1.5rem' }
  };

  // Variant configurations
  const variantConfig = {
    primary: {
      backgroundColor: 'var(--akwa-green)',
      background: undefined,
      color: 'white',
      border: 'none',
      hover: { backgroundColor: '#059669', background: undefined }
    },
    secondary: {
      backgroundColor: 'white',
      background: undefined,
      color: '#374151',
      border: '1px solid #D1D5DB',
      hover: { backgroundColor: '#F9FAFB', background: undefined }
    },
    success: {
      backgroundColor: '#10B981',
      background: undefined,
      color: 'white',
      border: 'none',
      hover: { backgroundColor: '#059669', background: undefined }
    },
    danger: {
      backgroundColor: '#EF4444',
      background: undefined,
      color: 'white',
      border: 'none',
      hover: { backgroundColor: '#DC2626', background: undefined }
    },
    warning: {
      backgroundColor: '#F59E0B',
      background: undefined,
      color: 'white',
      border: 'none',
      hover: { backgroundColor: '#D97706', background: undefined }
    },
    ghost: {
      backgroundColor: 'transparent',
      background: undefined,
      color: '#6B7280',
      border: 'none',
      hover: { backgroundColor: '#F3F4F6', background: undefined, color: '#374151' }
    },
    gradient: {
      backgroundColor: undefined,
      background: 'linear-gradient(135deg, var(--akwa-green) 0%, var(--akwa-orange) 100%)',
      color: 'white',
      border: 'none',
      hover: { backgroundColor: undefined, background: 'linear-gradient(135deg, #059669 0%, #EA580C 100%)' }
    }
  };

  const sizeStyles = sizeConfig[size];
  const variantStyles = variantConfig[variant];

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: icon ? '0.5rem' : '0',
    padding: sizeStyles.padding,
    fontSize: sizeStyles.fontSize,
    fontWeight: '500',
    borderRadius: '0.5rem',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    border: variantStyles.border || 'none',
    backgroundColor: variantStyles.backgroundColor || 'transparent',
    background: variantStyles.background || variantStyles.backgroundColor || 'transparent',
    color: variantStyles.color,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    boxShadow: variant !== 'ghost' && variant !== 'secondary' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
    ...style
  };

  const iconStyle: React.CSSProperties = {
    width: sizeStyles.iconSize,
    height: sizeStyles.iconSize,
    flexShrink: 0
  };

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && variantStyles.hover) {
      const target = e.currentTarget;
      Object.assign(target.style, variantStyles.hover);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      const target = e.currentTarget;
      target.style.backgroundColor = variantStyles.backgroundColor || 'transparent';
      target.style.background = variantStyles.background || variantStyles.backgroundColor || 'transparent';
      target.style.color = variantStyles.color;
    }
  };

  const renderIcon = () => {
    if (loading) {
      return (
        <div
          style={{
            ...iconStyle,
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      );
    }
    
    if (icon) {
      return <span style={iconStyle}>{icon}</span>;
    }
    
    return null;
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={buttonStyle}
      className={className}
      disabled={disabled || loading}
    >
      {iconPosition === 'left' && renderIcon()}
      {loading ? 'Loading...' : children}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default Button;

