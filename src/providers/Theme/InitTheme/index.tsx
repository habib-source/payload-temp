import Script from 'next/script'
import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../ThemeSelector/types'

export function InitTheme(): React.JSX.Element {
  const themeScript = `
    (function () {
      function getImplicitPreference() {
        const mediaQuery = '(prefers-color-scheme: dark)'
        const mql = window.matchMedia(mediaQuery)
        const hasImplicitPreference = typeof mql.matches === 'boolean'

        if (hasImplicitPreference) {
          return mql.matches ? 'dark' : 'light'
        }

        return null
      }

      function themeIsValid(theme) {
        return theme === 'light' || theme === 'dark'
      }

      let themeToSet = '${defaultTheme}'
      const preference = window.localStorage.getItem('${themeLocalStorageKey}')

      if (themeIsValid(preference)) {
        themeToSet = preference
      } else {
        const implicitPreference = getImplicitPreference()

        if (implicitPreference) {
          themeToSet = implicitPreference
        }
      }

      document.documentElement.setAttribute('data-theme', themeToSet)
    })();
  `

  return (
    /* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */
    <Script
      id="theme-script"
      dangerouslySetInnerHTML={{ __html: themeScript }}
      strategy="beforeInteractive"
    />
  )
}
