// src/App.tsx

import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import HomePage from './components/pages/HomePage';
import BudgetOfficePage from './components/pages/BudgetOfficePage';
import DatabasePage from './components/pages/DatabasePage';

const AppContent: React.FC = () => {
  const { state } = useAppContext();

  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'home':
        return <HomePage />;
      case 'budget-office':
        return <BudgetOfficePage />;
      case 'database':
        return <DatabasePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;