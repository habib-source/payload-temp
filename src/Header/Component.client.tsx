'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { LangNav } from './LangNav'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { Header } from '@/payload-types'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

import { SearchIcon } from 'lucide-react'

interface HeaderClientProps {
  data: Header
  initialLocale: string | undefined
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, initialLocale }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Handle switching language for Payload localizer

  return (
    <header className="relative z-20 container" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="flex items-center justify-between py-5">
        <Link href="/">
          <Logo className="text-black dark:text-white/90" />
        </Link>
        <HeaderNav data={data} />
        <div className="flex justify-between gap-4">
          <ThemeSelector />
          <LangNav initialLocale={initialLocale} />
          {/* Search Icon */}
          <Link href="/search" className="ml-1 flex items-center">
            <span className="sr-only">Search</span>
            <SearchIcon className="h-4 w-4 text-primary transition-colors hover:text-primary/80" />
          </Link>
        </div>
      </div>
    </header>
  )
}
