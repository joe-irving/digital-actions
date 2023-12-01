<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'
type RouterOutput = inferRouterOutputs<AppRouter>;

type PetitionList = RouterOutput['petition']['userList'];

const { $client } = useNuxtApp()
const localePath = useLocalePath()

const props = defineProps({
  campaignId: {
    type: Number,
    required: false,
    default: undefined
  }
})
const { data: petitions } = await $client.petition.userList.useQuery({
  campaignId: props.campaignId
})

const orderedPetitions = petitions.value
  ? petitions.value.sort((a: PetitionList[0], b: PetitionList[0]) => {
    const aDate = Date.parse(a.created)
    const bDate = Date.parse(b.created)
    return bDate - aDate
  })
  : []

const statusOrder = ref(['request_approval', 'draft', 'public', 'rejected'])
const groupedPetitions = statusOrder.value.map((status) => {
  return {
    status,
    petitions: orderedPetitions.filter(p => p.status === status)
  }
})
const displayPetitions = groupedPetitions.filter(s => !!s.petitions.length)
</script>

<template>
  <div>
    <n-grid cols="1 s:1 m:3" x-gap="10" responsive="screen">
      <n-gi v-for="status in displayPetitions" :key="status.status">
        <n-grid cols="1" y-gap="10">
          <n-gi v-for="petition in status.petitions" :key="petition.id">
            <NuxtLink :to="localePath(`/petition/${petition.id}`)">
              <div class="rounded shadow hover:shadow-md flex justify-space-between">
                <div class="p-4 flex-grow">
                  <n-space justify="space-between" :wrap-item="false">
                    <Nh2>{{ petition.title }}</Nh2>
                  </n-space>
                  <n-space>
                    <StatusTag :status="petition.status" />
                    <n-tag v-if="petition?.targetName" round>
                      <template #icon>
                        <NaiveIcon name="mdi:target" />
                      </template>
                      {{ petition.targetName }}
                    </n-tag>
                    <n-tag v-if="petition.location" round>
                      <template #icon>
                        <NaiveIcon name="mdi:map" />
                      </template>
                      <span v-if="petition.location.name">{{ petition.location.name }}, {{ petition.location.country }}</span>
                      <span v-else>{{ petition.location.display_name }}</span>
                    </n-tag>
                    <n-tag v-if="!campaignId && petition.petitionCampaign" round>
                      <template #icon>
                        <NaiveIcon name="mdi:clipboard-multiple-outline" />
                      </template>
                      {{ petition.petitionCampaign.title }}
                    </n-tag>
                  </n-space>
                </div>
                <div
                  v-if="petition.image"
                  :style="{
                    backgroundImage: `url('${petition.image.url}')`
                  }"
                  class="basis-1/4 bg-cover bg-no-repeat bg-center rounded-r"
                />
              </div>
            </NuxtLink>
          </n-gi>
        </n-grid>
      </n-gi>
    </n-grid>
  </div>
</template>
