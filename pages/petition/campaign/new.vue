<script setup lang="ts">
const { $client } = useNuxtApp()

const breadcrumbItems = ref([
  {
    link: '/',
    title: null,
    icon: 'dashicons:admin-home'
  },
  {
    link: '/petition/campaign',
    title: 'menu.petition_campaign',
    icon: null
  },
  {
    link: '/petition/campaign/new',
    title: 'menu.new',
    icon: null
  }
])

const petitionCampaign = ref({
  title: '',
  tagPrefix: '',
  actionNetworkCredentialId: 0
})

const createCampaign = async () => {
  const campaign = await $client.petitionCampaign.create.mutate(petitionCampaign.value)
  console.log(campaign)
}
</script>

<template>
  <div>
    <TitleBar
      title="petition_campaign.create_new"
      :breadcrumbs="breadcrumbItems"
    />
    <div>
      <n-form :model="petitionCampaign">
        <n-form-item path="title">
          <n-input v-model:value="petitionCampaign.title" placeholder="title" />
        </n-form-item>
        <n-form-item path="tagPrefix">
          <n-input v-model:value="petitionCampaign.tagPrefix" placeholder="tagPrefix" />
        </n-form-item>
        <n-form-item path="tagPrefix">
          <n-input-number v-model:value="petitionCampaign.actionNetworkCredentialId" placeholder="actionNetworkCredentialId" />
        </n-form-item>
        <n-button @click.prevent="createCampaign">
          Create!
        </n-button>
        {{ petitionCampaign }}
      </n-form>
    </div>
  </div>
</template>
