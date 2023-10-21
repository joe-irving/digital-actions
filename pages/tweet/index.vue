<script setup lang="ts">
import { TweetCampaignSummary } from '~/types'

const { $client } = useNuxtApp()

const { data: campaignData } = $client.tweetCampaign.userCampaigns.useQuery()

const campaigns = computed(() => {
  if (!campaignData.value || !campaignData.value.length) {
    return []
  }
  return campaignData.value.map((c): TweetCampaignSummary => {
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      tweetCount: c._count.tweets,
      targetListName: c.targetList.name,
      userPermissionLevel: c.tweetCampaignPermissions.map(p => p.type),
      createdDate: c.created,
      updatedDate: c.updated
    }
  })
})
</script>

<template>
  <div>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <NuxtLink to="/">
          <NaiveIcon name="dashicons:admin-home" />
        </NuxtLink>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <NuxtLink to="/tweet">
          Tweet Campaigns
        </NuxtLink>
      </n-breadcrumb-item>
    </n-breadcrumb>
    <CampaignList :campaigns="campaigns" />
    <NuxtLink to="/tweet/new">
      <n-button>
        Create Campaign
      </n-button>
    </NuxtLink>
  </div>
</template>
