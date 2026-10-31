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
} from '@/components/ui/navigation-menu'
import { cn } from '@/utilities/ui'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-4">
      <NavigationMenu align="end">
        <NavigationMenuList className="gap-1">
          {navItems.map((item, i) => {
            const type = item.type || 'link'

            // 1. Single Direct Link
            if (type === 'link' && item.link) {
              return (
                <NavigationMenuItem key={i}>
                  <NavigationMenuLink
                    render={<CMSLink
                      {...item.link}
                    />}
                    className={
                      cn(navigationMenuTriggerStyle(),
                      'bg-transparent font-medium text-lg text-black dark:text-white'
                        )
                    }
                  >
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            }

            // 2. Submenu Group / Mega Menu Layout
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
      </NavigationMenu>

      {/* Search Icon */}
      <Link href="/search" className="flex items-center ml-2">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 h-5 text-primary hover:text-primary/80 transition-colors" />
      </Link>
    </nav>
  )
}

// Separate component to manage active sub-item tab state
const MegaMenuDropdown: React.FC<{ item: NonNullable<HeaderType['navItems']>[number] }> = ({
  item,
}) => {
  const subNavItems = item.subNavItems || []

  // Default active tab to the first item that has subSubNavItems or is a group
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
        <NavigationMenu orientation='horizontal'>
          <NavigationMenuList className="gap-9">
            {subNavItems.map((item, i) => {
              const type = item.type || 'link'

              // 1. Single Direct Link
              if (type === 'link' && item.link) {
                return (
                  <NavigationMenuItem key={i}>
                    <NavigationMenuLink
                      render={<CMSLink
                        {...item.link}
                      />}
                      className={
                        cn(navigationMenuTriggerStyle(),
                        'bg-transparent font-medium text-lg text-black dark:text-white'
                          )
                      }
                    >
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              }
              // 2. Submenu Group / Mega Menu Layout
              if (type === 'group' || type === 'grouplink') {
                return (
                  <NavigationMenuItem key={i}>
                    <NavigationMenuTrigger className="bg-transparent font-medium text-lg text-black dark:text-white">
                      {item.type === 'grouplink' && item.link ? (
                        <CMSLink {...item.link} className="hover:no-underline" />
                      ) : (
                        <span>{item.title}</span>
                      )}
                    </NavigationMenuTrigger>

                    {/* Fixed: Replaced raw 'if' statement with logical && evaluation */}
                    {item.subSubNavItems && item.subSubNavItems.length > 0 && (
                      <NavigationMenuContent>
                        {/* Grid of Sub-Sub items */}
                          <ul className="grid grid-cols-1 gap-y-3 gap-x-4">
                            {item.subSubNavItems.map((subSubItem, subSubIdx) => (
                              <li key={subSubIdx}>
                                <CMSLink
                                  {...subSubItem.link}
                                  className="text-sm text-slate-600 hover:text-primary transition-colors block py-0.5"
                                />
                              </li>
                            ))}
                          </ul>
                      </NavigationMenuContent>
                    )}
                  </NavigationMenuItem>
                )
              }
              return null
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </NavigationMenuContent>
    </>
  )
}
