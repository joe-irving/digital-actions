<script setup lang="ts">
// Get and set up petition
import { useDialog } from 'naive-ui'
import { h } from 'vue'
import { NaiveIcon, ShareTile } from '#components'
const route = useRoute()
const router = useRouter()
const { $client } = useNuxtApp()
const { url: siteUrl } = useSiteConfig()
const localePath = useLocalePath()
const dialog = useDialog()
const { t } = useI18n()

const verificationToken = route.query.token?.toString() || undefined
const { data: petition } = await $client.petition.getManage.useQuery({
  id: parseInt(route.params.id.toString()),
  token: verificationToken
})
if (petition.value && verificationToken) {
  router.push({
    query: {
      token: undefined
    }
  })
}
if (!petition.value) {
  await navigateTo('/petition')
}
const { data: petitionCampaign } = await $client.petitionCampaign.getPublic.useQuery({
  id: petition.value?.petitionCampaignId || undefined
})

const shareUrl = ref(siteUrl + localePath(`/p/${petition.value?.slug}`))

const createShareDialog = () => {
  dialog.create({
    title: t('petition.share_petition'),
    icon: () => h(NaiveIcon, { name: 'material-symbols:share' }),
    content: () => h(ShareTile, {
      title: petition.value?.sharingInformation?.shareTitle,
      tweet: petition.value?.sharingInformation?.tweet,
      whatsapp: petition.value?.sharingInformation?.whatsappShareText,
      description: petition.value?.sharingInformation?.description,
      url: shareUrl.value
    })
  })
}
</script>

<template>
  <div class="p-4">
    <n-page-header>
      <n-tabs>
        <n-tab-pane name="overview" :tab="$t('petition.overview')">
          <n-grid cols="1 sm:1 md:2" :x-gap="10" :y-gap="10" responsive="screen">
            <n-gi><SignatureCount :count="petition?.signatures" /></n-gi>
            <n-gi>
              <n-card :title="$t('petition.share_petition')">
                <ShareTile
                  v-if="petition?.sharingInformation"
                  :title="petition?.sharingInformation?.shareTitle"
                  :tweet="petition?.sharingInformation?.tweet"
                  :whatsapp="petition?.sharingInformation?.whatsappShareText"
                  :description="petition?.sharingInformation?.description"
                  :url="shareUrl"
                />
              </n-card>
            </n-gi>
          </n-grid>
        </n-tab-pane>
        <n-tab-pane name="edit" :tab="$t('petition.edit')">
          <EditPetitionForm
            :id="petition?.id"
            :title="petition?.title"
            :content="petition?.content"
            :target-name="petition?.targetName || undefined"
            :themes="petition?.petitionThemes"
            :image="petition?.image || undefined"
            :available-themes="petitionCampaign?.themes"
            :limit-countries="petitionCampaign?.limitLocationCountry"
            @update="(update) => petition = {...update, signatures: petition.signatures}"
          />
        </n-tab-pane>
      </n-tabs>
      <template #header>
        <n-breadcrumb>
          <n-breadcrumb-item>
            <NuxtLink :to="localePath('/')">
              {{ $t('menu.home') }}
            </NuxtLink>
          </n-breadcrumb-item>
          <n-breadcrumb-item>
            <NuxtLink :to="localePath('/petition')">
              {{ $t('menu.petition') }}
            </NuxtLink>
          </n-breadcrumb-item>
          <n-breadcrumb-item>
            <NuxtLink :to="localePath('/petition/' + petition?.id + '/manage')">
              {{ petition?.title }}
            </NuxtLink>
          </n-breadcrumb-item>
        </n-breadcrumb>
      </template>
      <template #title>
        <n-h1>{{ petition?.title }}</n-h1>
      </template>
      <template #extra>
        <n-space>
          <n-tag round :type="petition?.approved ? 'success' : 'warning'">
            {{ petition?.approved ? $t('petition.approved') : $t('petition.awaiting_approval') }}
          </n-tag>
          <n-button v-if="petition?.approved" @click="createShareDialog">
            {{ $t('petition.share') }}
          </n-button>
        </n-space>
      </template>
    </n-page-header>
  </div>
</template>
