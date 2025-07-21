import React from 'react';
import { Building2, Users, FileText, Settings } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { governmentOffices } from '../../data/sampleData';

const Sidebar: React.FC = () => {
  const { selectedOffice, setSelectedOffice } = useAppContext();

  const getOfficeIcon = (officeId: string) => {
    switch (officeId) {
      case 'budget-office':
        return <FileText className="w-5 h-5" />;
      case 'finance-office':
        return <Building2 className="w-5 h-5" />;
      case 'planning-office':
        return <Users className="w-5 h-5" />;
      case 'audit-office':
        return <Settings className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  return (
    <aside className="w-64 bg-white shadow-lg h-full border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-orange-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">ADS System</h2>
            <p className="text-sm text-gray-500">Government Offices</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {governmentOffices.map((office) => (
            <button
              key={office.id}
              onClick={() => office.status === 'active' && setSelectedOffice(office.name)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200
                ${selectedOffice === office.name
                  ? 'bg-gradient-to-r from-green-100 to-orange-100 text-green-800 border-l-4 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }
                ${office.status !== 'active' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              disabled={office.status !== 'active'}
            >
              <div className={`
                ${selectedOffice === office.name ? 'text-green-600' : 'text-gray-400'}
              `}>
                {getOfficeIcon(office.id)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{office.name}</div>
                <div className="text-xs text-gray-500">{office.description}</div>
              </div>
              {office.status === 'active' && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Selected Office Info */}
        {selectedOffice && (
          <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-lg border border-green-200">
            <h3 className="text-sm font-semibold text-green-800 mb-2">Selected Office</h3>
            <p className="text-sm text-green-700">{selectedOffice}</p>
            <div className="mt-2 text-xs text-green-600">
              Click "Enter" to access the office system
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;