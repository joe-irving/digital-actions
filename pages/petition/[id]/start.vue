<script setup lang="ts">
import type { FormRules, FormItemRule, SelectOption, FormValidationError, UploadFileInfo, FormInst } from 'naive-ui'
import { TRPCClientError } from '@trpc/client'

import type { inferRouterInputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterInput = inferRouterInputs<AppRouter>;

type PetitionInput = RouterInput['petition']['create'];

const { $client, $i18n } = useNuxtApp()
// const { signIn } = useAuth()
const route = useRoute()
// const { $i18n } = useNuxtApp()

// const { data: user } = $client.user.me.useQuery()

// Get id prop, if it is an int then get the campaign, if not create without link to campaign?
const petitionCampaignId = parseInt(route.params.id instanceof Array ? route.params.id[0] : route.params.id)
const { data: petitionCampaign } = await $client.petitionCampaign.getPublic.useQuery({ id: petitionCampaignId })
const { data: styleTheme } = petitionCampaign.value?.styleThemeId ? await $client.styleTheme.get.useQuery(petitionCampaign.value?.styleThemeId) : { data: undefined }
const { data: user } = $client.user.me.useQuery()

if (!petitionCampaign.value) {
  navigateTo('/')
}

const themeOptions = ref(petitionCampaign.value?.themes.map((t): SelectOption => { return { label: t.title, value: t.id } }))

// This page is for creating a petition through a step by step form
const petitionInput = ref<PetitionInput>({
  petitionCampaign: petitionCampaign.value?.id || 0,
  title: '',
  target: '',
  content: petitionCampaign.value?.petitionContentTemplate || '',
  themes: [],
  location: undefined,
  creatorEmail: undefined
})

const currentPage = ref(0)
const totalPages = ref(7)

const formRef = ref<FormInst | null>(null)

const formWarningMessages = ref<FormValidationError[]>([])
// Form setup
const formRules = ref<FormRules>({
  title: {
    required: true,
    trigger: ['input', 'blur'],
    validator (_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error($i18n.t('petition_create.title_validator'))
      } else if (value.length > 200) {
        return new Error($i18n.t('petition_create.title_validator_too_big'))
      }
      return true
    }
  },
  creatorEmail: {
    required: true,
    trigger: ['blur'],
    validator (_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error($i18n.t('petition_create.email_required'))
      } else if (!/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(value)) {
        return new Error($i18n.t('petition_create.email_validator'))
      }
      return true
    }
  }
})

const updateImage = (files: UploadFileInfo[]) => {
  if (files.length > 0 && files[0].url) {
    petitionInput.value.image = {
      url: files[0].url,
      name: files[0].name
    }
  }
}

const nextStep = () => {
  if (currentPage.value < (totalPages.value - 1)) {
    currentPage.value += 1
  }
}
const prevStep = () => {
  if (currentPage.value >= 1) {
    currentPage.value -= 1
  }
}

const showPrev = computed(() => {
  return currentPage.value >= 1
})
const showNext = computed(() => {
  return currentPage.value < (totalPages.value - 1)
})

const handleCreatePetition = () => {
  // Check if all values needed are entered, if not show clear error message about what is missing.
  formWarningMessages.value = []
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      formWarningMessages.value = errors
    } else {
      createPetition()
    }
  })
}

const createPetition = async () => {
  // If not logged in, create a verification code that is attached to the petition and passed to the redirect page.
  // neeed to do sign in on server side to send code. Then it would be redirect to /petition/[id]?verification=fkdsjafldjsf-dfanwklfnes-feasjklfehjaithdsifi54tw
  try {
    const petitionCreated = await $client.petition.create.mutate(petitionInput.value)
    if (user.value?.user) {
      navigateTo(`/petition/${petitionCreated.id}`)
    } else {
      navigateTo('/verify?email=' + encodeURIComponent(petitionInput.value?.creatorEmail || ''))
    }
  } catch (err) {
    if (err instanceof TRPCClientError) {
      formWarningMessages.value = [[{
        message: $i18n.t('petition_create.server_error')
      }]]
    }
    throw err
  }
  // Create petition in back end, with either user email attached or linked to logged in userEmail
  // if not logged in -> take them to login page -> redirect to manage page
  // if logged in -> redirect to manage page once created
}

definePageMeta({
  layout: 'public',
  auth: false
})
</script>

<template>
  <CustomThemeWrapper :theme="styleTheme">
    <div class="min-h-screen flex flex-col pt-16 min-h-screen justify-between">
      <FormPages
        :current-page="currentPage"
        :show-prev="showPrev"
        :show-next="showNext"
        :progress="(currentPage+1) / totalPages"
        @next="nextStep()"
        @prev="prevStep()"
      >
        <n-form ref="formRef" :rules="formRules" :model="petitionInput">
          <FormPage :page="0" :current-page="currentPage">
            <Nh2>{{ $t('petition_create.title') }}</Nh2>
            <p>{{ $t('petition_create.title_description') }}</p>
            <n-form-item path="title">
              <n-input
                ref="titleInput"
                v-model:value="petitionInput.title"
                type="text"
                :placeholder="$t('petition_create.title_placeholder')"
                size="large"
                @keyup.enter="nextStep()"
              />
            </n-form-item>
          </FormPage>
          <FormPage :page="1" :current-page="currentPage">
            <n-space class="n-step-description full" vertical justify="center" height="100%">
              <Nh2>{{ $t('petition_create.theme_title') }}</Nh2>
              <p>{{ $t('petition_create.theme_description') }}</p>
              <n-form-item path="themes">
                <n-select ref="themesInput" v-model:value="petitionInput.themes" multiple :options="themeOptions" />
              </n-form-item>
            </n-space>
          </FormPage>
          <FormPage :page="2" :current-page="currentPage">
            <Nh2>{{ $t('petition_create.location_title') }}</Nh2>
            <n-space class="n-step-description full" vertical justify="center" height="100%">
              <p>{{ $t('petition_create.location_description') }}</p>
              <LocationLookup v-model="petitionInput.location" :limit-country="petitionCampaign?.limitLocationCountry || undefined" />
            </n-space>
          </FormPage>
          <FormPage :page="3" :current-page="currentPage">
            <Nh2>{{ $t('petition_create.target_title') }}</Nh2>
            <n-space class="n-step-description full" justify="center" vertical>
              <p>{{ $t('petition_create.target_description') }}</p>
              <n-form-item path="target">
                <n-input
                  ref="targetInput"
                  v-model:value="petitionInput.target"
                  type="text"
                  :placeholder="$t('petition_create.target_placeholder')"
                  size="large"
                  @keyup.enter="nextStep()"
                />
              </n-form-item>
            </n-space>
          </FormPage>
          <FormPage :page="4" :current-page="currentPage">
            <Nh2>{{ $t('petition_create.petition_title') }}</Nh2>
            <n-space class="n-step-description full" vertical justify="center" height="100%">
              <p>{{ $t('petition_create.petition_description') }}</p>
              <client-only @keyup.ctrl.enter="nextStep()">
                <TiptapEditor v-model="petitionInput.content" />
              </client-only>
            </n-space>
          </FormPage>
          <FormPage :page="5" :current-page="currentPage">
            <Nh2>{{ $t('petition_create.image_title') }}  ({{ $t('petition_create.optional') }})</Nh2>
            <div ref="image" class="n-step-description full">
              <p>{{ $t('petition_create.image_description') }}</p>
              <ImageUpload @change="files => updateImage(files)" />
            </div>
          </FormPage>
          <FormPage :page="6" :current-page="currentPage">
            <Nh2>{{ user?.authenticated ? $t('petition_create.create_button') : $t('petition_create.email_title') }}</Nh2>
            <!-- Only if not signed in, otherwise just show button -->
            <!-- Include steps here with the validation status of the form -->
            <div ref="email" class="n-step-description full">
              <div v-if="!user?.authenticated">
                <Np>{{ $t("petition_create.email_description") }}</Np>
                <n-form-item path="email">
                  <n-input ref="emailInput" v-model:value="petitionInput.creatorEmail" type="text" />
                </n-form-item>
              </div>
              <!-- , { username: petition.email, callbackUrl: '/peition' }) -->
              <n-button type="primary" @click="handleCreatePetition()">
                {{ $t('petition_create.create_button') }}
              </n-button>
              <div v-if="formWarningMessages.length > 0">
                <FormErrorList :errors="formWarningMessages" />
              </div>
            </div>
          </FormPage>
        </n-form>
      </FormPages>
    </div>
  </CustomThemeWrapper>
</template>
