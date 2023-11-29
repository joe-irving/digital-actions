<script setup lang="ts">
defineProps({
  tag: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<template>
  <n-card>
    <n-tag>{{ tag }}</n-tag>
    <Np>{{ description }}</Np>
  </n-card>
</template>
