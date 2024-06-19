<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'

const { $client } = useNuxtApp()
const { t } = useI18n()

const { data: users } = await $client.user.all.useQuery()

const columns = ref<DataTableColumns>([
  {
    title: t('admin.name'),
    key: 'name'
  },
  {
    title: t('admin.email'),
    key: 'email'
  },
  {
    title: t('admin.phone'),
    key: 'phone'
  }
])

</script>

<template>
  <div class="p-4">
    <n-data-table
      v-if="users"
      :columns="columns"
      :data="users"
    />
  </div>
</template>
