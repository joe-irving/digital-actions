<script setup lang="ts">

const { $client } = useNuxtApp()
const route = useRoute()
const petitionCampaignId = parseInt(route.params.id instanceof Array ? route.params.id[0] : route.params.id)
const { data: petitionCampaign } = await $client.petitionCampaign.getPublic.useQuery(petitionCampaignId)

definePageMeta({
  layout: 'public'
})
</script>

<template>
  <div>{{ petitionCampaign }}</div>
</template>
