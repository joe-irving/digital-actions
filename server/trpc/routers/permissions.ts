import type { PermissionType } from '~/types'

export interface PermissionTypeDefinition {
  type: PermissionType,
  allowed: PermissionType[]
}

export const permissionTypeList: PermissionTypeDefinition[] = [
  {
    type: 'admin',
    allowed: ['owner', 'admin']
  },
  {
    type: 'read',
    allowed: ['owner', 'admin']
  },
  {
    type: 'approval',
    allowed: ['owner', 'admin']
  },
  {
    type: 'admin',
    allowed: ['owner', 'admin']
  },
  {
    type: 'write',
    allowed: ['owner', 'admin']
  }
]

export const permissionsSelect = {
  id: true,
  created: true,
  updated: true,
  type: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true
    }
  }
}
