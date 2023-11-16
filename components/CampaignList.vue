<script setup lang="ts">
import type { TweetCampaignSummary } from '~/types'

defineProps({
  campaigns: {
    type: Array as PropType<TweetCampaignSummary[]>,
    default: () => []
  }
})
</script>

<template>
  <n-space vertical class="campaign-list">
    <n-card
      v-for="campaign in campaigns"
      :key="campaign.id"
      :title="campaign.title"
      :href="`/tweet/${campaign.id}/manage`"
    >
      <template #header-extra>
        <n-tag>{{ campaign.tweetCount }} tweets</n-tag>
      </template>
      <NaiveIcon
        name="icon-park-twotone:aiming"
      /> {{ campaign.targetListName }}
      <template #action>
        <n-space justify="end">
          <NuxtLink :to="`/tweet/${campaign.id}/manage`">
            <n-button>Manage</n-button>
          </NuxtLink>
          <NuxtLink :to="`/tweet/${campaign.id}`">
            <n-button>View</n-button>
          </NuxtLink>
        </n-space>
      </template>
    </n-card>
  </n-space>
</template>
