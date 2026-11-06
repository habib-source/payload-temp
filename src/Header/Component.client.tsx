'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Logo } from '@/components/Logo/Logo'
import { buttonVariants } from '@/components/ui/button'
import { HeaderNav, MobileNav } from './Nav'
import { LangNav } from './LangNav'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { Header } from '@/payload-types'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

import { SearchIcon, Menu } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'

interface HeaderClientProps {
  data: Header
  initialLocale: string | undefined
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, initialLocale }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme])

  return (
    <div className={theme && theme === 'dark' ? 'bg-black/40' : ''}>
      <header className="relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
        <div className="container">
          <div className="flex items-center justify-between py-5 text-black dark:text-white/90">
            <Link href="/">
              <Logo className="text-black dark:text-white/90" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-4 md:flex">
              <HeaderNav data={data} />
              <div className="ml-4 flex justify-between gap-4">
                <ThemeSelector />
                <LangNav initialLocale={initialLocale} />
                <Link
                  href="/search"
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'ml-1 flex items-center',
                  )}
                >
                  <span className="sr-only">Search</span>
                  <SearchIcon className="h-4 w-4 transition-colors" />
                </Link>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/search"
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'icon' }),
                  'flex items-center',
                )}
              >
                <span className="sr-only">Search</span>
                <SearchIcon className="h-5 w-5" />
              </Link>

              <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <DrawerTrigger>
                  <div className="-mr-2 p-2" aria-label="Open menu">
                    <Menu className="h-6 w-6" />
                  </div>
                </DrawerTrigger>

                <DrawerContent
                  className={cn(
                    // Full-screen drawer
                    'm-0 flex h-[100dvh] max-h-[100dvh] flex-col p-0',
                    'rounded-none border-none',
                  )}
                >
                  <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>

                  {/* Mobile Menu List */}
                  <div className="flex-1 overflow-y-auto bg-background">
                    <MobileNav data={data} setIsOpen={setIsMobileMenuOpen} />
                  </div>

                  {/* Footer Controls */}
                  <div className="flex items-center justify-between border-t border-border bg-background p-4">
                    <ThemeSelector />
                    <LangNav initialLocale={initialLocale} />
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
