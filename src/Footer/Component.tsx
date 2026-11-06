import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto bg-card text-black dark:text-white">
      <div className="container flex flex-col items-center gap-8 py-8 md:flex-row md:justify-between">
        {/* Logo and Copyright grouped next to each other */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link className="flex items-center" href="/">
            <Logo className="text-black dark:text-white/90" />
          </Link>
          {footerData.copyRighText && footerData.copyRighText != '' && (
            <p className="items-center text-sm text-black dark:text-neutral-400">
              &copy; {footerData.copyRighText}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
          <nav className="flex flex-col gap-4 md:flex-row">
            {navItems.map(({ link }, i) => {
              return <CMSLink key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
