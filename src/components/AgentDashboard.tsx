import React, { useState } from 'react';
import { PropertyList } from './PropertyList';
import { AddPropertyModal } from './AddPropertyModal';

export function AgentDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (data: any) => {
    console.log('New Property:', data);
    // TODO: Send to Supabase
    // In a real app, this would trigger a mutation
    alert("Propriété ajoutée (simulation) !");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mes Propriétés</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2"
        >
          <span>➕</span> Nouvelle Propriété
        </button>
      </div>

      <PropertyList />

      {isModalOpen && (
        <AddPropertyModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}
