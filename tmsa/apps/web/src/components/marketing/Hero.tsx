'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n/client';

export function Hero() {
  const t = useTranslations();

  return (
    <section className="glass-panel relative overflow-hidden px-8 py-12">
      <div className="relative z-10 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.5em] text-amber-300">TMSA</p>
        <h1 className="gradient-text mb-4 text-4xl font-bold leading-tight md:text-5xl">
          {t('heroTitle')}
        </h1>
        <p className="mb-8 text-lg text-white/80">{t('heroSubtitle')}</p>
        <div className="flex flex-wrap gap-4">
          <Button>{t('cta')}</Button>
          <Button variant="outline">Download deck</Button>
        </div>
      </div>
      <div className="absolute -right-16 bottom-0 top-0 hidden md:block">
        <div className="h-full w-80 rounded-full bg-gradient-to-b from-sky-500/30 to-transparent blur-3xl" />
      </div>
    </section>
  );
}
