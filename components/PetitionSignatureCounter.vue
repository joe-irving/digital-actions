<script setup lang="ts">
// some comment
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;
type Signatures = RouterOutput['petition']['signatureCount'];

const props = defineProps({
  signatures: {
    type: Object as PropType<Signatures>,
    required: true
  }
})
const count = ref(12323)
const target = computed(() => useGetNextTarget(count.value))
</script>

<template>
  <div>
    <div>{{ count }} : {{ target }}</div>
    <div><n-input-number v-model:value="count" /></div>
  </div>
</template>
