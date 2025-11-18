'use client';

import type { Locale, Messages } from '@/lib/i18n/locales';
import { LocaleProvider } from '@/lib/i18n/client';

interface ProvidersProps {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}

export function Providers({ locale, messages, children }: ProvidersProps) {
  return <LocaleProvider locale={locale} messages={messages}>{children}</LocaleProvider>;
}
