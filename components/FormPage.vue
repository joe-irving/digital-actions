<script setup lang="ts">
defineProps({
  page: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div v-if="currentPage == page">
    <slot />
  </div>
</template>
