export const OrganizationsColumns = {
    name: 'Navn',
    actions: 'Handlinger',
    role: 'Rolle',
} as const

export type TOrganizationsColumn = keyof typeof OrganizationsColumns

export const ORGANIZATIONS_COLUMNS = Object.keys(
    OrganizationsColumns,
) as TOrganizationsColumn[]