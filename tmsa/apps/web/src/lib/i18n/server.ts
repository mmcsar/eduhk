import { cookies, headers } from 'next/headers';
import { fallbackLocale, getMessages, isLocale, type Locale } from './locales';

export async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get('tmsa-locale')?.value;
  if (isLocale(fromCookie)) {
    return fromCookie;
  }
  const acceptLanguage = (await headers()).get('accept-language');
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',').map((value) => value.split(';')[0]?.trim()?.slice(0, 2) ?? '');
    const match = preferred.find((code) => isLocale(code));
    if (match && isLocale(match)) {
      return match;
    }
  }
  return fallbackLocale;
}

export async function getLocalePayload() {
  const locale = await resolveLocale();
  return {
    locale,
    messages: getMessages(locale),
  };
}
