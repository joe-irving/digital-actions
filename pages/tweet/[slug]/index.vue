<script lang="ts" setup>
const route = useRoute()
// const router = useRouter()
const { $client } = useNuxtApp()

const slug = route.params.slug.toString()

const { data: campaign } = await $client.tweetCampaign.getPublic.useQuery({ slug })
// Get Tweets generated tweets
</script>

<template>
  <div>
    <n-h1>{{ campaign?.title }}</n-h1>
  </div>
</template>
