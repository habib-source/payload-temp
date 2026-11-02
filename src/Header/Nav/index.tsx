'use client'

import React, { useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { ChevronRight } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuLink,
  NavigationMenuPositioner,
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
            if (type === 'link' && item.link) {
              return (
                <NavigationMenuItem key={i}>
                  <NavigationMenuLink
                    render={<CMSLink {...item.link} />}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'bg-transparent text-lg font-medium text-black dark:text-white',
                    )}
                  ></NavigationMenuLink>
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

        <NavigationMenuPositioner className={'!left-1/2 !-translate-x-1/2'} />
      </NavigationMenu>
    </nav>
  )
}

// Separate component to manage active sub-item tab state
const MegaMenuDropdown: React.FC<{ item: NonNullable<HeaderType['navItems']>[number] }> = ({
  item,
}) => {
  const subNavItems = item.subNavItems || []

  const [activeSubIndex, setActiveSubIndex] = useState<number>(0)

  const activeSubItem = subNavItems[activeSubIndex]

  return (
    <>
      <NavigationMenuTrigger className="bg-transparent text-lg font-medium text-black dark:text-white">
        {item.type === 'grouplink' && item.link ? (
          <CMSLink {...item.link} className="hover:no-underline" />
        ) : (
          <span>{item.title}</span>
        )}
      </NavigationMenuTrigger>

      <NavigationMenuContent>
        <div className="flex min-h-[360px] w-[700px] overflow-hidden rounded-b-md border border-slate-100 bg-white shadow-xl dark:border-white/10 dark:bg-black dark:shadow-2xl dark:shadow-black/60">
          {/* LEFT SIDEBAR — SUB ITEMS: pure black */}
          <div className="w-1/3 space-y-1 border-r border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black">
            <h3 className="px-3 py-2 text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-white/50">
              {item.title}
            </h3>

            {subNavItems.map((subItem, index) => {
              const subType = subItem.type || 'link'
              const isActive = activeSubIndex === index

              if (subType === 'link' && subItem.link) {
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setActiveSubIndex(index)}
                    className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-primary shadow-sm dark:bg-white/10 dark:shadow-black/50'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/5'
                    }`}
                  >
                    <CMSLink {...subItem.link} />
                  </div>
                )
              }

              // Group or Group with Link sidebar tab
              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveSubIndex(index)}
                  onClick={() => setActiveSubIndex(index)}
                  className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-primary shadow-sm dark:bg-white/10 dark:shadow-black/50'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/5'
                  }`}
                >
                  {subType === 'grouplink' && subItem.link ? (
                    <CMSLink {...subItem.link} className="hover:no-underline" />
                  ) : (
                    <span>{subItem.title}</span>
                  )}
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      isActive ? '' : 'text-slate-400 dark:text-white/40'
                    }`}
                  />
                </div>
              )
            })}
          </div>

          {/* RIGHT PANEL — SUB-SUB ITEMS */}
          <div className="w-2/3 bg-white p-6 dark:bg-white/[0.04]">
            {activeSubItem ? (
              <div>
                <h2 className="mb-4 border-b border-slate-100 pb-2 text-lg font-bold text-slate-900 dark:border-white/10 dark:text-white">
                  {activeSubItem.type === 'grouplink' && activeSubItem.link ? (
                    <CMSLink {...activeSubItem.link} className="hover:underline" />
                  ) : (
                    activeSubItem.title || (activeSubItem.link ? activeSubItem.link.label : '')
                  )}
                </h2>

                {activeSubItem.subSubNavItems && activeSubItem.subSubNavItems.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-x-4 gap-y-3">
                    {activeSubItem.subSubNavItems.map((subSubItem, subSubIdx) => (
                      <li key={subSubIdx}>
                        <CMSLink
                          {...subSubItem.link}
                          className="block py-0.5 text-sm text-slate-600 transition-colors hover:text-primary hover:underline dark:text-white/70 dark:hover:text-primary"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 italic dark:text-white/40">
                    No additional links available.
                  </p>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-white/40">
                Select a menu item from the left
              </div>
            )}
          </div>
        </div>
      </NavigationMenuContent>
    </>
  )
}
