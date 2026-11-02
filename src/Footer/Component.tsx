import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black text-white dark:bg-card">
      <div className="container flex flex-col items-center gap-8 py-8 md:flex-row md:justify-between">
        {/* Logo and Copyright grouped next to each other */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link className="flex items-center" href="/">
            <Logo className="text-white/90" />
          </Link>
          {footerData.copyRighText && footerData.copyRighText != '' && (
            <p className="items-center text-sm text-neutral-400">
              &copy; {footerData.copyRighText}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
          <nav className="flex flex-col gap-4 md:flex-row">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
