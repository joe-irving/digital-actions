<script setup lang="ts">
import { NaiveIcon, ShareTile } from '#components'

const { $client } = useNuxtApp()
const route = useRoute()
const localePath = useLocalePath()
const dialog = useDialog()
const i18n = useI18n()
const { url: siteUrl } = useSiteConfig()

const petitionCampaignId = parseInt(route.params.id.toString())
const { data: campaign } = await $client.petitionCampaign.getManage.useQuery({
  id: petitionCampaignId
})

if (!campaign) {
  navigateTo('/petition/campaign')
}

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
  },
  {
    title: campaign.value?.title || '',
    link: `/petition/campaign/${campaign.value?.id}`,
    icon: null
  }
])
const shareUrl = ref(siteUrl + localePath(`/${campaign.value?.slug}`))
const campaignEdit = campaign.value
  ? {
      title: campaign.value.title,
      description: campaign.value.description,
      themes: campaign.value.themes.map(t => t.title),
      groupName: campaign.value.groupName,
      defaultImage: campaign.value.defaultPetitionImage,
      limitLocationCountry: campaign.value.limitLocationCountry
    }
  : undefined

const createShareDialog = () => {
  dialog.create({
    title: i18n.t('pc_manage.share_campaign'),
    icon: () => h(NaiveIcon, { name: 'material-symbols:share' }),
    content: () => h(ShareTile, {
      title: campaign.value?.sharingInformation?.shareTitle,
      tweet: campaign.value?.sharingInformation?.tweet,
      whatsapp: campaign.value?.sharingInformation?.whatsappShareText,
      description: campaign.value?.sharingInformation?.description,
      url: shareUrl.value
    })
  })
}
</script>

<template>
  <div>
    <div v-if="campaign">
      <TitleBar :title="campaign?.title" :breadcrumbs="breadcrumbs">
        <n-row>
          <n-col :span="3">
            <n-statistic :label="$t('pc_manage.petitions')">
              {{ campaign?._count?.petitions }}
            </n-statistic>
          </n-col>
        </n-row>
        <template #extra>
          <n-button @click="createShareDialog">
            {{ $t('pc_manage.share') }}
          </n-button>
        </template>
      </TitleBar>
      <div class="p-4">
        <n-tabs>
          <n-tab-pane name="overview" :tab="$t('pc_manage.overview')">
            Key stats, action network connection info (tag names etc)
          </n-tab-pane>
          <n-tab-pane name="petitions" :tab="$t('pc_manage.petitions')">
            <PetitionApprovalList :campaign-id="campaign.id" />
          </n-tab-pane>
          <n-tab-pane name="theme" :tab="$t('pc_manage.theme')">
            Theme editor here
          </n-tab-pane>
          <n-tab-pane name="edit" :tab="$t('pc_manage.edit')">
            <EditPetitionCampaignForm v-if="campaignEdit" :campaign="campaignEdit" />
          </n-tab-pane>
          <n-tab-pane name="admins" :tab="$t('pc_manage.admins')">
            Admins and permission setting
          </n-tab-pane>
        </n-tabs>
      </div>
      <NuxtLink :to="localePath(`/petition/${campaign?.id}/start`)">
        <n-button class="fixed right-10 bottom-10 p-4" circle size="large">
          <template #icon>
            <div class="m-4">
              <NaiveIcon name="mdi:plus" />
            </div>
          </template>
        </n-button>
      </NuxtLink>
    </div>
  </div>
</template>
