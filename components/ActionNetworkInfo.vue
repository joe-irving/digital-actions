<script setup lang="ts">
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
  }
})

const makeCustomFieldClip = (fieldName: string) => {
  return `{{ '${props.tagPrefix}_${fieldName}' | form_value }}`
}
</script>

<template>
  <div>
    <Nh2>{{ $t("pc_manage.an_connect_title") }}</Nh2>
    <Np>{{ $t("pc_manage.an_connect_description") }} <n-tag>{{ actionNetworkCredName }}</n-tag>.</Np>
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
