// src/components/common/Table.tsx
// Reusable Table Component for Director Dashboard

import React from 'react';

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  keyField?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  striped?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: any) => void;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  keyField = 'id',
  className = '',
  size = 'md',
  bordered = true,
  striped = false,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { padding: '0.5rem', fontSize: '0.8rem' },
    md: { padding: '0.75rem', fontSize: '0.875rem' },
    lg: { padding: '1rem', fontSize: '0.9rem' }
  };

  const config = sizeConfig[size];

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        border: bordered ? '1px solid #E5E7EB' : 'none',
        borderRadius: '0.5rem',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '3px solid #E5E7EB',
          borderTop: '3px solid var(--akwa-green)',
          borderRadius: '50%',
          margin: '0 auto 1rem auto',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6B7280', margin: 0 }}>Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        border: bordered ? '1px solid #E5E7EB' : 'none',
        borderRadius: '0.5rem',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#6B7280', margin: 0 }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: bordered ? '1px solid #E5E7EB' : 'none',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }} className={className}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: config.fontSize
        }}>
          {/* Table Header */}
          <thead style={{ backgroundColor: '#F9FAFB' }}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  style={{
                    padding: config.padding,
                    textAlign: column.align || 'left',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    borderRight: bordered && index < columns.length - 1 ? '1px solid #E5E7EB' : 'none',
                    width: column.width || 'auto',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row[keyField] || rowIndex}
                style={{
                  borderTop: rowIndex > 0 ? '1px solid #E5E7EB' : 'none',
                  backgroundColor: striped && rowIndex % 2 === 1 ? '#F9FAFB' : 'white',
                  cursor: onRowClick ? 'pointer' : 'default'
                }}
                onClick={() => onRowClick?.(row)}
                onMouseEnter={(e) => {
                  if (onRowClick) {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (onRowClick) {
                    e.currentTarget.style.backgroundColor = striped && rowIndex % 2 === 1 ? '#F9FAFB' : 'white';
                  }
                }}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key}
                    style={{
                      padding: config.padding,
                      textAlign: column.align || 'left',
                      color: '#111827',
                      borderRight: bordered && colIndex < columns.length - 1 ? '1px solid #E5E7EB' : 'none',
                      verticalAlign: 'top'
                    }}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key] || '-'
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

// Add CSS animation for loading spinner (add this to your global CSS)
/*
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/