<script setup lang="ts">
import { h } from 'vue'
import type { inferRouterOutputs } from '@trpc/server'
import { NewUserForm } from '#components'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;
type UserOutput = RouterOutput['user']['me']['user'];

const dialog = useDialog()
const { t } = useI18n()
const { $client } = useNuxtApp()
const { status: authStatus } = useAuth()
const user = ref<UserOutput>(null)

// Function to update user
const userValueUpdated = (update: UserOutput) => {
  user.value = update
}

const updateUser = async (update: UserOutput) => {
  user.value = update
  if (update == null) {
    return null
  }
  const updatedUser = await $client.user.updateSelf.mutate({
    name: update.name || undefined,
    phone: update.phone || undefined,
    country: update.country || undefined,
    postCode: update.postCode || undefined
  })
  dialog.destroyAll()
  return updatedUser
}

onMounted(async () => {
  if (authStatus.value === 'authenticated') {
    const { data: session } = await $client.user.me.useQuery()
    if (!session.value?.user?.name && session.value?.user) {
      const user = session.value?.user
      dialog.create({
        title: t('user.no_details'),
        content: () => h(NewUserForm, {
          onUpdate: (update: UserOutput) => {
            userValueUpdated(update)
          },
          onSubmit: (update: UserOutput) => {
            updateUser(update)
          },
          user
        })
      })
    }
  }
})
</script>

<template>
  <slot />
</template>
