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
      <Nh1>{{ $t('verification.check_email') }}</Nh1>
      <Nh2 v-if="email">
        {{ $t('verification.email_address_reminder', {email: email}) }}
      </Nh2>
      <Np>{{ $t('verification.close_tab') }}</Np>
    </n-space>
  </n-space>
</template>
