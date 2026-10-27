'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { useHeaderTheme } from '@/providers/HeaderTheme' // Adjust import path if needed
import { Header } from '@/payload-types' // Adjust to your generated Payload types

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

// Define the locale item shape matching Payload config
export interface Locale {
  label: string
  code: string
}

export const LOCALES: Locale[] = process.env.NEXT_PUBLIC_LOCALES
  ? JSON.parse(process.env.NEXT_PUBLIC_LOCALES)
  : [{ label: 'English', code: 'en' }]

interface HeaderClientProps {
  data: Header
  initialLocale: string | undefined
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, initialLocale }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const currentLocaleCode = initialLocale

  const currentLocale = LOCALES.find((loc) => loc.code === currentLocaleCode)

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Handle switching language for Payload localizer
  const handleLocaleChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`

    const segments = pathname.split('/')
    const hasLocalePrefix = LOCALES.some((loc) => loc.code === segments[1])

    let newPath = pathname
    if (hasLocalePrefix) {
      segments[1] = newLocale
      newPath = segments.join('/')
    } else {
      newPath = `/${newLocale}${pathname}`
    }

    // 3. Navigate & refresh server context
    startTransition(() => {
      router.push(newPath)
      router.refresh()
    })
  }

  return (
    <header className="container relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-8 flex items-center justify-between">
        <Link href="/">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>

        <div className="flex items-center gap-6">
          <HeaderNav data={data} />

          {/* Language Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 px-2 text-sm font-medium">
                <Globe className="h-4 w-4" />
                <span className="uppercase">{currentLocale?.code}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LOCALES.map((locale) => (
                <DropdownMenuItem
                  key={locale.code}
                  disabled={locale.code === currentLocaleCode || isPending}
                  onClick={() => handleLocaleChange(locale.code)}
                  className="cursor-pointer flex items-center justify-between gap-4"
                >
                  <span>{locale.label}</span>
                  <span className="text-xs text-muted-foreground uppercase">{locale.code}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
