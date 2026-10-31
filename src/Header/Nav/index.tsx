'use client'

import React, { useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, ChevronRight } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuLink,
  NavigationMenuPositioner
} from '@/components/ui/navigation-menu'
import { cn } from '@/utilities/ui'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    // Outer header wrapper handles centering alignment context if needed
    <nav className="relative flex items-center justify-between w-full max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center gap-4">
        {/* Logo or brand placeholder if needed */}
      </div>

      <div className="flex items-center justify-center flex-1">
        <NavigationMenu align="center">
          <NavigationMenuList className="gap-1">
            {navItems.map((item, i) => {
              const type = item.type || 'link'

              if (type === 'link' && item.link) {
                return (
                  <NavigationMenuItem key={i}>
                    <NavigationMenuLink
                      render={<CMSLink {...item.link} />}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'bg-transparent font-medium text-lg text-black dark:text-white',
                      )}
                    />
                  </NavigationMenuItem>
                )
              }

              if (type === 'group' || type === 'grouplink') {
                return (
                  <NavigationMenuItem key={i}>
                    <MegaMenuDropdown item={item} />
                  </NavigationMenuItem>
                )
              }
              return null
            })}
          </NavigationMenuList>

          <NavigationMenuPositioner className={'!left-1/2 !-translate-x-1/2'}/>
        </NavigationMenu>
      </div>

      {/* Search Icon */}
      <div className="flex items-center">
        <Link href="/search" className="flex items-center ml-2">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 h-5 text-primary hover:text-primary/80 transition-colors" />
        </Link>
      </div>
    </nav>
  )
}

const MegaMenuDropdown: React.FC<{ item: NonNullable<HeaderType['navItems']>[number] }> = ({
  item,
}) => {
  const subNavItems = item.subNavItems || []
  const [activeSubIndex, setActiveSubIndex] = useState<number>(0)

  const activeSubItem = subNavItems[activeSubIndex]

  return (
    <>
      <NavigationMenuTrigger className="bg-transparent font-medium text-lg text-black dark:text-white">
        {item.type === 'grouplink' && item.link ? (
          <CMSLink {...item.link} className="hover:no-underline" />
        ) : (
          <span>{item.title}</span>
        )}
      </NavigationMenuTrigger>

      <NavigationMenuContent>
        <div className="grid grid-cols-12 w-[850px] min-h-[420px] bg-white dark:bg-zinc-950 text-black dark:text-white shadow-2xl">

          {/* Left Column: Subitems List (e.g., Advisory, Audit, Tax) */}
          <div className="col-span-4 bg-muted/40 border-r border-border p-4 flex flex-col gap-1">
            <div className="px-3 py-2 text-sm font-bold text-muted-foreground flex items-center justify-between mb-2">
              <span>{item.title}</span>
              <ChevronRight className="w-4 h-4" />
            </div>

            {subNavItems.map((subItem, subIdx) => {
              const isActive = subIdx === activeSubIndex
              return (
                <button
                  key={subIdx}
                  onClick={() => setActiveSubIndex(subIdx)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors text-left rounded-md',
                    isActive
                      ? 'bg-background text-primary shadow-xs font-semibold'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  )}
                >
                  <span>{subItem.title || subItem.link?.label}</span>
                  <ChevronRight className={cn('w-4 h-4 transition-transform', isActive && 'text-primary')} />
                </button>
              )
            })}
          </div>

          {/* Right Column: Sub-Subitems Content Grid (matches target screenshot layout) */}
          <div className="col-span-8 p-8 flex flex-col justify-start">
            {activeSubItem ? (
              <div>
                <h3 className="text-xl font-bold mb-6 text-foreground border-b pb-3">
                  {activeSubItem.title || activeSubItem.link?.label}
                </h3>

                {activeSubItem.subSubNavItems && activeSubItem.subSubNavItems.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-y-3 gap-x-6">
                    {activeSubItem.subSubNavItems.map((subSubItem, subSubIdx) => (
                      <li key={subSubIdx}>
                        <CMSLink
                          {...subSubItem.link}
                          className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors block py-1"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No additional items available.</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a category from the left.</p>
            )}
          </div>

        </div>
      </NavigationMenuContent>
    </>
  )
}
