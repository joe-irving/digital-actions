<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'
import { NaiveIcon, ShareTile } from '#components'
type RouterOutput = inferRouterOutputs<AppRouter>;

type CampaignUpdateOutput = RouterOutput['petitionCampaign']['update'];

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
const { data: signatureCount } = await $client.petitionCampaign.getSignatureStats.useQuery({
  id: petitionCampaignId
})
const { data: permissions } = await $client.petitionCampaignPermission.me.useQuery({
  id: petitionCampaignId
})

const permissionLevels = computed(() => {
  return permissions.value ? permissions.value.map(p => p.type) : []
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
const campaignEdit = computed(() => {
  return campaign.value
    ? {
        id: campaign.value.id,
        title: campaign.value.title,
        description: campaign.value.description,
        themes: campaign.value.themes.map(t => t.title),
        groupName: campaign.value.groupName,
        defaultImage: campaign.value.defaultPetitionImage,
        limitLocationCountry: campaign.value.limitLocationCountry,
        slug: campaign.value.slug
      }
    : undefined
})

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

const updateStatus = async (status: 'public' | 'draft') => {
  if (!campaign.value) {
    return
  }
  const updatedCampaign = await $client.petitionCampaign.update.mutate({
    id: campaign.value.id,
    status
  })
  campaign.value.status = updatedCampaign.status
}

const handleCampaignUpdate = (updatedCampaign: CampaignUpdateOutput) => {
  if (!campaign.value) {
    return
  }
  campaign.value = { ...campaign.value, ...updatedCampaign }
}
const handleManageMenu = (option: string) => {
  if (option === 'unpublish') {
    updateStatus('draft')
  }
}
const hasPermissions = (permissions: Array<string>) => {
  return !!permissions.filter(p => permissionLevels.value.includes(p)).length
}

useSeoMeta({
  title: campaign.value?.title
})
</script>

<template>
  <div>
    <div v-if="campaign">
      <TitleBar :title="campaign?.title" :breadcrumbs="breadcrumbs" class="p-4">
        <n-space>
          <n-statistic :label="$t('pc_manage.petitions')">
            {{ campaign?._count?.petitions }}
          </n-statistic>
          <n-statistic :label="$t('pc_manage.signatures')">
            {{ signatureCount?.count }}
          </n-statistic>
        </n-space>
        <template #extra>
          <n-space>
            <StatusTag :status="campaign.status" />
            <n-button v-if="campaign.status === 'public'" @click="createShareDialog">
              {{ $t('pc_manage.share') }}
            </n-button>
            <NuxtLink v-else :to="localePath('/' + campaign.slug)" target="_blank">
              <n-button>
                {{ $t('pc_manage.preview') }}
              </n-button>
            </NuxtLink>
            <n-button v-if="campaign.status === 'draft'" type="primary" @click="updateStatus('public')">
              {{ $t('pc_manage.publish') }}
            </n-button>
            <n-dropdown v-else :options="[{key: 'unpublish', label: $t('pc_manage.unpublish')}]" @select="handleManageMenu">
              <NaiveIcon name="mdi:dots-vertical" />
            </n-dropdown>
          </n-space>
        </template>
      </TitleBar>
      <div class="p-4">
        <n-tabs>
          <n-tab-pane v-if="hasPermissions(['approval', 'admin', 'owner', 'read', 'write'])" name="petitions" :tab="$t('pc_manage.petitions')">
            <PetitionApprovalList :campaign-id="campaign.id" />
          </n-tab-pane>
          <n-tab-pane v-if="campaign.styleThemeId && hasPermissions(['write', 'owner', 'admin'])" name="theme" :tab="$t('pc_manage.theme')">
            <EditCustomThemeForm :id="campaign.styleThemeId" />
          </n-tab-pane>
          <n-tab-pane v-if="hasPermissions(['write', 'admin', 'owner'])" name="edit" :tab="$t('pc_manage.edit')">
            <EditPetitionCampaignForm v-if="campaignEdit" :campaign="campaignEdit" @update="handleCampaignUpdate" />
          </n-tab-pane>
          <n-tab-pane v-if="hasPermissions(['admin', 'owner'])" name="action_network" :tab="$t('pc_manage.action_network')">
            <ActionNetworkInfo
              :main-tag="campaign.actionNetworkAllTag"
              :response-tag="campaign.actionNetworkResponseTag"
              :tag-prefix="campaign.tagPrefix"
              :action-network-cred-name="campaign.actionNetworkCredential?.name || ''"
            />
          </n-tab-pane>
          <n-tab-pane v-if="hasPermissions(['admin', 'owner'])" name="admins" :tab="$t('pc_manage.admins')">
            <PetitionCampaignAdminSettings
              :id="campaign.id"
              :user-permissions="permissions || []"
              @user-permission-update="(permissionsUpdate) => permissions = permissionsUpdate"
            />
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
