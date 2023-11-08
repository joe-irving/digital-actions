<script setup lang="ts">
const { $client } = useNuxtApp()
const localePath = useLocalePath()

const props = defineProps({
  campaignId: {
    type: Number,
    required: true
  }
})
const { data: petitions } = await $client.petitionCampaign.getManageList.useQuery({
  id: props.campaignId
})

const orderedPetitions = petitions.value
  ? petitions.value.sort((a, b) => {
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
// const approve = async (id: number) => {
//   const petition = await $client.petition.approval.mutate({
//     petitionId: id,
//     petitionCampaignId,
//     approved: true
//   })
//   return petition
// }
</script>

<template>
  <div>
    <n-grid cols="1 s:1 m:3" x-gap="10" responsive="screen">
      <n-gi v-for="status in displayPetitions" :key="status.status">
        <n-grid cols="1" y-gap="10">
          <n-gi v-for="petition in status.petitions" :key="petition.id">
            <NuxtLink :to="localePath(`/petition/${petition.id}`)">
              <div class="rounded shadow flex justify-space-between">
                <div class="p-4 flex-grow">
                  <n-space justify="space-between" :wrap-item="false">
                    <n-h2>{{ petition.title }}</n-h2>
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
                  </n-space>
                </div>
                <div
                  v-if="petition.image"
                  :style="{
                    backgroundImage: `url('${petition.image.url}')`
                  }"
                  class="basis-1/4 bg-cover bg-no-repeat bg-center"
                />
              </div>
            </NuxtLink>
          </n-gi>
        </n-grid>
      </n-gi>
    </n-grid>
  </div>
</template>
