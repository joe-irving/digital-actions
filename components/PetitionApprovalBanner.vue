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
// get permissions
const { $client } = useNuxtApp()
const { data: permissions } = await $client.petitionCampaign.getUserPermissions.useQuery({
  id: props.petitionCampaignId
})
const isApprover = permissions.value ? !!permissions.value.filter(p => ['approval', 'owner'].includes(p.type)).length : false

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
    <n-alert v-if="isApprover" type="info">
      <n-h2>{{ $t('petition.approval_question') }}</n-h2>
      <n-space>
        <n-button type="error" @click="updateStatus('rejected')">
          {{ $t('petition.reject') }}
        </n-button>
        <n-button type="success" @click="updateStatus('public')">
          {{ $t('petition.approve') }}
        </n-button>
      </n-space>
    </n-alert>
  </div>
</template>
