<script setup lang="ts">

defineProps({
  endpoint: {
    type: String,
    default: ''
  },
  tagPrefix: {
    type: String,
    default: ''
  }
})

const submission = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  comments: ''
})
</script>

<template>
  <n-form :model="submission">
    <n-form-item path="firstName" :label="$t('petition_form.first_name_label')">
      <n-input v-model:value="submission.firstName" placeholder="" />
    </n-form-item>
    <n-form-item path="lastName" :label="$t('petition_form.last_name_label')">
      <n-input v-model:value="submission.lastName" placeholder="" />
    </n-form-item>
    <n-form-item path="email" :label="$t('petition_form.email_label')">
      <n-input v-model:value="submission.email" placeholder="" />
    </n-form-item>
    <n-form-item>
      <client-only><VueTelInput v-model="submission.phoneNumber" style-classes="mt-100" /></client-only>
    </n-form-item>
    <n-form-item>
      <n-input v-model:value="submission.comments" type="textarea" />
    </n-form-item>
    {{ submission }}
  </n-form>
</template>
