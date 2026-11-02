import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales: string[] = (
  process.env.NEXT_PUBLIC_LOCALES
    ? (JSON.parse(process.env.NEXT_PUBLIC_LOCALES) as { code: string }[])
    : [{ label: 'English', code: 'en' }]
).map((locale) => locale.code)

const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en'

function getLocale(cookieLocale: string) {
  // Check if a locale cookie already exists from a previous dropdown choice

  // Otherwise, fallback to browser headers or default
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if pathname already has a supported locale
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value

  if (pathnameLocale !== undefined && cookieLocale && cookieLocale == pathnameLocale) return

  if (pathnameLocale) {
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', pathnameLocale)
    return response
  }
  // Redirect if there is no locale
  const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale

  request.nextUrl.pathname = `/${locale}${pathname}`
  const response = NextResponse.redirect(request.nextUrl)
  response.cookies.set('NEXT_LOCALE', locale)
  return response
}

export const config = {
  matcher: [
    // Skip internal paths, api routes, static files, etc.
    '/((?!api|admin|next|_next/static|_next/image|favicon.ico|favicon.svg|images).*)',
  ],
}
