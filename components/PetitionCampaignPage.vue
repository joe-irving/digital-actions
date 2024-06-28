<script setup lang="ts">
import type { inferRouterInputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

// Set up types
type RouterInput = inferRouterInputs<AppRouter>;

type PetitionFilter = NonNullable<RouterInput['petitionCampaign']['getPublicList']['filter']>;

// Define Properties
const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

// Import tools
const { $client } = useNuxtApp()
const localePath = useLocalePath()
const { t } = useI18n()

// Get data from backend
const { data: petitionCampaign } = await $client.petitionCampaign.getPublic.useQuery({ id: props.id })
const { data: theme } = petitionCampaign.value?.styleThemeId ? await $client.styleTheme.get.useQuery(petitionCampaign.value?.styleThemeId) : { data: undefined }
const { data: petitions } = $client.petitionCampaign.getPublicList.useQuery({ id: props.id })

// Define menu
const menuItems = ref([
  {
    title: t('petition.start_a_campaign'),
    link: localePath(`/petition/${petitionCampaign.value?.id}/start?source=menu`),
    type: 'button'
  }
])

// Filtering
const themeOptions = ref(petitionCampaign.value?.themes.map((t) => {
  return {
    label: t.title,
    value: t.id
  }
}))

const petitionFilter = ref<PetitionFilter>({
  theme: [],
  search: ''
})

const updateFiltering = async () => {
  const { data: filteredPetitions } = await $client.petitionCampaign.getPublicList.useQuery({
    id: props.id,
    filter: petitionFilter.value
  })
  petitions.value = filteredPetitions.value
}

watch(() => petitionFilter.value.theme, updateFiltering)

watch(() => petitionFilter.value.search, () => {
  if (!petitionFilter.value.search) {
    return
  }
  petitionFilter.value.search = petitionFilter.value.search.replace(/[^ a-zA-Z0-9-]/gm, '')
})

// Share info
useSeoMeta({
  title: petitionCampaign.value?.title,
  ogTitle: petitionCampaign.value?.title,
  ogImage: petitionCampaign.value?.defaultPetitionImage?.url
})
</script>

<template>
  <CustomThemeWrapper :theme="theme">
    <template #menu>
      <div class="flex content-center justify-center">
        <NuxtLink v-for="item in menuItems" :key="item.link" :to="item.link" class="flex">
          <n-button v-if="item.type === 'button'" type="primary" class="my-auto">
            {{ item.title }}
          </n-button>
          <span v-else>{{ item.title }}</span>
        </NuxtLink>
      </div>
    </template>
    <n-space class="mt-6 pt-16" vertical>
      <Nh1 class="text-center">
        {{ petitionCampaign?.title }}
      </Nh1>
    </n-space>
    <div class="flex justify-center">
      <div class="w-[600px] max-w-full flex justify-stretch gap-x-4">
        <n-form-item path="theme" :label="$t('petition.search')" class="w-1/2">
          <n-input v-model:value="petitionFilter.search" @blur="updateFiltering()" />
        </n-form-item>
        <n-form-item path="theme" :label="$t('petition.themes')" class="w-1/2">
          <n-select v-model:value="petitionFilter.theme" :options="themeOptions" multiple clearable @update="updateFiltering()" />
        </n-form-item>
      </div>
    </div>
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

    <n-back-top :right="40" />
  </CustomThemeWrapper>
</template>
