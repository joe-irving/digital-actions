<script setup lang="ts">
import type { FormRules, FormValidationError, FormInst, UploadFileInfo } from 'naive-ui'
import { TRPCClientError } from '@trpc/client'

import { useThemeVars } from 'naive-ui'

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})
const { $client } = useNuxtApp()
const siteTheme = useThemeVars()
const i18n = useI18n()

const { data: theme } = await $client.styleTheme.get.useQuery(props.id)
// Define form Object
const themeEdit = ref<{
    name: string,
    backgroundColor: string,
    backgroundTextColor: string,
    logo: UploadFileInfo[],
    icon: UploadFileInfo[],
} | undefined>(theme.value
  ? {
      name: theme.value.name,
      backgroundColor: theme.value.backgroundColor || siteTheme.value.baseColor,
      backgroundTextColor: theme.value.backgroundTextColor || '#000',
      logo: [],
      icon: []
    }
  : undefined)

const themeEditRules = ref<FormRules>({
  name: {
    required: true,
    trigger: ['blur', 'input']
  },
  backgroundColor: {
    required: true,
    trigger: ['blur', 'input']
  },
  backgroundTextColor: {
    required: true,
    trigger: ['blur', 'input']
  }
})

const themeEditForm = ref<FormInst | null>(null)
const formWarningMessages = ref<FormValidationError[]>([])
const formSuccess = ref(false)

const handleUpdateTheme = () => {
  formWarningMessages.value = []
  themeEditForm.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      formWarningMessages.value = errors
    } else {
      updateTheme()
    }
  })
}

const updateTheme = async () => {
  try {
    const updatedTheme = await $client.styleTheme.update.mutate({
      id: props.id,
      name: themeEdit.value?.name,
      backgroundColor: themeEdit.value?.backgroundColor,
      backgroundTextColor: themeEdit.value?.backgroundTextColor,
      logo: themeEdit.value?.logo.length && themeEdit.value.logo[0].url
        ? {
            name: themeEdit.value.logo[0].name,
            url: themeEdit.value.logo[0].url
          }
        : undefined,
      icon: themeEdit.value?.icon.length && themeEdit.value.icon[0].url
        ? {
            name: themeEdit.value.icon[0].name,
            url: themeEdit.value.icon[0].url
          }
        : undefined
    })
    formSuccess.value = true
    theme.value = updatedTheme
    return updatedTheme
  } catch (err) {
    if (err instanceof TRPCClientError) {
      formWarningMessages.value = [[{
        message: i18n.t('pc_manage.server_error')
      }]]
    }
    throw err
  }
}
</script>

<template>
  <div>
    <div v-if="themeEdit" class="flex justify-center">
      <div
        :style="{
          backgroundColor: themeEdit.backgroundColor
        }"
        class="p-4 rounded shadow text-center"
      >
        <Nh1
          :style="{
            color: themeEdit.backgroundTextColor
          }"
        >
          {{ themeEdit.name }}
        </Nh1>
        <Np
          :style="{
            color: themeEdit.backgroundTextColor
          }"
        >
          {{ $t("pc_manage.this_example_theme") }}
        </Np>
      </div>
    </div>
    <n-form v-if="themeEdit && theme" ref="themeEditForm" size="large" :rules="themeEditRules" :model="themeEdit">
      <n-form-item path="name" :label="$t('pc_manage.theme_name')">
        <n-input v-model:value="themeEdit.name" />
      </n-form-item>
      <n-form-item path="backgroundColor" :label="$t('pc_manage.background_color')">
        <n-color-picker v-model:value="themeEdit.backgroundColor" :show-alpha="false" />
      </n-form-item>
      <n-form-item path="backgroundTextColor" :label="$t('pc_manage.background_text_color')">
        <n-color-picker v-model:value="themeEdit.backgroundTextColor" :show-alpha="false" />
      </n-form-item>
      <n-form-item path="logo" :label="$t('pc_manage.theme_logo')">
        <ImageUpload :image="theme.logo || undefined" @change="(fileList) => themeEdit ? themeEdit.logo = fileList : null" />
      </n-form-item>
      <n-form-item path="icon" :label="$t('pc_manage.theme_icon')">
        <ImageUpload :image="theme.icon || undefined" @change="(fileList) => themeEdit ? themeEdit.icon = fileList : null" />
      </n-form-item>
      <n-button @click="handleUpdateTheme">
        {{ $t('pc_manage.update_theme') }}
      </n-button>
      <div v-if="formWarningMessages.length > 0">
        <FormErrorList :errors="formWarningMessages" />
      </div>
      <n-space class="p-2">
        <n-tag v-if="formSuccess" round type="success">
          {{ $t('pc_manage.theme_saved') }}
          <template #icon>
            <NaiveIcon name="clarity:success-standard-line" />
          </template>
        </n-tag>
      </n-space>
    </n-form>
  </div>
</template>
