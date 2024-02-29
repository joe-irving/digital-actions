<script setup lang="ts">
const { $client } = useNuxtApp()
// const { signIn } = useAuth()
const route = useRoute()
// const { $i18n } = useNuxtApp()

// const { data: user } = $client.user.me.useQuery()

// Get id prop, if it is an int then get the campaign, if not create without link to campaign?
const petitionCampaignId = parseInt(route.params.id instanceof Array ? route.params.id[0] : route.params.id)
const { data: petitionCampaign } = await $client.petitionCampaign.getPublic.useQuery({ id: petitionCampaignId, includeStyle: true })
// const themeOptions = ref(petitionCampaign.value?.themes.map((t): SelectOption => { return { label: t.title, value: t.id } }))
if (!petitionCampaign.value) {
  navigateTo('/')
}

definePageMeta({
  layout: 'public',
  auth: false
})
</script>
<template>
  <div>
    - page outer
    - pages inside
    - navigation buttons
  </div>
</template>
