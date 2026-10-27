import { cookies } from 'next/headers'

import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()

  // Read the cookie safely on the server
  const cookieStore = await cookies()
  const initialLocale = cookieStore.get('NEXT_LOCALE')?.value

  return <HeaderClient data={headerData} initialLocale={initialLocale} />
}
