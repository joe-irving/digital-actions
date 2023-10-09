<script lang="ts" setup>
const route = useRoute()
// const router = useRouter()
const { $client } = useNuxtApp()

const slug = route.params.slug.toString()

const updateCampaign = () => {
  if (!campaign.value) {
    return
  }
  $client.tweetCampaign.update.mutate({
    id: campaign.value.id,
    title: campaign.value.title,
    description: campaign.value.description,
    slug: campaign.value.slug
  })
}

const { data } = await $client.tweetCampaign.getPublic.useQuery({ slug })

const campaign = ref(data)
</script>

<template>
  <div>
    <form v-if="campaign">
      <input v-model="campaign.title" type="text">
      <input v-model="campaign.slug" type="text">
      <input v-model="campaign.description" type="text">
      <n-button @click="updateCampaign">
        Update
      </n-button>
    </form>
    <h1>{{ campaign?.targetListId }}</h1>
    <h1>{{ campaign?.description }}</h1>
  </div>
</template>
