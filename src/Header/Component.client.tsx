'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { LangNav } from './LangNav'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { Header } from '@/payload-types'

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
    <header className="container relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-8 flex items-center justify-between">
        <Link href="/">
          <Logo className="text-black dark:text-white" />
        </Link>
        <div className="flex items-center gap-6">
          <HeaderNav data={data} />
          <LangNav initialLocale={initialLocale} />
        </div>
      </div>
    </header>
  )
}
