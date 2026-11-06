'use client'

import React, { useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { ChevronRight, ChevronLeft } from 'lucide-react' // Added ChevronLeft
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
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
                  <CMSLink
                    {...item.link}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'bg-transparent text-lg font-medium dark:hover:bg-muted/70',
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

  // Check if sub-items have nested children or require the split view
  const hasNestedContent = subNavItems.some(
    (subItem) =>
      (subItem.subSubNavItems && subItem.subSubNavItems.length > 0) ||
      subItem.type === 'grouplink' ||
      subItem.type === 'group',
  )

  const [activeSubIndex, setActiveSubIndex] = useState<number>(0)
  const activeSubItem = subNavItems[activeSubIndex]

  return (
    <>
      <NavigationMenuTrigger className="bg-transparent text-lg font-medium dark:hover:bg-muted/70">
        {item.type === 'grouplink' && item.link ? (
          <CMSLink {...item.link} />
        ) : (
          <span>{item.title}</span>
        )}
      </NavigationMenuTrigger>

      <NavigationMenuContent className="bg-popover">
        {hasNestedContent ? (
          /* --- SPLIT LAYOUT (Sidebar + Right Panel for nested items) --- */
          <div className="flex min-h-[360px] w-[700px] overflow-hidden rounded-b-md">
            {/* LEFT SIDEBAR — SUB ITEMS */}
            <div className="w-1/3 space-y-1 border-r border-border bg-muted/30 p-4">
              <h3 className="px-3 py-3 text-lg font-bold tracking-wider">{item.title}</h3>

              {subNavItems.map((subItem, index) => {
                const subType = subItem.type || 'link'
                const isActive = activeSubIndex === index

                return (
                  <div
                    key={index}
                    onMouseEnter={() => setActiveSubIndex(index)}
                    onClick={() => setActiveSubIndex(index)}
                    className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-popover shadow-sm' : 'hover:bg-muted'
                    }`}
                  >
                    {subType === 'link' && subItem.link ? (
                      <CMSLink {...subItem.link} />
                    ) : subType === 'grouplink' && subItem.link ? (
                      <CMSLink {...subItem.link} className="hover:no-underline" />
                    ) : (
                      <span>{subItem.title}</span>
                    )}
                    {subType !== 'link' && (
                      <ChevronRight className={`h-4 w-4 transition-transform`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* RIGHT PANEL — SUB-SUB ITEMS */}
            <div className="w-2/3 bg-popover p-6">
              {activeSubItem ? (
                <div>
                  <h2 className="mb-4 border-b border-border pb-2 text-lg font-bold">
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
                            className="block py-0.5 text-sm transition-colors hover:underline"
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm italic">No additional links available.</p>
                  )}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-sm">
                  Select a menu item from the left
                </div>
              )}
            </div>
          </div>
        ) : (
          /* --- TABULAR GRID LAYOUT (No right panel, 2/3/4 columns dynamic) --- */
          <div className="min-h-[360px] w-[700px] rounded-b-md bg-popover p-6">
            <h3 className="mb-4 border-b border-border pb-2 text-lg font-bold tracking-wider">
              {item.title}
            </h3>
            <div className="grid auto-cols-auto auto-rows-auto grid-cols-1 place-content-around gap-4 sm:grid-cols-1 md:grid-cols-2">
              {subNavItems.map((subItem, index) => (
                <div
                  key={index}
                  className="flex items-center rounded-md p-2.5 text-sm font-medium transition-colors hover:bg-muted/70"
                >
                  {subItem.link ? (
                    <CMSLink {...subItem.link} className="block w-full hover:no-underline" />
                  ) : (
                    <span>{subItem.title}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </NavigationMenuContent>
    </>
  )
}

export const MobileNav = ({
  data,
  setIsOpen,
}: {
  data: HeaderType
  setIsOpen: (open: boolean) => void
}) => {
  const navItems = data?.navItems || []
  const [navStack, setNavStack] = useState<any[]>([])

  // Items to display at the current level
  const currentItems =
    navStack.length === 0
      ? navItems
      : navStack[navStack.length - 1].subNavItems ||
        navStack[navStack.length - 1].subSubNavItems ||
        []

  // The item we've drilled into (may be null at root)
  const currentItem = navStack[navStack.length - 1]
  // The item we'd return to (may be null if only one level deep)
  const parentItem = navStack.length > 1 ? navStack[navStack.length - 2] : null

  // "Back to" should reference the PARENT, not the current item
  const backLabel = parentItem ? parentItem.title || parentItem.link?.label || 'Back' : 'Home'

  // Current item's own link (present for "grouplink" groups)
  const currentLink = currentItem?.link

  const handleBack = () => {
    setNavStack((prev) => prev.slice(0, -1))
  }

  return (
    <div className="flex w-full flex-col">
      {navStack.length > 0 && (
        <div className="border-b border-border">
          {/* Back button — points to the parent we came from */}
          <button
            onClick={handleBack}
            className="flex w-full items-center px-6 py-4 text-sm font-semibold tracking-wider uppercase transition-colors hover:bg-muted/50"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to {backLabel}
          </button>

          {/* Current item's own link (e.g. grouplink), shown underneath */}
          {currentLink && (
            <div className="px-6 pb-5" onClick={() => setIsOpen(false)}>
              <CMSLink
                {...currentLink}
                className="flex w-full items-center justify-between text-xl font-extrabold uppercase hover:no-underline"
              />
            </div>
          )}
        </div>
      )}

      {currentItems.map((item: any, i: number) => {
        const hasChildren =
          (item.subNavItems && item.subNavItems.length > 0) ||
          (item.subSubNavItems && item.subSubNavItems.length > 0)
        const label = item.title || item.link?.label || 'Untitled'

        return (
          <div key={i} className="border-b border-border last:border-0">
            {hasChildren ? (
              <button
                onClick={() => setNavStack((prev) => [...prev, item])}
                className="flex w-full items-center justify-between p-6 text-left text-lg font-bold transition-colors hover:bg-muted/50"
              >
                {label}
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : item.link ? (
              <div className="p-6" onClick={() => setIsOpen(false)}>
                <CMSLink
                  {...item.link}
                  className="flex w-full items-center justify-between text-lg font-bold hover:no-underline"
                />
              </div>
            ) : (
              <div className="p-6 text-lg font-bold">{label}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
