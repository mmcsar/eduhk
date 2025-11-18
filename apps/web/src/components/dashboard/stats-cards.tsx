'use client';

import { Truck, Clock, CheckCircle, DollarSign } from 'lucide-react';

const stats = [
  { name: 'Active Missions', value: '12', icon: Truck, change: '+4.75%', changeType: 'positive' },
  { name: 'Pending', value: '8', icon: Clock, change: '+2.02%', changeType: 'positive' },
  { name: 'Completed', value: '145', icon: CheckCircle, change: '+12.5%', changeType: 'positive' },
  { name: 'Revenue', value: '$48.5K', icon: DollarSign, change: '+8.2%', changeType: 'positive' },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(stat => (
        <div key={stat.name} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <stat.icon className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-green-600">{stat.change}</span>
          </div>
          <div className="text-2xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.name}</div>
        </div>
      ))}
    </div>
  );
}
