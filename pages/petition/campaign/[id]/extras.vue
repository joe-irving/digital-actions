<script setup lang="ts">
const { $client } = useNuxtApp()
const route = useRoute()

const petitionCampaignId = parseInt(route.params.id.toString())

const makeTags = () => {
  $client.petitionCampaign.createTags.mutate(petitionCampaignId)
}
</script>

<template>
  <div>
    <n-button @click="makeTags()">
      Make tags
    </n-button>
  </div>
</template>
