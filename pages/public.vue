<script setup lang="ts">
definePageMeta({ auth: false })

const { $client } = useNuxtApp()

// const user = await $client.user.me.useQuery()

const { data: tweetCampaigns } = await $client.tweetCampaign.all.useQuery()

async function newTweetCampaign () {
  const newCamp = await $client.tweetCampaign.create.mutate({
    title: 'Some title',
    description: 'Some description',
    targetListId: 1
  })
  if (tweetCampaigns.value) {
    tweetCampaigns.value.push(newCamp)
  }
  return newCamp
}
</script>

<template>
  <div>
    <p>Public Page</p>
    <LoginButtons />
    <button @click="newTweetCampaign">
      New Tweet Campaign
    </button>
    <pre>{{ tweetCampaigns }}</pre>
  </div>
</template>
