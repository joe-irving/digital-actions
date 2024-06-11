<script setup lang="ts">
const { $client } = useNuxtApp()

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const { data: petition } = await $client.petition.getPublic.useQuery({
  id: props.id
})
const { data: theme } = petition.value?.petitionCampaign?.styleThemeId ? await $client.styleTheme.get.useQuery(petition.value?.petitionCampaign?.styleThemeId) : { data: undefined }
const { data: signatures } = $client.petition.signatureCount.useQuery({
  id: props.id
})
const shareUrl = ref(useShareUrl(petition.value?.slug || ''))

const success = ref(false)

const tagList = ref<string[]>([
  petition.value?.petitionCampaign?.actionNetworkAllTag || '',
  petition.value?.petitionCampaign?.actionNetworkResponseTag || ''
].filter((i) => {
  return (i.length > 0)
}))

for (const tagName of (petition.value?.petitionThemes || [])) {
  tagList.value.push(`[${petition.value?.petitionCampaign?.tagPrefix}] Theme - ${tagName.title}`)
}

// Set SEO Meta
useSeoMeta({
  title: petition.value?.title,
  ogTitle: petition.value?.title,
  ogImage: petition.value?.image?.url || petition.value?.petitionCampaign?.defaultPetitionImage?.url
})
</script>

<template>
  <CustomThemeWrapper :theme="theme">
    <n-space justify="center" class="mt-10 mb-10 pt-16">
      <div v-if="!success" class="flex justify-center gap-10 items-start">
        <n-space class="max-w-lg border-0 sm:border shadow-none sm:shadow-md rounded p-4">
          <n-space vertical>
            <n-image :src="petition?.image?.url" class="hidden sm:block" />
            <Nh1>{{ petition?.title }}</Nh1>
            <PetitionSignatureCounter :signatures="signatures" class="sm:hidden" />
            <PetitionForm
              class="block sm:hidden mb-8"
              :endpoint="(petition?.actionNetworkPetitionId || '') + '/signatures'"
              :pc-endpoint="(petition?.petitionCampaign?.petitionEndpointURL || '') + '/signatures'"
              :tag-name="`[${petition?.petitionCampaign?.tagPrefix}]: ${petition?.id}`"
              :tag-prefix="petition?.petitionCampaign?.tagPrefix"
              :tag-list="tagList"
              :group-name="petition?.petitionCampaign?.groupName || ''"
              :title="petition?.title || ''"
              :url="shareUrl"
              :custom-fields="petition?.customFields"
              @success="() => success = true"
            />
            <!-- TODO: When time, use the JSON output from tiptap, then store and parse taht -->
            <div v-html="petition?.content" />
          </n-space>
        </n-space>
        <div class="hidden sm:flex">
          <div class="max-w-xs w-full border-0 sm:border shadow-none sm:shadow-md rounded p-4">
            <PetitionSignatureCounter :signatures="signatures" class="w-full" />
            <Nh2>{{ $t("petition_form.sign_petition") }}</Nh2>
            <PetitionForm
              :endpoint="(petition?.actionNetworkPetitionId || '') + '/signatures'"
              :pc-endpoint="(petition?.petitionCampaign?.petitionEndpointURL || '') + '/signatures'"
              :tag-name="`[${petition?.petitionCampaign?.tagPrefix}]: ${petition?.id}`"
              :tag-prefix="petition?.petitionCampaign?.tagPrefix"
              :tag-list="tagList"
              :group-name="petition?.petitionCampaign?.groupName || ''"
              :title="petition?.title || ''"
              :url="shareUrl"
              :custom-fields="petition?.customFields"
              @success="() => success = true"
            />
          </div>
        </div>
      </div>
      <div v-else class="rounded shadow-md p-4 ">
        <Nh2>
          {{ $t('petition_form.share') }}
        </Nh2>
        <ShareTile
          :title="petition?.sharingInformation?.shareTitle"
          :tweet="petition?.sharingInformation?.tweet"
          :whatsapp="petition?.sharingInformation?.whatsappShareText"
          :description="petition?.sharingInformation?.description"
          :url="shareUrl"
        />
      </div>
    </n-space>
  </CustomThemeWrapper>
</template>
