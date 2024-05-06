<script setup lang="ts">
import type { FormRules, FormInst, FormValidationError } from 'naive-ui'
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'
import type { PermissionType } from '~/types'
type RouterOutput = inferRouterOutputs<AppRouter>;

type PermissionsList = RouterOutput['petitionCampaignPermission']['list'] | RouterOutput['petitionPermission']['list'];

const { t } = useI18n()
const emit = defineEmits(['create', 'update', 'delete'])

const props = defineProps({
  permissions: {
    type: Array as PropType<PermissionsList>,
    default: () => []
  },
  types: {
    type: Array as PropType<PermissionType[]>,
    default: () => ['read', 'write']
  }
})

const options = ref(props.types.map((type) => {
  return {
    label: t(`permission_types.${type}`),
    value: type
  }
}))

const newPermission = ref<{
    email: string | null,
    type: PermissionType
}>({
  email: null,
  type: 'read'
})

const formRef = ref<FormInst | null>(null)

const formRules = ref<FormRules>({
  email: {
    required: false,
    trigger: ['blur'],
    validator (_rule, value: string) {
      if (value === '') {
        return true
      } else if (!/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(value)) {
        return new Error(t('petition_form.email_invalid'))
      } else if (props.permissions.filter(permission => permission.user.email === value).length) {
        return new Error(t('permissions.email_used'))
      }
      return true
    }
  }
})

const updatePermission = (id: number, type: PermissionType) => {
  emit('update', {
    id,
    type
  })
}
const deletePermission = (id: number) => {
  emit('delete', id)
}
const addPermission = () => {
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      return
    }
    emit('create', newPermission.value)
    newPermission.value.email = null
  })
}
</script>

<template>
  <div class="max-w-lg">
    <div
      v-for="p in permissions"
      :key="p.id"
      class="flex gap-2 justify-between pb-4"
    >
      <UserProfile :user="p.user" :align-right="false" class="justify-start" />
      <n-space>
        <div class="w-40">
          <n-tag v-if="p.type === 'owner'">
            {{ t('permission_types.owner') }}
          </n-tag>
          <n-select v-else v-model:value="p.type" :options="options" @update:value="updatePermission(p.id, p.type as PermissionType)" />
        </div>
        <n-button v-if="p.type !== 'owner'" @click="deletePermission(p.id)">
          <template #icon>
            <NaiveIcon name="mdi:delete" />
          </template>
        </n-button>
      </n-space>
    </div>
    <n-form ref="formRef" :model="newPermission" :rules="formRules" inline>
      <n-form-item path="email" :label="t('permissions.email')" class="grow">
        <n-input v-model:value="newPermission.email" />
      </n-form-item>
      <n-form-item path="type">
        <n-select v-model:value="newPermission.type" class="w-40" :options="options" />
      </n-form-item>
      <n-form-item>
        <n-button @click.prevent="addPermission()">
          {{ $t('permissions.add') }}
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>
