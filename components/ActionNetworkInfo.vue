<script setup lang="ts">
import type { FormRules } from 'naive-ui'

const props = defineProps({
  mainTag: {
    type: String,
    required: true
  },
  responseTag: {
    type: String,
    required: true
  },
  tagPrefix: {
    type: String,
    required: true
  },
  actionNetworkCredName: {
    type: String,
    required: true
  },
  themes: {
    type: Array as PropType<string[]>,
    required: true
  },
  campaignId: {
    type: Number,
    required: true
  }
})

const { t } = useI18n()
const { $client } = useNuxtApp()

const makeCustomFieldClip = (fieldName: string) => {
  return `{{ '${props.tagPrefix}_${fieldName}' | form_value }}`
}

const formRules = ref<FormRules>({
  anEndpoint: {
    required: true,
    trigger: ['blur'],
    validator (_rule, value: string) {
      return new Promise<void>((resolve, reject) => {
        if (!value || !value.length) {
          readyToCreate.value = false
          reject(Error(t('pc_manage.endpoint_required')))
        } else {
          $client.petitionCampaignActionNetwork.registerPetition.mutate({
            campaignId: props.campaignId,
            endpoint: value
          }).then((data) => {
            if (!data) {
              readyToCreate.value = false
              reject(Error(t('pc_manage.cannot_verify_an_endpoint')))
            } else {
              importPetition.value.title = data.title || ''
              importPetition.value.content = data.content ? data.content.replaceAll('\r\n', '<br>') : ''
              importPetition.value.target = data.target || ''
              importPetition.value.image = data.imageUrl
                ? {
                    url: data.imageUrl,
                    name: data.imageUrl
                  }
                : undefined
              importPetition.value.anEndpoint = data.endpoint
              readyToCreate.value = true
              resolve()
            }
          })
        }
      })
    }
  }
})
const importPetition = ref<{
  anEndpoint: string,
  title: string,
  content: string,
  target: string,
  image: {
    url: string,
    name: string
  } | undefined,
  sourceCode: 'importer',
  petitionCampaign: number,
  themes: []
}>({
  anEndpoint: '',
  title: '',
  content: '',
  target: '',
  image: undefined,
  sourceCode: 'importer',
  petitionCampaign: props.campaignId,
  themes: []
})

const readyToCreate = ref(false)

const createPetition = async () => {
  readyToCreate.value = false
  const newPetition = await $client.petition.create.mutate(importPetition.value)
  if (newPetition) {
    navigateTo(`/petition/${newPetition.id}`)
  }
}
</script>

<template>
  <div>
    <Nh2>{{ $t("pc_manage.an_connect_title") }}</Nh2>
    <Np>{{ $t("pc_manage.an_connect_description") }} <n-tag>{{ actionNetworkCredName }}</n-tag>.</Np>
    <Nh2>{{ $t("pc_manage.an_import_petition_title") }}</Nh2>
    <n-form :model="importPetition" :rules="formRules">
      <n-form-item path="anEndpoint" :label="$t('pc_manage.an_endpoint_label')">
        <n-input v-model:value="importPetition.anEndpoint" />
      </n-form-item>
      <n-button :disabled="!readyToCreate" @click="createPetition">
        {{ $t("pc_manage.import_petition") }}
      </n-button>
    </n-form>
    <Nh2>{{ $t("pc_manage.action_network_connection_tags") }}</Nh2>
    <Np>{{ $t("pc_manage.action_network_connection") }}</Np>
    <n-space>
      <ActionNetworkTagExplainer :tag="mainTag" :description="$t('pc_manage.action_network_main_tag_description')" />
      <ActionNetworkTagExplainer :tag="responseTag" :description="$t('pc_manage.action_network_response_tag_description')" />
      <ActionNetworkTagExplainer :tag="'['+tagPrefix+'] 12'" :description="$t('pc_manage.action_network_petition_tag_description')" />
      <ActionNetworkTagExplainer v-for="theme in themes" :key="theme" :tag="`[${tagPrefix}] Theme - ${theme}`" :description="$t('pc_manage.action_network_theme_tag_description', { theme })" />
    </n-space>
    <Nh2>{{ $t("pc_manage.an_auto_response") }}</Nh2>
    <Np>{{ $t("pc_manage.an_auto_response_explainer") }}</Np>
    <n-steps :vertical="true">
      <n-step :title="$t('pc_manage.an_res_1_title')">
        {{ $t('pc_manage.an_res_1') }}
      </n-step>
      <n-step :title="$t('pc_manage.an_res_2_title')">
        {{ $t('pc_manage.an_res_2', {tag: responseTag}) }}
      </n-step>
      <n-step :title="$t('pc_manage.an_res_3_title')">
        <Np>{{ $t('pc_manage.an_res_3') }}</Np>
        <Np>{{ $t('pc_manage.an_res_3_line2') }}</Np>
        <n-tag>{{ makeCustomFieldClip('petition_url') }}</n-tag>
        <Np>{{ $t('pc_manage.an_res_3_line3') }}</Np>
        <n-tag>{{ makeCustomFieldClip('petition_title') }}</n-tag>
      </n-step>
      <n-step :title="$t('pc_manage.an_res_4_title')">
        {{ $t('pc_manage.an_res_4', {tag: responseTag}) }}
      </n-step>
    </n-steps>
  </div>
</template>
