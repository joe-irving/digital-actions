<script setup lang="ts">
const { $client } = useNuxtApp()
const route = useRoute()

const petitionCampaignId = parseInt(route.params.id.toString())

const { data: petitions } = await $client.petitionCampaign.getManageList.useQuery({
  id: petitionCampaignId
})

const approve = async (id: number) => {
  const petition = await $client.petition.approval.mutate({
    petitionId: id,
    petitionCampaignId,
    approved: true
  })
  return petition
}
</script>

<template>
  <div>
    Manage petition campaign her
    <n-ul>
      <n-li v-for="petition in petitions" :key="petition.id" @click="approve(petition.id)">
        {{ petition.title }}
      </n-li>
    </n-ul>
  </div>
</template>
