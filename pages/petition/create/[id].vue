<script setup lang="ts">
import { StepsProps, InputInst, FormRules, FormItemRule, FormValidationError, FormInst, UploadFileInfo, SelectInst } from 'naive-ui'
import { LocationQueryValue } from 'vue-router'
import { TRPCClientError } from '@trpc/client'
const { $client } = useNuxtApp()
// const { signIn } = useAuth()
const route = useRoute()
const { $i18n } = useNuxtApp()

const { data: user } = $client.user.me.useQuery()

// Get id prop, if it is an int then get the campaign, if not create without link to campaign?
const petitionCampaignId = parseInt(route.params.id instanceof Array ? route.params.id[0] : route.params.id)
const { data: petitionCampaign } = await $client.petitionCampaign.getPublic.useQuery(petitionCampaignId)
const themeOptions = ref(petitionCampaign.value?.themes.map((t) => { return { label: t.title, value: t.id } }))
if (!petitionCampaign.value) {
  navigateTo('/')
}
// Set layout to be plain
const currentRef = ref<number>(1)
const currentStatus = ref<StepsProps['status']>('process')
const totalSteps = ref(4)

// Element references
const title = ref<HTMLElement | null>(null)
const titleInput = ref<InputInst | null>(null)
const description = ref<HTMLElement | null>(null)
// const descriptionInput = ref<InputInst | null>(null)
const themes = ref<HTMLElement | null>(null)
const themesInput = ref<SelectInst | null>(null)
const location = ref<HTMLElement | null>(null)
const image = ref<HTMLElement | null>(null)
// const imageInput = ref<InputInst | null>(null)
const email = ref<HTMLElement | null>(null)
const emailInput = ref<InputInst | null>(null)
const formRef = ref<FormInst | null>(null)

const parseTheme = (theme: LocationQueryValue | LocationQueryValue[]): number[] => {
  let filteredThemes: number[] = []
  filteredThemes = (theme instanceof Array ? theme : [theme]).map((t) => {
    return parseInt(t || '0')
  })
  return filteredThemes.filter((t) => {
    const isAllowed = themeOptions.value?.filter(o => o.value === t)
    return t !== 0 && isAllowed && isAllowed.length > 0
  })
}

// Define other template data
const petition = ref<{
  title: string,
  content: string,
  image: UploadFileInfo[],
  email: string,
  themes: number[]
}>({
  title: route.query.title?.toString() || '',
  content: route.query.content?.toString() || '',
  image: [],
  email: route.query.email?.toString() || '',
  themes: parseTheme(route.query.theme)
})

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
  email: {
    required: true,
    trigger: ['blur'],
    validator (_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error($i18n.t('petition_create.email_required'))
      } else if (!/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(value)) {
        return new Error($i18n.t('petition_create.email_validator'))
      }
      return true //  i couldn't work out to remove the rule param from the function
    }
  }
})

// TODO validate input from TipTap.

const formWarningMessages = ref<FormValidationError[]>([])

// Other data
const steps = [
  {
    name: 'title',
    jump: title,
    inputFocus: titleInput
  },
  {
    name: 'themes',
    jump: themes,
    inputFocus: themesInput
  },
  {
    name: 'location',
    jump: location,
    inputFocus: null
  },
  {
    name: 'description',
    jump: description,
    inputFocus: null
  },
  {
    name: 'image',
    jump: image,
    inputFocus: null
  },
  {
    name: 'email',
    jump: email,
    inputFocus: emailInput
  }
]

const goToStep = (stepNumber: number) => {
  currentRef.value = stepNumber
  const step = steps[stepNumber - 1]
  step.inputFocus?.value?.focus()
  step.jump.value?.closest('.n-step-content')?.scrollIntoView({ behavior: 'smooth' })
}
const nextStep = () => {
  if (currentRef.value < totalSteps.value) {
    goToStep(currentRef.value + 1)
  }
}
const prevStep = () => {
  if (currentRef.value > 1) {
    goToStep(currentRef.value - 1)
  }
}

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
    const petitionCreated = await $client.petition.create.mutate({
      title: petition.value.title,
      content: petition.value.content,
      creatorEmail: petition.value.email,
      image: (petition.value.image.length && petition.value.image[0].url)
        ? {
            url: petition.value.image[0].url,
            name: petition.value.image[0].name
          }
        : undefined,
      petitionCampaign: petitionCampaignId,
      themes: petition.value.themes
    })
    if (user.value?.user) {
      navigateTo(`/petition/${petitionCreated.id}/manage`)
    } else {
      navigateTo('/verify')
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
  <div class="main-content">
    <n-form ref="formRef" :rules="formRules" :model="petition">
      <n-steps v-model:current="currentRef" :vertical="true" :status="currentStatus">
        <n-step :title="$t('petition_create.title')">
          <span ref="title" />
          <n-space class="n-step-description full" justify="center" vertical>
            <p>{{ $t('petition_create.title_description') }}</p>
            <n-form-item path="title">
              <n-input
                ref="titleInput"
                v-model:value="petition.title"
                type="text"
                :placeholder="$t('petition_create.title_placeholder')"
                size="large"
                @keyup.enter="nextStep()"
              />
            </n-form-item>
          </n-space>
        </n-step>
        <n-step :title="$t('petition_create.theme_title')">
          <span ref="themes" />
          <n-space class="n-step-description full" vertical justify="center" height="100%">
            <p>{{ $t('petition_create.theme_description') }}</p>
            <n-form-item path="themes">
              <n-select ref="themesInput" v-model:value="petition.themes" multiple :options="themeOptions" />
            </n-form-item>
          </n-space>
        </n-step>
        <n-step :title="`${$t('petition_create.location_title')}  (${$t('petition_create.optional')})`">
          <span ref="location" />
          <n-space class="n-step-description full" vertical justify="center" height="100%">
            <p>{{ $t('petition_create.location_description') }}</p>
            <LocationLookup />
          </n-space>
        </n-step>
        <n-step :title="$t('petition_create.petition_title')">
          <span ref="description" />
          <n-space class="n-step-description full" vertical justify="center" height="100%">
            <p>{{ $t('petition_create.petition_description') }}</p>
            <client-only @keyup.ctrl.enter="nextStep()">
              <TiptapEditor v-model="petition.content" />
            </client-only>
          </n-space>
        </n-step>
        <n-step :title="`${$t('petition_create.image_title')}  (${$t('petition_create.optional')})`">
          <div ref="image" class="n-step-description full">
            <p>{{ $t('petition_create.image_description') }}</p>
            <ImageUpload @change="(fileList) => petition.image = fileList" />
          </div>
        </n-step>
        <n-step :title="user?.authenticated ? $t('petition_create.create_button') : $t('petition_create.email_title')">
          <!-- Only if not signed in, otherwise just show button -->
          <div ref="email" class="n-step-description full">
            <div v-if="!user?.authenticated">
              <n-p>{{ $t("petition_create.email_description") }}</n-p>
              <n-form-item path="email">
                <n-input ref="emailInput" v-model:value="petition.email" type="text" />
              </n-form-item>
            </div>
            <!-- , { username: petition.email, callbackUrl: '/peition' }) -->
            <n-button @click="handleCreatePetition()">
              {{ $t('petition_create.create_button') }}
            </n-button>
            <div v-if="formWarningMessages.length > 0">
              <FormErrorList :errors="formWarningMessages" />
            </div>
          </div>
        </n-step>
      </n-steps>
    </n-form>
    <n-space class="navigation-buttons" justify="space-between">
      <div class="left">
        <n-button v-if="currentRef > 1" @click="prevStep()">
          {{ $t("petition_create.nav_previous") }}
        </n-button>
      </div>
      <div class="right">
        <n-button v-if="currentRef < totalSteps" @click.prevent="nextStep()">
          {{ $t("petition_create.nav_next") }}
        </n-button>
      </div>
    </n-space>
    {{ petition }}
  </div>
</template>

<style scoped>
.main-content {
    padding: 10px;
}
.n-step-description.full {
    min-height: 90vh;
}

.expand-text-box{
  flex-grow: 2;
}
.navigation-buttons{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
}

/* .n-step-description.title {
  display: flex;
  flex-direction: ver;
} */
</style>
