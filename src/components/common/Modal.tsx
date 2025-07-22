// src/components/common/Modal.tsx
// Reusable Modal Component for Dialogs and Forms

import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  style?: React.CSSProperties;
  footer?: React.ReactNode;
  header?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  style = {},
  footer,
  header
}) => {
  // Size configurations
  const sizeConfig = {
    xs: { maxWidth: '20rem', margin: '1rem' },
    sm: { maxWidth: '24rem', margin: '1rem' },
    md: { maxWidth: '28rem', margin: '1rem' },
    lg: { maxWidth: '32rem', margin: '1rem' },
    xl: { maxWidth: '42rem', margin: '1rem' },
    full: { maxWidth: '95vw', margin: '1rem' }
  };

  const sizeStyles = sizeConfig[size];

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: sizeStyles.margin,
    backdropFilter: 'blur(2px)'
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    maxWidth: sizeStyles.maxWidth,
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid #E5E7EB',
    overflow: 'hidden',
    animation: 'modalFadeIn 0.2s ease-out',
    ...style
  };

  const headerStyle: React.CSSProperties = {
    padding: '1.5rem 1.5rem 0 1.5rem',
    borderBottom: title || header ? '1px solid #E5E7EB' : 'none',
    paddingBottom: title || header ? '1rem' : '0'
  };

  const bodyStyle: React.CSSProperties = {
    padding: '1.5rem',
    flex: 1,
    overflowY: 'auto'
  };

  const footerStyle: React.CSSProperties = {
    padding: '1rem 1.5rem 1.5rem 1.5rem',
    borderTop: footer ? '1px solid #E5E7EB' : 'none',
    backgroundColor: '#F9FAFB'
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6B7280',
    padding: '0.25rem',
    borderRadius: '0.375rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    transition: 'all 0.2s ease'
  };

  return (
    <div
      style={overlayStyle}
      className={overlayClassName}
      onClick={handleOverlayClick}
    >
      <div
        style={contentStyle}
        className={`${contentClassName} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        {(title || header || showCloseButton) && (
          <div style={{ ...headerStyle, position: 'relative' }}>
            {/* Custom Header or Title */}
            {header || (title && (
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0,
                  paddingRight: showCloseButton ? '2rem' : '0'
                }}>
                  {title}
                </h3>
              </div>
            ))}
            
            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={closeButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6B7280';
                }}
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Body Section */}
        <div style={bodyStyle}>
          {children}
        </div>

        {/* Footer Section */}
        {footer && (
          <div style={footerStyle}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Confirmation Modal Component
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false
}) => {
  const variantStyles = {
    danger: { color: '#DC2626', backgroundColor: '#FEE2E2' },
    warning: { color: '#D97706', backgroundColor: '#FEF3C7' },
    info: { color: '#2563EB', backgroundColor: '#DBEAFE' }
  };

  const buttonStyles = {
    danger: '#DC2626',
    warning: '#D97706',
    info: 'var(--akwa-green)'
  };

  const footer = (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
      <button
        onClick={onClose}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          border: '1px solid #D1D5DB',
          borderRadius: '0.5rem',
          backgroundColor: 'white',
          color: '#374151',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '0.5rem',
          backgroundColor: buttonStyles[variant],
          color: 'white',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Processing...' : confirmText}
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" footer={footer}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            flexShrink: 0,
            ...variantStyles[variant]
          }}
        >
          {variant === 'danger' ? '⚠️' : variant === 'warning' ? '⚠️' : 'ℹ️'}
        </div>
        <div>
          <p style={{ margin: 0, color: '#374151', lineHeight: '1.5' }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;

