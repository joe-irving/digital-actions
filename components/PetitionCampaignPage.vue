<script setup lang="ts">
const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const { $client } = useNuxtApp()
const { data: petitionCampaign } = await $client.petitionCampaign.getPublic.useQuery({ id: props.id })
const { data: theme } = petitionCampaign.value?.styleThemeId ? await $client.styleTheme.get.useQuery(petitionCampaign.value?.styleThemeId) : { data: undefined }
const { data: petitions } = $client.petitionCampaign.getPublicList.useQuery({ id: props.id })

definePageMeta({
  layout: 'public',
  auth: false
})

useSeoMeta({
  title: petitionCampaign.value?.title,
  ogTitle: petitionCampaign.value?.title,
  ogImage: petitionCampaign.value?.defaultPetitionImage?.url
})
</script>

<template>
  <CustomThemeWrapper :theme="theme">
    <n-space class="mt-6 pt-16" vertical>
      <Nh1 class="text-center">
        {{ petitionCampaign?.title }}
      </Nh1>
    </n-space>

    <n-space justify="center" class="">
      <n-grid
        class="p-4"
        cols="1"
        responsive="screen"
        :x-gap="12"
        :y-gap="8"
        :layout-shift-disabled="true"
      >
        <n-grid-item v-for="petition in petitions" :key="petition.id" class="w-96">
          <PetitionCard
            :petition="petition"
            :default-image="petitionCampaign?.defaultPetitionImage?.url"
          />
        </n-grid-item>
      </n-grid>
    </n-space>

    <n-space justify="center" class="mb-8 mt-8">
      <NuxtLink :to="`/petition/${petitionCampaign?.id}/start?source=bottom_petition_list`">
        <n-button size="large">
          {{ $t("petition_campaign.create_your_own") }}
        </n-button>
      </NuxtLink>
    </n-space>
    <n-back-top :right="40" />
  </CustomThemeWrapper>
</template>
