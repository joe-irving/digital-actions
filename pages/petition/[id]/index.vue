<script setup lang="ts">
import { useDialog } from 'naive-ui'
import { h } from 'vue'
import type { inferRouterOutputs } from '@trpc/server'
import { NaiveIcon, ShareTile } from '#components'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;

type PetitionUpdate = RouterOutput['petition']['getManage'];

const route = useRoute()
const router = useRouter()
const { $client } = useNuxtApp()
const { url: siteUrl } = useSiteConfig()
const localePath = useLocalePath()
const dialog = useDialog()
const { t } = useI18n()

const verificationToken = route.query.token?.toString() || undefined
const petitionId = parseInt(route.params.id.toString())
const { data: petition } = await $client.petition.getManage.useQuery({
  id: petitionId,
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
const { data: signatures } = $client.petition.signatureCount.useQuery({
  id: petitionId
})

const { data: petitionCampaign } = petition.value?.petitionCampaignId
  ? await $client.petitionCampaign.getPublic.useQuery({
    id: petition.value?.petitionCampaignId
  })
  : { data: undefined }

const { data: petitionCampaignPermissions } = petition.value?.petitionCampaignId
  ? await $client.petitionCampaign.getUserPermissions.useQuery({
    id: petition.value?.petitionCampaignId
  })
  : { data: undefined }

const isApprover = petitionCampaignPermissions?.value ? !!petitionCampaignPermissions.value.filter(p => ['approval', 'admin', 'owner'].includes(p.type)).length : false

const { data: petitionPermissions } = petition.value?.id
  ? await $client.petitionPermission.me.useQuery({
    id: petition.value?.id
  })
  : { data: undefined }

const isAdmin = isApprover || (petitionPermissions?.value ? !!petitionPermissions.value.filter(p => ['admin', 'owner'].includes(p.type)).length : false)
const isEditor = isApprover || (petitionPermissions?.value ? !!petitionPermissions.value.filter(p => ['admin', 'owner', 'write'].includes(p.type)).length : false)

const shareUrl = ref(siteUrl + localePath(`/${petition.value?.slug}`))

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
  <div v-if="petition" class="p-4">
    <n-page-header>
      <PetitionApprovalBanner
        v-if="petition.petitionCampaignId && isApprover"
        :status="petition.status"
        :petition-id="petition.id"
        :petition-campaign-id="petition.petitionCampaignId"
        @update="(status: string) => {petition?.status ? petition.status = status : null}"
      />
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
          <n-breadcrumb-item v-if="petitionCampaign && isApprover">
            <NuxtLink :to="localePath('/petition/campaign/' + petitionCampaign.id)">
              {{ petitionCampaign.title }}
            </NuxtLink>
          </n-breadcrumb-item>
          <n-breadcrumb-item>
            <NuxtLink :to="localePath('/petition/' + petition?.id)">
              {{ petition?.title }}
            </NuxtLink>
          </n-breadcrumb-item>
        </n-breadcrumb>
      </template>
      <template #title>
        <Nh1>{{ petition?.title }}</Nh1>
      </template>
      <template #extra>
        <n-space>
          <StatusTag :status="petition.status" />
          <n-button v-if="petition?.status === 'public'" @click="createShareDialog">
            {{ $t('petition.share') }}
          </n-button>
        </n-space>
      </template>
    </n-page-header>
    <n-tabs>
      <n-tab-pane name="overview" :tab="$t('petition.overview')">
        <n-grid cols="1 sm:1 md:2" :x-gap="10" :y-gap="10" responsive="screen">
          <n-gi><SignatureCount :count="signatures?.count" /></n-gi>
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
      <n-tab-pane v-if="isEditor" name="edit" :tab="$t('petition.edit')">
        <EditPetitionForm
          :petition="petition"
          :petition-campaign="petitionCampaign || null"
          @update="(update: PetitionUpdate) => {
            petition = update
          }"
        />
      </n-tab-pane>
      <n-tab-pane v-if="isAdmin && petitionCampaign && petitionCampaignPermissions && petitionPermissions" name="admin" :tab="$t('petition.admin')">
        <PetitionAdminTab
          :petition="petition"
          :petition-campaign="petitionCampaign"
          :petition-campaign-permissions="petitionCampaignPermissions"
          :petition-permissions="petitionPermissions"
        />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
