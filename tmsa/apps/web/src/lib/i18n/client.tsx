'use client';

import { createContext, useContext, useMemo } from 'react';
import type { Locale, Messages } from './locales';

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ locale, messages, children }: LocaleContextValue & { children: React.ReactNode }) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('LocaleProvider missing');
  }
  return ctx.locale;
}

export function useTranslations() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('LocaleProvider missing');
  }

  return (path: string) => {
    const segments = path.split('.');
    let current: any = ctx.messages;
    for (const segment of segments) {
      if (current && segment in current) {
        current = current[segment];
      } else {
        return path;
      }
    }
    return typeof current === 'string' ? current : path;
  };
}
