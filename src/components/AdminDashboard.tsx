import React, { useState } from 'react';
import { PropertyList } from './PropertyList';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'properties'>('overview');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Propriétés Actives', val: '24', color: 'bg-blue-50 text-blue-700' },
          { label: 'Ventes ce mois', val: '3', color: 'bg-green-50 text-green-700' },
          { label: 'Total Leads', val: '156', color: 'bg-purple-50 text-purple-700' },
          { label: 'Revenue Est.', val: '$12.5k', color: 'bg-orange-50 text-orange-700' },
        ].map((stat) => (
          <div key={stat.label} className={`p-6 rounded-xl border border-gray-100 shadow-sm ${stat.color}`}>
            <div className="text-sm font-medium opacity-80">{stat.label}</div>
            <div className="text-3xl font-bold mt-2">{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex gap-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`text-sm font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600 -mb-4 pb-4' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Vue d'ensemble
          </button>
          <button 
             onClick={() => setActiveTab('agents')}
             className={`text-sm font-medium ${activeTab === 'agents' ? 'text-blue-600 border-b-2 border-blue-600 -mb-4 pb-4' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Agents
          </button>
          <button 
             onClick={() => setActiveTab('properties')}
             className={`text-sm font-medium ${activeTab === 'properties' ? 'text-blue-600 border-b-2 border-blue-600 -mb-4 pb-4' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Toutes les Propriétés
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="text-center py-10 text-gray-500">
              Graphiques et tendances ici (à venir)
            </div>
          )}
          {activeTab === 'agents' && (
             <div className="text-center py-10 text-gray-500">
               Liste des agents et performances
             </div>
          )}
          {activeTab === 'properties' && (
            <PropertyList adminMode />
          )}
        </div>
      </div>
    </div>
  );
}
