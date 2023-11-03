<script setup lang="ts">
import { SelectOption, FormRules, FormItemRule, FormValidationError, FormInst, UploadFileInfo } from 'naive-ui'
import { TRPCClientError } from '@trpc/client'
import { NominatimLocationInfo } from '~/types'

const i18n = useI18n()
const { $client } = useNuxtApp()

interface themeType {
    id: number,
    title: string,
    icon: string
}

const props = defineProps({
  id: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  targetName: {
    type: String,
    default: ''
  },
  themes: {
    type: Array as PropType<themeType[]>,
    default: () => []
  },
  image: {
    type: Object as PropType<{
        id: number,
        url: string
    }> | null,
    default: () => null
  },
  availableThemes: {
    type: Array as PropType<themeType[]>,
    default: () => []
  },
  limitCountries: {
    type: String,
    required: false,
    default: ''
  }
})
const emit = defineEmits(['update'])

const formRef = ref<FormInst | null>(null)

const themeOptions = ref(props.availableThemes.map((t): SelectOption => { return { label: t.title, value: t.id } }))
const formWarningMessages = ref<FormValidationError[]>([])
const formSuccess = ref(false)

// TODO add validation for other fields to match back end
const formRules = ref<FormRules>({
  title: {
    required: true,
    trigger: ['input', 'blur'],
    validator (_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(i18n.t('petition_create.title_validator'))
      } else if (value.length > 200) {
        return new Error(i18n.t('petition_create.title_validator_too_big'))
      }
      return true
    }
  },
  content: {
    required: true,
    trigger: ['blur'],
    validator (_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(i18n.t('petition_create.content_required_validator'))
      } else if (value.length > 10000) {
        return new Error(i18n.t('petition_create.content_too_big'))
      }
      return true
    }
  }
})

const petition = ref<{
  title: string,
  content: string,
  image: UploadFileInfo[],
  themes: number[],
  location: NominatimLocationInfo | null,
  target: string
}>({
  title: props.title,
  content: props.content,
  image: [],
  themes: props.themes.map(t => t.id),
  location: null,
  target: props.targetName
})

const savePetition = () => {
  // Check if all values needed are entered, if not show clear error message about what is missing.
  formWarningMessages.value = []
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      formWarningMessages.value = errors
    } else {
      updatePetition()
    }
  })
}
const updatePetition = async () => {
  if (props.id === 0) {
    throw new Error('No petition id')
  }
  try {
    const updatedPetition = await $client.petition.update.mutate({
      id: props.id,
      title: petition.value.title,
      content: petition.value.content,
      target: petition.value.target,
      themes: petition.value.themes
    })
    // emit update to parent
    emit('update', updatedPetition)
    // mark as sucesss
    formSuccess.value = true
  } catch (err) {
    if (err instanceof TRPCClientError) {
      formWarningMessages.value = [[{
        message: i18n.t('petition_create.server_error')
      }]]
    }
    throw err
  }
}

// TODO include location
</script>

<template>
  <n-form ref="formRef" :rules="formRules" :model="petition" size="large">
    <n-form-item
      path="title"
      :label="$t('petition_create.title')"
    >
      <n-input
        v-model:value="petition.title"
        type="text"
        :placeholder="$t('petition_create.title_placeholder')"
      />
    </n-form-item>
    <n-form-item path="target" :label="$t('petition_create.target_title')">
      <n-input
        v-model:value="petition.target"
        type="text"
        :placeholder="$t('petition_create.target_placeholder')"
      />
    </n-form-item>
    <n-form-item path="themes" :label="$t('petition_create.theme_title')">
      <n-select v-model:value="petition.themes" multiple :options="themeOptions" />
    </n-form-item>
    <n-form-item path="content" :label="$t('petition.content_of_petition')">
      <client-only>
        <div class="w-full justify-stretch">
          <TiptapEditor v-model="petition.content" />
        </div>
      </client-only>
    </n-form-item>
    <n-button @click="savePetition">
      {{ $t('petition.save_edits') }}
    </n-button>
    <div v-if="formWarningMessages.length > 0">
      <FormErrorList :errors="formWarningMessages" />
    </div>
    <n-space class="p-2">
      <n-tag v-if="formSuccess" round type="success">
        {{ $t('petition.petition_saved') }}
        <template #icon>
          <NaiveIcon name="clarity:success-standard-line" />
        </template>
      </n-tag>
    </n-space>
  </n-form>
</template>
