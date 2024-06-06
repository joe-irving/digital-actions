<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;

type CustomFields = RouterOutput['petition']['getManage']['customFields']
// Get list of fields, pass to edit field and deal with ordering
defineProps({
  fields: {
    type: Array as PropType<CustomFields>,
    required: true
  }
})
</script>

<template>
  <div>
    <EditCustomField v-for="field in fields" :key="field.id" :field="field" />
  </div>
</template>
