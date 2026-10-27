import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales: string[]= (
  process.env.NEXT_PUBLIC_LOCALES
    ? (JSON.parse(process.env.NEXT_PUBLIC_LOCALES) as { code: string }[])
    : [{ label: 'English', code: 'en' }]
).map(locale => locale.code);

const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en'


function getLocale(request: NextRequest) {
  // Check if a locale cookie already exists from a previous dropdown choice
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale

  // Otherwise, fallback to browser headers or default
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if pathname already has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip internal paths, api routes, static files, etc.
    '/((?!api|admin|next|_next/static|_next/image|favicon.ico).*)',
  ],
}
