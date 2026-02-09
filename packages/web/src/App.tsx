import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import Goals from './pages/Goals';
import FeedbackPage from './pages/FeedbackPage';
import Coaches from './pages/Coaches';

export type Page = 'dashboard' | 'sessions' | 'goals' | 'feedback' | 'coaches';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'sessions':
        return <Sessions />;
      case 'goals':
        return <Goals />;
      case 'feedback':
        return <FeedbackPage />;
      case 'coaches':
        return <Coaches />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}
