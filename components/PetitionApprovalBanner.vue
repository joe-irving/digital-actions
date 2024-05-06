<script setup lang="ts">
// only show if the user is a petition campaign admin or approver and the petition is awaiting approval
const props = defineProps({
  petitionCampaignId: {
    type: Number,
    required: true
  },
  petitionId: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['update'])
const localePath = useLocalePath()
const { $client } = useNuxtApp()

const updateStatus = async (status: 'public' | 'rejected') => {
  const newPetition = await $client.petition.approval.mutate({
    petitionId: props.petitionId,
    petitionCampaignId: props.petitionCampaignId,
    status
  })
  emit('update', newPetition.status)
  return newPetition.status
}
</script>

<template>
  <div>
    <div>
      <n-alert v-if="status=='request_approval'" type="info">
        <Nh2>{{ $t('petition.approval_question') }}</Nh2>
        <n-space>
          <n-button type="error" @click="updateStatus('rejected')">
            {{ $t('petition.reject') }}
          </n-button>
          <n-button type="success" @click="updateStatus('public')">
            {{ $t('petition.approve') }}
          </n-button>
        </n-space>
      </n-alert>
      <div v-else>
        <NuxtLink :to="localePath(`/petition/campaign/${petitionCampaignId}`)">
          <n-button>{{ $t('petition.back_to_campaign') }}</n-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
