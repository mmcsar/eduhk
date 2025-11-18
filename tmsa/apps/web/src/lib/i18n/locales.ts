import en from '@/locales/en/common.json';
import fr from '@/locales/fr/common.json';
import sw from '@/locales/sw/common.json';
import pt from '@/locales/pt/common.json';

export const SUPPORTED_LOCALES = ['en', 'fr', 'sw', 'pt'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export type Messages = typeof en;

export const fallbackLocale: Locale = 'en';

const registry: Record<Locale, Messages> = {
  en,
  fr,
  sw,
  pt,
};

export function isLocale(input: string | undefined): input is Locale {
  return Boolean(input && SUPPORTED_LOCALES.includes(input as Locale));
}

export function getMessages(locale: Locale = fallbackLocale): Messages {
  return registry[locale];
}
