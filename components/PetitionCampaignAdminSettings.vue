<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'
import type { PermissionType } from '~/types'
type RouterOutput = inferRouterOutputs<AppRouter>;

type UserPermissions = RouterOutput['petitionCampaignPermission']['me'];

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  userPermissions: {
    type: Array as PropType<UserPermissions>,
    default: () => []
  },
  slug: {
    type: String,
    required: false,
    default: ''
  }
})

const { $client } = useNuxtApp()
const { t } = useI18n()
const dialog = useDialog()

const emit = defineEmits(['userPermissionUpdate'])

const { data: permissions } = await $client.petitionCampaignPermission.list.useQuery({
  id: props.id
})

interface PermissionUpdate {
    id: number,
    type: PermissionType
}

type AllowedPetitionType = 'admin' | 'read' | 'write' | 'approval'

interface PermissionCreate {
    email: string;
    type: AllowedPetitionType
}

const updatePermission = (update: PermissionUpdate) => {
  const permissionType = ['admin', 'read', 'write', 'approval'].includes(update.type) ? update.type as AllowedPetitionType : undefined
  if (!permissionType || !permissions.value) {
    return
  }
  // If about to update the users permissions, double check with popup
  const currentPermission = permissions.value.filter(p => p.id === update.id)
  if (!currentPermission.length) {
    return
  }
  if (props.userPermissions.map(p => p.user.id).includes(currentPermission[0].user.id)) {
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
  return await $client.petitionCampaignPermission.update.mutate({
    id,
    type
  })
}

const deletePermission = async (id: number) => {
  const deletedPermission = await $client.petitionCampaignPermission.delete.mutate(id)
  if (!deletedPermission || !permissions.value) {
    return
  }
  const newPermissions = permissions.value.filter(p => p.id !== id)
  permissions.value = newPermissions
}

const addPermission = async (input: PermissionCreate) => {
  const newPermission = await $client.petitionCampaignPermission.add.mutate({
    email: input.email,
    type: input.type,
    campaignId: props.id
  })
  if (newPermission && permissions.value) {
    permissions.value.push(newPermission)
  }
}
</script>

<template>
  <div>
    <Nh2>{{ $t('pc_manage.permissions') }}</Nh2>
    <PermissionList
      :permissions="permissions || undefined"
      :types="['read', 'write', 'admin', 'approval']"
      @update="updatePermission"
      @delete="deletePermission"
      @create="addPermission"
    />
    <Nh2>{{ $t('pc_manage.embed_code') }}</Nh2>
    <EmbedPage :slug="slug" />
  </div>
</template>
