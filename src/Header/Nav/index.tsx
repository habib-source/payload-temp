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
                  <CMSLink
                    {...item.link}
                    appearance="link"
                    className={cn(navigationMenuTriggerStyle(), 'text-black dark:text-white')}
                  />
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
      <NavigationMenuTrigger className="bg-transparent font-medium text-lg">
        {item.type === 'grouplink' && item.link ? (
          <CMSLink {...item.link} appearance="link" className="hover:no-underline" />
        ) : (
          <span className={cn('text-black dark:text-white')}>{item.title}</span>
        )}
      </NavigationMenuTrigger>

      <NavigationMenuContent>
        {/* Container styled like the BDO Mega Menu in your screenshot */}
        <div className="flex w-[700px] min-h-[360px] bg-white shadow-xl rounded-b-md border border-slate-100 overflow-hidden">
          {/* LEFT SIDEBAR: Sub Navigation Items */}
          <div className="w-1/3 bg-slate-50 border-r border-slate-200 p-4 space-y-1">
            <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CMSLink {...subItem.link} appearance="link" />
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
                      ? 'bg-white text-primary shadow-sm font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {subType === 'grouplink' && subItem.link ? (
                    <CMSLink {...subItem.link} appearance="link" className="hover:no-underline" />
                  ) : (
                    <span>{subItem.title}</span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${isActive ? 'text-primary' : 'text-slate-400'}`}
                  />
                </div>
              )
            })}
          </div>

          {/* RIGHT CONTENT PANEL: Sub-Sub Navigation Items */}
          <div className="w-2/3 p-6 bg-white">
            {activeSubItem ? (
              <div>
                {/* Header title for active sub-category */}
                <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  {activeSubItem.type === 'grouplink' && activeSubItem.link ? (
                    <CMSLink
                      {...activeSubItem.link}
                      appearance="link"
                      className="hover:underline"
                    />
                  ) : (
                    activeSubItem.title || (activeSubItem.link ? activeSubItem.link.label : '')
                  )}
                </h2>

                {/* Grid of Sub-Sub items */}
                {activeSubItem.subSubNavItems && activeSubItem.subSubNavItems.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-y-3 gap-x-4">
                    {activeSubItem.subSubNavItems.map((subSubItem, subSubIdx) => (
                      <li key={subSubIdx}>
                        <CMSLink
                          {...subSubItem.link}
                          appearance="link"
                          className="text-sm text-slate-600 hover:text-primary transition-colors block py-0.5"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 italic">No additional links available.</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Select a menu item from the left
              </div>
            )}
          </div>
        </div>
      </NavigationMenuContent>
    </>
  )
}
