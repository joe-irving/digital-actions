<script setup lang="ts">
// This is formating weird
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;

const { $client } = useNuxtApp()
const { t } = useI18n()
const dialog = useDialog()

const props = defineProps({
  petition: {
    type: Object as PropType<RouterOutput['petition']['getManage']>,
    required: true
  },
  petitionPermissions: {
    type: Object as PropType<RouterOutput['petitionPermission']['me']>,
    required: true
  }
})
// List all petition permissions
const { data: permissions } = await $client.petitionPermission.list.useQuery({
  id: props.petition.id
})

const emit = defineEmits(['userPermissionUpdate'])

interface PermissionUpdate {
    id: number,
    type: PermissionType
}

type AllowedPetitionType = 'admin' | 'read' | 'write'

interface PermissionCreate {
    email: string;
    type: AllowedPetitionType
}

const updatePermission = (update: PermissionUpdate) => {
  const permissionType = ['admin', 'read', 'write'].includes(update.type) ? update.type as AllowedPetitionType : undefined
  if (!permissionType || !permissions.value) {
    return
  }
  // If about to update the users permissions, double check with popup
  const currentPermission = permissions.value.filter(p => p.id === update.id)
  if (!currentPermission.length) {
    return
  }
  if (props.petitionPermissions.map(p => p.user.id).includes(currentPermission[0].user.id)) {
    if (permissionType === 'admin') {
      makeUpdate(update.id, permissionType)
    } else {
      dialog.warning({
        title: t('permissions.confirm'),
        content: t('permissions.confirm_demotion'),
        positiveText: t('permissions.confirm_button'),
        negativeText: t('permissions.reject_button'),
        onPositiveClick: async () => {
          const newPermission = await makeUpdate(update.id, permissionType)
          emit('userPermissionUpdate', [newPermission])
        }
      })
    }
  } else {
    makeUpdate(update.id, permissionType)
  }
}

const makeUpdate = async (id: number, type: AllowedPetitionType) => {
  return await $client.petitionPermission.update.mutate({
    id,
    type
  })
}

const deletePermission = async (id: number) => {
  const deletedPermission = await $client.petitionPermission.delete.mutate({
    id
  })
  if (!deletedPermission || !permissions.value) {
    return
  }
  const newPermissions = permissions.value.filter(p => p.id !== id)
  permissions.value = newPermissions
}

const addPermission = async (input: PermissionCreate) => {
  const newPermission = await $client.petitionPermission.add.mutate({
    email: input.email,
    type: input.type,
    petitionId: props.petition.id
  })
  if (newPermission && permissions.value) {
    permissions.value.push(newPermission)
  }
}
</script>

<template>
  <div>
    <Nh2>{{ $t('petition.permissions_title') }}</Nh2>
    <PermissionList
      :permissions="permissions"
      :types="['read', 'write', 'admin']"
      @update="updatePermission"
      @delete="deletePermission"
      @create="addPermission"
    />
    <p>Action Network tags</p>
    <p>Delete Petition</p>
  </div>
</template>
