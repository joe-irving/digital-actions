<script setup lang="ts">
import { StepsProps, InputInst, FormRules } from 'naive-ui'

const { $i18n } = useNuxtApp()
// Get id prop, if it is an int then get the campaign, if not create without link to campaign?
// Set layout to be plain
const currentRef = ref<number>(1)
const currentStatus = ref<StepsProps['status']>('process')
const totalSteps = ref(4)

const title = ref<HTMLElement | null>(null)
const titleInput = ref<InputInst | null>(null)

const description = ref<HTMLElement | null>(null)
// const descriptionInput = ref<InputInst | null>(null)
const image = ref<HTMLElement | null>(null)
// const imageInput = ref<InputInst | null>(null)
const email = ref<HTMLElement | null>(null)
const emailInput = ref<InputInst | null>(null)

const petition = ref({
  title: '',
  description: 'Example description',
  image: '',
  userEmail: ''
})

// const emailStatus = computed(() => {
//   if (!petition.value.userEmail.length){
//     return 'wait'
//   } else if ()
// })

const steps = [
  {
    name: 'title',
    jump: title,
    inputFocus: titleInput
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

const formRules = ref<FormRules>({
  title: {
    required: true,
    message: $i18n.t('petition_create.title_validator'),
    trigger: ['input']
  }
})

const goToStep = (stepNumber: number) => {
  currentRef.value = stepNumber
  const step = steps[stepNumber - 1]
  // step.inputFocus?.value?.focus()
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

definePageMeta({
  layout: 'public',
  auth: false
})
</script>

<template>
  <div class="main-content">
    <n-form :rules="formRules" :model="petition">
      <n-steps v-model:current="currentRef" :vertical="true" :status="currentStatus">
        <n-step :title="$t('petition_create.title')">
          <span ref="title" />
          <n-space class="n-step-description" justify="center" vertical>
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
        <n-step :title="$t('petition_create.petition_title')">
          <span ref="description" />
          <n-space class="n-step-description" vertical justify="center" height="100%">
            <p>{{ $t('petition_create.petition_description') }}</p>
            <client-only @keyup.ctrl.enter="nextStep()">
              <TiptapEditor v-model="petition.description" />
            </client-only>
          </n-space>
        </n-step>
        <n-step :title="$t('petition_create.image_title')">
          <div ref="image" class="n-step-description">
            <p>{{ $t('petition_create.image_description') }}</p>
            <ImageUpload />
          </div>
        </n-step>
        <n-step :title="$t('petition_create.email_title')">
          <div ref="email" class="n-step-description">
            <n-p>{{ $t("petition_create.email_description") }}</n-p>
            <n-input ref="emailInput" v-model:value="petition.userEmail" type="text" />
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
        <n-button v-if="currentRef < totalSteps" @click="nextStep()">
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
.n-step-description {
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
