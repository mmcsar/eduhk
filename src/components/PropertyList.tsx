import React from 'react';

// Mock data
const MOCK_PROPERTIES = [
  {
    id: '1',
    title: 'Villa 4 chambres Golf',
    price: 250000,
    currency: 'USD',
    location: 'Golf, Lubumbashi',
    type: 'Villa',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=400',
    views: 124,
    leads: 5
  },
  {
    id: '2',
    title: 'Appartement Centre Ville',
    price: 1200,
    currency: 'USD',
    location: 'Centre Ville',
    type: 'Apartment',
    status: 'rent',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
    views: 89,
    leads: 12
  },
  {
    id: '3',
    title: 'Terrain Lubumbashi Nord',
    price: 45000,
    currency: 'USD',
    location: 'Luano',
    type: 'Land',
    status: 'sold',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400',
    views: 450,
    leads: 2
  }
];

export function PropertyList({ adminMode = false }: { adminMode?: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_PROPERTIES.map((prop) => (
        <div key={prop.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="relative h-48 bg-gray-200">
            <img 
              src={prop.image} 
              alt={prop.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
              {prop.status === 'rent' ? 'A Louer' : prop.status === 'sold' ? 'Vendu' : 'A Vendre'}
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{prop.title}</h3>
                <p className="text-sm text-gray-500">{prop.location}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-700">
                  {prop.currency === 'USD' ? '$' : ''}{prop.price.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
              <div className="flex gap-4">
                <span title="Vues">👁 {prop.views}</span>
                <span title="Leads" className="text-blue-600 font-medium">📬 {prop.leads} leads</span>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Gérer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
