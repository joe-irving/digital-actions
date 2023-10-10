<script setup lang="ts">
defineProps({
  name: {
    type: String,
    default: ''
  },
  photo: {
    type: String || null,
    required: false,
    default: null
  },
  authenticated: Boolean
})
</script>

<template>
  <div class="profile-box" />
</template>
