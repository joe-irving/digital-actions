<script lang="ts" setup>
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;

type CustomFields = RouterOutput['petition']['getPublic']['customFields'];

defineProps({
  fields: {
    type: Array as PropType<CustomFields>,
    default: () => []
  }
})

</script>

<template>
  <div>
    <!-- Loop through fields, create form item and field -->
    {{ fields }}
  </div>
</template>
