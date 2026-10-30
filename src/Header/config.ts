import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Main Navigation',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'link',
          options: [
            { label: 'Single Link', value: 'link' },
            { label: 'Submenu Group', value: 'group' },
            { label: 'Submenu Group with a Link', value: 'grouplink' },
          ],
          admin: {
            description:
              'Choose whether this item is a direct link or contains dropdown sub-items or both.',
          },
        },
        // Title field for group headers - visible when type === 'group'
        {
          name: 'title',
          type: 'text',
          label: 'Group Title',
          required: true,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.type === 'group' || siblingData?.type === 'grouplink',
          },
        },
        // Link field - visible when type === 'link'
        {
          ...link({ appearances: false }),
          admin: {
            condition: (_, siblingData) =>
              siblingData?.type === 'link' || siblingData?.type === 'grouplink',
          },
        },
        // Sub-navigation array - visible when type === 'group'
        {
          name: 'subNavItems',
          type: 'array',
          label: 'Sub Navigation Items',
          admin: {
            condition: (_, siblingData) =>
              siblingData?.type === 'group' || siblingData?.type === 'grouplink',
            initCollapsed: true,
          },
          fields: [
            {
              name: 'type',
              type: 'select',
              defaultValue: 'link',
              options: [
                { label: 'Single Link', value: 'link' },
                { label: 'Submenu Group', value: 'group' },
                { label: 'Submenu Group with a Link', value: 'grouplink' },
              ],
            },
            {
              name: 'title',
              type: 'text',
              label: 'Group Title',
              required: true,
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.type === 'group' || siblingData?.type === 'grouplink',
              },
            },
            {
              ...link({ appearances: false }),
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.type === 'link' || siblingData?.type === 'grouplink',
              },
            },
            {
              name: 'subSubNavItems',
              type: 'array',
              label: 'Sub-Sub Navigation Items (Links Only)',
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.type === 'group' || siblingData?.type === 'grouplink',
                initCollapsed: true,
              },
              fields: [
                link({
                  appearances: false,
                }),
              ],
            },
          ],
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
