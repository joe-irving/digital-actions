<script setup lang="ts">
import type { FormValidationError } from 'naive-ui'
// import { PropType } from 'nuxt/dist/app/compat/capi'

defineProps({
  errors: {
    type: Array as PropType<FormValidationError[]>,
    default: () => []
  }
})
</script>

<template>
  <n-steps :vertical="true">
    <n-step v-for="(error, i) in errors.flat()" :key="i" :title="error.message" status="error" />
  </n-steps>
</template>
