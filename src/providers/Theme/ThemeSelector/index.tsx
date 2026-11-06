'use client'

import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { Theme } from './types'
import { useTheme } from '..'
import { themeLocalStorageKey, defaultTheme } from './types'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey) as Theme | null
    setThemeState(preference ?? defaultTheme)
  }, [])

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    setThemeState(nextTheme)
  }

  const isDark = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="bg-transparent [&_svg]:!size-4"
    >
      {isDark ? (
        <Sun className="h-4 w-4 duration-200" />
      ) : (
        <Moon className="h-4 w-4 duration-200" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
