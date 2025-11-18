'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Truck,
  MapPin,
  DollarSign,
  ShoppingCart,
  FileText,
  Settings,
  Users,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Missions', href: '/missions', icon: Truck },
  { name: 'Tracking', href: '/tracking', icon: MapPin },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
  { name: 'Payments', href: '/payments', icon: DollarSign },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Vehicles', href: '/vehicles', icon: Truck },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">TMSA</h1>
        <p className="text-sm text-gray-500">Transport Hub</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map(item => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
