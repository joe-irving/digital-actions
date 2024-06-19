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
    <div
      v-if="petitions && petitions.length >= 1"
      class="p-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-stretch"
      cols="3 m:3 s:2 1"
      responsive="screen"
      :x-gap="12"
      :y-gap="8"
      :layout-shift-disabled="false"
    >
      <PetitionCard
        v-for="petition in petitions"
        :key="petition.id"
        :petition="petition"
        :default-image="petitionCampaign?.defaultPetitionImage?.url"
        class=""
      />
    </div>

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
