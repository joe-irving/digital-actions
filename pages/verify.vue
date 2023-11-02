<script setup lang="ts">
const route = useRoute()

const email = route.query.email?.toString()

definePageMeta({
  layout: 'public',
  auth: false
})
</script>

<template>
  <n-space justify="center" align-items="center">
    <n-space vertical>
      <n-h1>{{ $t('verification.check_email') }}</n-h1>
      <n-h2 v-if="email">
        {{ $t('verification.email_address_reminder', {email: email}) }}
      </n-h2>
      <n-p>{{ $t('verification.close_tab') }}</n-p>
    </n-space>
  </n-space>
</template>
