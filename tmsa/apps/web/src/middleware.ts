import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { fallbackLocale, isLocale } from '@/lib/i18n/locales';
import { securityHeaders } from '@/lib/security/headers';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const cookieLocale = request.cookies.get('tmsa-locale')?.value;
  if (!isLocale(cookieLocale)) {
    const preferred = request.headers.get('accept-language')?.slice(0, 2);
    const locale = isLocale(preferred) ? preferred : fallbackLocale;
    response.cookies.set('tmsa-locale', locale, { path: '/', httpOnly: false });
  }

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next|api/auth).*)'],
};
