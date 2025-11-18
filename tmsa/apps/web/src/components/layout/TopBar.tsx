'use client';

import { Bell, Languages, ShieldCheck } from 'lucide-react';
import { useLocale, useTranslations } from '@/lib/i18n/client';
import { Button } from '@/components/ui/button';

export function TopBar() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <header className="glass-panel mb-6 flex items-center justify-between rounded-3xl px-6 py-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">{t('tagline')}</p>
        <h1 className="text-2xl font-semibold">{t('dashboard.welcome')}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase text-white/70">
          {locale.toUpperCase()}
        </span>
        <Button variant="ghost" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          SOC Active
        </Button>
        <Button className="hidden md:inline-flex">
          <Languages className="h-4 w-4" /> {t('cta')}
        </Button>
      </div>
    </header>
  );
}
