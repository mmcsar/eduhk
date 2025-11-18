'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Map, Store, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/lib/i18n/client';

const items = [
  { href: '/dashboard', icon: Compass, key: 'dashboard' },
  { href: '/tracking', icon: Map, key: 'tracking' },
  { href: '/marketplace', icon: Store, key: 'marketplace' },
  { href: '/admin', icon: Shield, key: 'admin' },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <aside className="glass-panel hidden w-64 flex-shrink-0 flex-col p-6 text-sm lg:flex">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">TMSA</p>
        <p className="text-lg font-semibold text-white">Africa Transport Hub</p>
      </div>
      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-full px-4 py-2 text-white/70 transition-colors',
                active ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{t(`nav.${item.key}`)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/20 to-slate-900 p-4">
        <p className="text-xs uppercase text-emerald-200">Corridor Health</p>
        <p className="text-2xl font-bold">98.2%</p>
        <p className="text-xs text-white/70">SLA missions respectées ce mois</p>
      </div>
    </aside>
  );
}
