<script setup lang="ts">
const { $client } = useNuxtApp()
// get petition campaigns that user has permission to manage

const testCreate = () => {
  $client.petitionCampaign.create.mutate({
    title: 'Test title',
    tagPrefix: 'Another Test'
  })
}
</script>

<template>
  <div>
    <n-button @click="testCreate">
      Click me
    </n-button>
  </div>
</template>
