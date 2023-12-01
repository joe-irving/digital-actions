<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'
type RouterOutput = inferRouterOutputs<AppRouter>;

type CampaignList = RouterOutput['petitionCampaign']['userCampaigns'];

defineProps({
  campaigns: {
    type: Array as PropType<CampaignList>,
    required: true
  }
})

const localePath = useLocalePath()
</script>

<template>
  <n-grid cols="1 s:1 m:3 l:5" x-gap="10" y-gap="10" responsive="screen">
    <n-gi v-for="campaign in campaigns" :key="campaign.id">
      <NuxtLink :to="localePath(`/petition/campaign/${campaign.id}`)">
        <div class="rounded shadow hover:shadow-md duration-100">
          <div
            :style="{
              'background-image': `url('${campaign.defaultPetitionImage?.url}')`
            }"
            class="h-32 bg-cover bg-no-repeat bg-center rounded-t"
          />
          <div class="p-2">
            <Nh2>{{ campaign.title }}</Nh2>
            <n-space gap="10">
              <StatusTag :status="campaign.status" />
              <n-tag round type="info">
                {{ campaign._count.petitions }} {{ $t('menu.petitions') }}
              </n-tag>
              <n-tag round type="info">
                {{ campaign._count.themes }} {{ $t('pc_manage.themes') }}
              </n-tag>
            </n-space>
          </div>
        </div>
      </NuxtLink>
    </n-gi>
  </n-grid>
</template>
