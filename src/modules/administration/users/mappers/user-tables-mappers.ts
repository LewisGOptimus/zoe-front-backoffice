import type { User } from '~/core/auth/types/auth.types'
import type { UTableColumn, UTableRow } from '~/core/ui/Tables/utable.types'

export const userColumns: UTableColumn[] = [
  { key: 'firstName', label: 'Nombre', variant: 'emphasis' },
  { key: 'lastName', label: 'Apellido' },
  { key: 'email', label: 'Email' },
  {
    key: 'role',
    label: 'Rol',
    type: 'badge',
    align: 'center',
    classMap: {
      Usuario: 'bg-brand-500/20 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
      Subusuario: 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300',
    },
  },
  { key: 'isActive', label: 'Activo', type: 'badge', align: 'center', classMap: { Activo: 'bg-green-500/20 text-green-700 dark:bg-green-500/20 dark:text-green-300', Inactivo: 'bg-red-500/20 text-red-700 dark:bg-red-500/20 dark:text-red-300' } },
  { key: 'isVerified', label: 'Verificado', type: 'badge', align: 'center', classMap: { Verificado: 'bg-green-500/20 text-green-700 dark:bg-green-500/20 dark:text-green-300', 'No verificado': 'bg-red-500/20 text-red-700 dark:bg-red-500/20 dark:text-red-300' } },
  { key: 'isAdmin', label: 'SuperUsuario' },
]

export const mapUsersToTableRows = (userList: User[]): UTableRow[] => {
  return userList.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email || '-',
    role: user.userType === 'USUARIO' ? 'Usuario' : 'Subusuario',
    isActive: user.isActive ? 'Activo' : 'Inactivo',
    isVerified: user.isVerified ? 'Verificado' : 'No verificado',
    isAdmin: user.isAdmin ? 'Soporte' : '-',
  }))
}
