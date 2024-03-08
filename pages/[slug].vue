<script setup lang="ts">
const { $client } = useNuxtApp()
const route = useRoute()

const { data: slug } = await $client.slug.get.useQuery({
  slug: route.params.slug.toString()
})

// TODO better 404 page

definePageMeta({
  auth: false,
  layout: 'public'
})
</script>

<template>
  <div>
    <PetitionPage v-if="slug?.petition" :id="slug.petition?.id" />
    <PetitionCampaignPage v-else-if="slug?.petitionCampaign" :id="slug.petitionCampaign?.id" />
    <div v-else>
      Not found!
    </div>
  </div>
</template>
