<script setup lang="ts">
import type { FormRules, FormValidationError, FormInst, UploadFileInfo } from 'naive-ui'
import type { PetitionCampaignEdit } from '~/types'

// interface CampaignSharing {
//     whatsappShareText: string;
//     tweet: string;
//     shareImage: {
//         id: number;
//         url: string
//     },
//     shareTitle: string;
//     description: string;
// }

const { $client } = useNuxtApp()
const countries = useGetCountryList()
const i18n = useI18n()
const countryOptions = countries.map((c) => {
  return {
    label: c.name,
    value: c.iso2.toLowerCase()
  }
})

const props = defineProps({
  campaign: {
    required: true,
    type: Object as PropType<PetitionCampaignEdit>
  }
})

const emit = defineEmits(['update'])

const { data: themeRes } = await $client.theme.available.useQuery()
const themes = ref(themeRes.value || [])
const campaignEdit = ref<{
  title: string,
  description: string,
  themes: string[],
  groupName: string,
  defaultImage: UploadFileInfo[],
  limitLocationCountry: string[],
  slug: string
}>({
  title: props.campaign.title,
  description: props.campaign.description || '',
  themes: props.campaign.themes,
  groupName: props.campaign.groupName || '',
  defaultImage: [],
  limitLocationCountry: props.campaign.limitLocationCountry ? props.campaign.limitLocationCountry.split(',') : [],
  slug: props.campaign.slug
})

const newTheme = ref('')
const formWarningMessages = ref<FormValidationError[]>([])
const formSuccess = ref(false)
const formRef = ref<FormInst | null>(null)

const themeOptions = computed(() => {
  const filteredThemes = themes.value.filter(t => t.title.slice(0, newTheme.value.length).toLowerCase() === newTheme.value.toLowerCase())
  const stringThemes = filteredThemes.map(t => t.title)
  return [...stringThemes, newTheme.value.trim()].filter(t => !campaignEdit.value.themes.map(th => th.toLowerCase()).includes(t.toLowerCase()))
})

const formRules = ref<FormRules>({
  title: {
    required: true,
    trigger: ['input', 'blur'],
    validator (_rule, value: string) {
      if (!value) {
        return new Error(i18n.t('petition_create.title_validator'))
      } else if (value.length > 200) {
        return new Error(i18n.t('petition_create.title_validator_too_big'))
      }
      return true
    }
  },
  slug: {
    required: true,
    trigger: ['blur'],
    validator (_rule, value: string) {
      return new Promise<void>((resolve, reject) => {
        if (!value || !value.length) {
          reject(Error(i18n.t('pc_manage.slug_required')))
        } else {
          $client.slug.checkUnique.useQuery({
            slug: value
          }).then(({ data: unique }) => {
            if (!unique.value && value !== props.campaign.slug) {
              reject(Error(i18n.t('pc_manage.slug_unique')))
            } else {
              resolve()
            }
          })
        }
      })
    }
  },
  description: {
    required: true,
    trigger: ['input', 'blur']
  },
  groupName: {
    required: true,
    trigger: ['input', 'blur'],
    validator (_rule, value: string) {
      if (!value) {
        return new Error(i18n.t('pc_manage.group_name_required'))
      } else if (value.length > 200) {
        return new Error(i18n.t('pc_manage.group_name_too_big'))
      }
      return true
    }
  }
})
const handleUpdate = () => {
// Check if all values needed are entered, if not show clear error message about what is missing.
  formWarningMessages.value = []
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      formWarningMessages.value = errors
    } else {
      updateCampaign()
    }
  })
}

const updateCampaign = async () => {
  const updatedPetition = await $client.petitionCampaign.update.mutate({
    id: props.campaign.id,
    title: campaignEdit.value.title,
    description: campaignEdit.value.description,
    themes: campaignEdit.value.themes,
    groupName: campaignEdit.value.groupName,
    image: campaignEdit.value.defaultImage && campaignEdit.value.defaultImage.length && campaignEdit.value.defaultImage[0].url
      ? {
          url: campaignEdit.value.defaultImage[0].url,
          name: campaignEdit.value.defaultImage[0].name
        }
      : undefined,
    limitLocationCountry: campaignEdit.value.limitLocationCountry,
    slug: campaignEdit.value.slug
  })
  if (updatedPetition) {
    emit('update', updatedPetition)
    formSuccess.value = true
  }
}

</script>

<template>
  <div>
    <n-form ref="formRef" :model="campaignEdit" :rules="formRules">
      <n-form-item path="title" :label="$t('pc_manage.title')" required>
        <n-input v-model:value="campaignEdit.title" />
      </n-form-item>
      <n-form-item path="slug" :label="$t('pc_manage.slug')" required>
        <SlugInput v-model="campaignEdit.slug" />
      </n-form-item>
      <n-form-item path="themes" :label="$t('pc_manage.themes_available')">
        <n-dynamic-tags v-model:value="campaignEdit.themes">
          <template #input="{ submit, deactivate }">
            <n-auto-complete
              v-model:value="newTheme"
              size="small"
              :options="themeOptions"
              :clear-after-select="true"
              @select="submit($event)"
              @blur="deactivate"
            />
          </template>
          <template #trigger="{ activate, disabled }">
            <n-button
              size="small"
              type="primary"
              dashed
              :disabled="disabled"
              @click="activate()"
            >
              <template #icon>
                <NaiveIcon name="mdi:add" />
              </template>
              {{ $t('pc_manage.new_theme') }}
            </n-button>
          </template>
        </n-dynamic-tags>
      </n-form-item>
      <n-form-item path="description" :label="$t('pc_manage.description')">
        <client-only>
          <div class="w-full justify-stretch">
            <TiptapEditor v-model="campaignEdit.description" />
          </div>
        </client-only>
      </n-form-item>
      <n-form-item path="groupName" :label="$t('pc_manage.group_name')">
        <n-input v-model:value="campaignEdit.groupName" />
      </n-form-item>
      <n-form-item path="defaultImage" :label="$t('pc_manage.default_image')">
        <ImageUpload :image="campaign.defaultImage || undefined" @change="(fileList) => campaignEdit.defaultImage = fileList" />
      </n-form-item>
      <n-form-item path="limitLocationCountry" :label="$t('pc_manage.limit_country')">
        <n-select v-model:value="campaignEdit.limitLocationCountry" filterable :options="countryOptions" multiple />
      </n-form-item>
      <n-button @click.prevent="handleUpdate">
        {{ $t('pc_manage.update_pc') }}
      </n-button>
      <div v-if="formWarningMessages.length > 0">
        <FormErrorList :errors="formWarningMessages" />
      </div>
      <n-space class="p-2">
        <n-tag v-if="formSuccess" round type="success">
          {{ $t('pc_manage.campaign_saved') }}
          <template #icon>
            <NaiveIcon name="clarity:success-standard-line" />
          </template>
        </n-tag>
      </n-space>
    </n-form>
  </div>
</template>
