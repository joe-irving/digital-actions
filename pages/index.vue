<script setup lang="ts">
const { signIn, status } = useAuth()
const { name: siteName } = useSiteConfig()
const { $client } = useNuxtApp()

const { data: petitionCampaigns } = await $client.petitionCampaign.userCampaigns.useLazyQuery()

definePageMeta({ auth: false })
</script>

<template>
  <div class="p-4">
    <div v-if="status === 'authenticated'">
      <Nh1>{{ $t('your_actions') }}</Nh1>
      <div class="flex flex-wrap">
        <div class="xl:basis-1/2">
          <Nh2>{{ $t('menu.petitions') }}</Nh2>
          <PetitionApprovalList />
        </div>
        <div v-if="petitionCampaigns && petitionCampaigns.length" class="lg:basis-1/2">
          <Nh2>{{ $t('menu.petition_campaigns') }}</Nh2>
          <PetitionCampaignList :campaigns="petitionCampaigns" />
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <Nh1>{{ siteName }}</Nh1>
      <Nh2>{{ $t("intro_text") }}</Nh2>
      <n-button size="large" type="success" @click="signIn(undefined)">
        {{ $t('profile.log_in') }}
      </n-button>
    </div>
  </div>
</template>
