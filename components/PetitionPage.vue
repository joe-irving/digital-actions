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
const { data: signatures } = $client.petition.signatureCount.useQuery({
  id: props.id
})
const shareUrl = ref(useShareUrl(petition.value?.slug || ''))

const success = ref(false)
</script>

<template>
  <CustomThemeWrapper :theme="petition?.petitionCampaign?.styleTheme">
    <n-space justify="center" class="mt-10 mb-10">
      <div v-if="!success" class="flex justify-center gap-10 items-start">
        <n-space class="max-w-lg border-0 sm:border shadow-none sm:shadow-md rounded p-4">
          <n-space>
            <n-image :src="petition?.image?.url" class="hidden sm:block" />
            <n-h1>{{ petition?.title }}</n-h1>
            <PetitionForm
              class="block sm:hidden mb-8"
              :endpoint="(petition?.actionNetworkPetitionId || '') + '/signatures'"
              :tag-name="`[${petition?.petitionCampaign?.tagPrefix}]: ${petition?.id}`"
              :tag-prefix="petition?.petitionCampaign?.tagPrefix"
              :tag-list="[petition?.petitionCampaign?.actionNetworkAllTag, petition?.petitionCampaign?.actionNetworkResponseTag]"
              :group-name="petition?.petitionCampaign?.groupName"
              @success="() => success = true"
            />
            <!-- TODO: When time, use the JSON output from tiptap, then store and parse taht -->
            <div v-html="petition?.content" />
          </n-space>
        </n-space>
        <div class="hidden sm:flex">
          <n-space class="max-w-xs border-0 sm:border shadow-none sm:shadow-md rounded p-4">
            <PetitionForm
              :endpoint="(petition?.actionNetworkPetitionId || '') + '/signatures'"
              :tag-name="`[${petition?.petitionCampaign?.tagPrefix}]: ${petition?.id}`"
              :tag-prefix="petition?.petitionCampaign?.tagPrefix"
              :tag-list="[petition?.petitionCampaign?.actionNetworkAllTag, petition?.petitionCampaign?.actionNetworkResponseTag]"
              :group-name="petition?.petitionCampaign?.groupName"
              @success="() => success = true"
            />
          </n-space>
        </div>
      </div>
      <div v-else class="rounded shadow-md p-4 ">
        <n-h2>
          {{ $t('petition_form.share') }}
        </n-h2>
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