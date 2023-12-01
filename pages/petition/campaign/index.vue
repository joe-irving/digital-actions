<script setup lang="ts">
const { $client } = useNuxtApp()
// get petition campaigns that user has permission to manage

const { data: campaigns } = await $client.petitionCampaign.userCampaigns.useQuery()

const breadcrumbs = ref([
  {
    title: 'menu.home',
    link: '/',
    icon: null
  },
  {
    title: 'menu.petition',
    link: '/petition',
    icon: null
  },
  {
    title: 'menu.campaign',
    link: '/petition/campaign',
    icon: null
  }
])
</script>

<template>
  <div>
    <TitleBar :title="$t('menu.petition_campaigns')" :breadcrumbs="breadcrumbs" class="p-4">
      <Np>{{ $t('pc_manage.about_petition_campaign') }}</Np>
    </TitleBar>
    <div class="p-4">
      <PetitionCampaignList v-if="campaigns" :campaigns="campaigns" />
    </div>
  </div>
</template>
