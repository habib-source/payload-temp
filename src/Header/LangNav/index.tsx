import { useTransition } from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

// Define the locale item shape matching Payload config
export interface Locale {
  label: string
  code: string
}

export const LOCALES: Locale[] = process.env.NEXT_PUBLIC_LOCALES
  ? JSON.parse(process.env.NEXT_PUBLIC_LOCALES)
  : [{ label: 'English', code: 'en' }]

export const LangNav: React.FC<{ initialLocale: string | undefined }> = ({ initialLocale }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const currentLocaleCode = initialLocale
  const currentLocale = LOCALES.find((loc) => loc.code === currentLocaleCode)

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
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn('text-black dark:text-white gap-2 px-2 text-sm font-medium')}
          />
        }
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{currentLocale?.code}</span>
        <ChevronDown className="h-3 w-3 opacity-50" />
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
  )
}
