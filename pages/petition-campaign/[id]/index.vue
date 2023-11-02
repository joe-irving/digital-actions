<script setup lang="ts">

const { $client } = useNuxtApp()
const route = useRoute()
const petitionCampaignId = parseInt(route.params.id instanceof Array ? route.params.id[0] : route.params.id)
const { data: petitionCampaign } = await $client.petitionCampaign.getPublic.useQuery({ id: petitionCampaignId, includeStyle: true })

// TODO handle not found

definePageMeta({
  layout: 'public',
  auth: false
})
</script>

<template>
  <CustomThemeWrapper :theme="petitionCampaign.styleTheme">
    <n-layout-content>another</n-layout-content>
    <n-space>test</n-space>
    {{ petitionCampaign.title }}
    <n-card v-for="i in [...Array(50).keys()]" :key="i">
      Test card {{ i }}
    </n-card>
  </CustomThemeWrapper>
</template>
