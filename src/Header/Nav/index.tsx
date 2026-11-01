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
    <nav className="gap-4 flex items-center">
      <NavigationMenu align="end">
        <NavigationMenuList className="gap-1">
          {navItems.map((item, i) => {
            const type = item.type || 'link'
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
      <NavigationMenuTrigger className="bg-transparent font-medium text-lg text-black dark:text-white">
        {item.type === 'grouplink' && item.link ? (
          <CMSLink {...item.link} className="hover:no-underline" />
        ) : (
          <span>{item.title}</span>
        )}
      </NavigationMenuTrigger>

      <NavigationMenuContent>
        <div className="flex w-[700px] min-h-[360px] bg-white dark:bg-black shadow-xl dark:shadow-2xl dark:shadow-black/60 rounded-b-md border border-slate-100 dark:border-white/10 overflow-hidden">
          {/* LEFT SIDEBAR — SUB ITEMS: pure black */}
          <div className="w-1/3 bg-slate-50 dark:bg-black border-r border-slate-200 dark:border-white/10 p-4 space-y-1">
            <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-white/50 uppercase tracking-wider">
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
                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-white dark:bg-white/10 text-primary shadow-sm dark:shadow-black/50'
                        : 'text-slate-700 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5'
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
                  className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-white dark:bg-white/10 text-primary shadow-sm dark:shadow-black/50'
                      : 'text-slate-700 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {subType === 'grouplink' && subItem.link ? (
                    <CMSLink {...subItem.link} className="hover:no-underline" />
                  ) : (
                    <span>{subItem.title}</span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? '' : 'text-slate-400 dark:text-white/40'
                    }`}
                  />
                </div>
              )
            })}
          </div>

          {/* RIGHT PANEL — SUB-SUB ITEMS */}
          <div className="w-2/3 p-6 bg-white dark:bg-white/[0.04]">
            {activeSubItem ? (
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-white/10">
                  {activeSubItem.type === 'grouplink' && activeSubItem.link ? (
                    <CMSLink {...activeSubItem.link} className="hover:underline" />
                  ) : (
                    activeSubItem.title || (activeSubItem.link ? activeSubItem.link.label : '')
                  )}
                </h2>

                {activeSubItem.subSubNavItems && activeSubItem.subSubNavItems.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-y-3 gap-x-4">
                    {activeSubItem.subSubNavItems.map((subSubItem, subSubIdx) => (
                      <li key={subSubIdx}>
                        <CMSLink
                          {...subSubItem.link}
                          className="text-sm text-slate-600 dark:text-white/70 hover:text-primary dark:hover:text-primary hover:underline transition-colors block py-0.5"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-white/40 italic">
                    No additional links available.
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 dark:text-white/40 text-sm">
                Select a menu item from the left
              </div>
            )}
          </div>
        </div>
      </NavigationMenuContent>
    </>
  )
}
