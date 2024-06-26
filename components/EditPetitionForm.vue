<script setup lang="ts">
import type { SelectOption, FormRules, FormItemRule, FormValidationError, FormInst, UploadFileInfo } from 'naive-ui'
import { TRPCClientError } from '@trpc/client'
import type { inferRouterOutputs, inferRouterInputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;
type RouterInput = inferRouterInputs<AppRouter>;

type PetitionOutput = RouterOutput['petition']['getManage'];
type PetitionCampaignOutput = RouterOutput['petitionCampaign']['getPublic'];

type Location = RouterInput['petition']['create']['location'];

const i18n = useI18n()
const { $client } = useNuxtApp()

interface themeType {
    id: number,
    title: string,
    icon: string
}

const props = defineProps({
  petition: {
    type: Object as PropType<PetitionOutput>,
    required: true
  },
  petitionCampaign: {
    type: Object as PropType<PetitionCampaignOutput>,
    required: true
  },
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

const themeOptions = ref((props.petitionCampaign?.themes || []).map((t): SelectOption => { return { label: t.title, value: t.id } }))
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
            if (!unique.value && value !== props.petition.slug) {
              reject(Error(i18n.t('pc_manage.slug_unique')))
            } else {
              resolve()
            }
          })
        }
      })
    }
  }
})

const petitionUpdate = ref<{
  id: number
  title: string,
  content: string,
  image: {
    url: string,
    name: string
  } | undefined,
  themes: number[],
  location: Location | undefined,
  target: string,
  slug: string
}>({
  id: props.petition.id,
  title: props.petition.title,
  content: props.petition.content,
  image: undefined,
  themes: props.petition.petitionThemes.map(t => t.id),
  location: undefined,
  target: props.petition.targetName || '',
  slug: props.petition.slug
})

const updateImage = (files: UploadFileInfo[]) => {
  if (files.length > 0 && files[0].url) {
    petitionUpdate.value.image = {
      url: files[0].url,
      name: files[0].name
    }
  }
}

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
  if (props.petition.id === 0) {
    throw new Error('No petition id')
  }
  try {
    const updatedPetition = await $client.petition.update.mutate(petitionUpdate.value)
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
</script>

<template>
  <n-form ref="formRef" :rules="formRules" :model="petitionUpdate" size="large">
    <n-form-item
      path="title"
      :label="$t('petition_create.title')"
    >
      <n-input
        v-model:value="petitionUpdate.title"
        type="text"
        :placeholder="$t('petition_create.title_placeholder')"
      />
    </n-form-item>
    <n-form-item path="slug" :label="$t('pc_manage.slug')" required>
      <SlugInput v-model="petitionUpdate.slug" />
    </n-form-item>
    <n-form-item path="target" :label="$t('petition_create.target_title')">
      <n-input
        v-model:value="petitionUpdate.target"
        type="text"
        :placeholder="$t('petition_create.target_placeholder')"
      />
    </n-form-item>
    <n-form-item path="themes" :label="$t('petition_create.theme_title')">
      <n-select v-model:value="petitionUpdate.themes" multiple :options="themeOptions" />
    </n-form-item>
    <n-form-item path="location" :label="$t('petition_create.location_title')">
      <LocationLookup v-model="petitionUpdate.location" :default="petition.location" :limit-country="petitionCampaign?.limitLocationCountry || undefined" />
    </n-form-item>
    <n-form-item path="image" :label="$t('petition_create.image_title')">
      <ImageUpload :image="petition.image" @change="(files: UploadFileInfo[]) => updateImage(files)" />
    </n-form-item>
    <n-form-item path="content" :label="$t('petition.content_of_petition')">
      <client-only>
        <div class="w-full justify-stretch">
          <TiptapEditor v-model="petitionUpdate.content" />
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
