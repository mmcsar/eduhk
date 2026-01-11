import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropertyList } from './components/PropertyList';
import { AgentDashboard } from './components/AgentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Login } from './components/Login';

// Mock Auth State for dev
const MOCK_USER = {
  id: '1',
  role: 'admin', // or 'agent', 'client'
  name: 'Admin User'
};

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState<any>(null); // Start logged out
  const [isPublic, setIsPublic] = useState(false);

  const handleLogin = (role: string) => {
    setUser({ ...MOCK_USER, role });
    setIsPublic(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsPublic(false);
  };

  const handlePublicAccess = () => {
    setIsPublic(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setUser(null); setIsPublic(false); }}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="text-xl font-bold text-blue-900 tracking-tight">MMC Immo</span>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {user.name} ({user.role})
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Déconnexion
                </button>
              </div>
            ) : isPublic && (
              <button 
                  onClick={() => setIsPublic(false)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Se connecter
                </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {user ? (
             user.role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <AgentDashboard />
            )
          ) : isPublic ? (
            <div className="space-y-6">
              <div className="text-center pb-8">
                <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Trouvez votre bien idéal à Lubumbashi</h1>
                <p className="text-xl text-gray-600">Maisons, Villas, Appartements et Terrains</p>
              </div>
              <PropertyList />
            </div>
          ) : (
            <Login onLogin={handleLogin} onPublicAccess={handlePublicAccess} />
          )}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
