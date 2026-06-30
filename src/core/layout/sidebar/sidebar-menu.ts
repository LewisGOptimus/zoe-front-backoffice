import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { sidebarIcons } from './icons'

const BACKOFFICE_DASHBOARD_PATH = '/backoffice/dashboard'

export type SidebarMenuContext = {
  route: RouteLocationNormalizedLoaded
}

type SidebarMenuResolver<T> = T | ((context: SidebarMenuContext) => T)

export type SidebarMenuItem = {
  key?: string
  label: string
  iconPaths?: string[]
  to?: SidebarMenuResolver<string>
  active?: SidebarMenuResolver<boolean>
  children?: SidebarMenuItem[]
}

export type SidebarMenuSection = {
  key: string
  title: string
  items: SidebarMenuItem[]
}

export const sidebarMenuSections: SidebarMenuSection[] = [
  {
    key: 'main',
    title: 'Menú',
    items: [
      {
        key: 'dashboard',
        label: 'Inicio',
        iconPaths: sidebarIcons.dashboard,
        to: BACKOFFICE_DASHBOARD_PATH,
        active: ({ route }: SidebarMenuContext) => {
          return route.path === BACKOFFICE_DASHBOARD_PATH || route.path === `${BACKOFFICE_DASHBOARD_PATH}/`
        },
      },
      {
        key: 'administration',
        label: 'Administración',
        iconPaths: sidebarIcons.administration,
        active: ({ route }: SidebarMenuContext) =>
          route.path.includes('/empresas') || route.path.includes('/usuarios'),
        children: [
          {
            key: 'empresas-list',
            label: 'Empresas',
            to: `${BACKOFFICE_DASHBOARD_PATH}/empresas`,
          },
          {
            key: 'usuarios-list',
            label: 'Usuarios',
            to: `${BACKOFFICE_DASHBOARD_PATH}/usuarios`,
          },
        ],
      },
      {
        key: 'scheduling',
        label: 'Agendamientos',
        iconPaths: sidebarIcons.scheduling,
        active: ({ route }: SidebarMenuContext) => route.path.includes('/demonstrations'),
        children: [
          {
            key: 'scheduling-list',
            label: 'Lista de agendamientos',
            to: `${BACKOFFICE_DASHBOARD_PATH}/demonstrations`,
          },
        ],
      },
    ],
  },
]
