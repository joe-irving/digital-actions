<script setup lang="ts">
defineProps({
  status: {
    type: String,
    required: true
  }
})
</script>

<template>
  <span>
    <n-tag v-if="status === 'public'" round type="success">
      {{ $t('petition.public') }}
    </n-tag>
    <n-tag v-else-if="status === 'draft'" round>
      {{ $t('petition.draft') }}
    </n-tag>
    <n-tag v-else-if="status === 'rejected'" round type="error">
      {{ $t('petition.rejected') }}
    </n-tag>
    <n-tag v-else-if="status === 'request_approval'" round type="warning">
      {{ $t('petition.awaiting_approval') }}
    </n-tag>
  </span>
</template>
