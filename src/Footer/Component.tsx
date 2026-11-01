import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between items-center">

        {/* Logo and Copyright grouped next to each other */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link className="flex items-center" href="/">
            <Logo />
          </Link>
          {footerData.copyRighText && footerData.copyRighText != "" && (
            <p className="text-sm text-neutral-400 items-center">
              &copy; {footerData.copyRighText}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>

      </div>
    </footer>
  )
}
