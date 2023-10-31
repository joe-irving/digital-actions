<script setup lang="ts">
import { StepsProps } from 'naive-ui'
// Get id prop, if it is an int then get the campaign, if not create without link to campaign?
// Set layout to be plain
const currentRef = ref<number>(1)
const currentStatus = ref<StepsProps['status']>('process')
const totalSteps = ref(4)

const title = ref(null)
const description = ref(null)
const image = ref(null)
const email = ref(null)

const petition = ref({
  title: '',
  description: '',
  image: '',
  userEmail: ''
})

const steps = [title, description, image, email]

const nextStep = () => {
  if (currentRef.value < totalSteps.value) {
    currentRef.value += 1
    console.log(email.value)
    // steps[currentRef.value].value.scrollIntoView({ behavior: 'smooth' })
    email.value?.scrollIntoView({ behavior: 'smooth' })
  }
}
const prevStep = () => {
  if (currentRef.value > 1) {
    currentRef.value -= 1
  }
}

definePageMeta({
  layout: 'public'
})
</script>

<template>
  <div class="main-content">
    <n-steps v-model:current="currentRef" :vertical="true" :status="currentStatus">
      <n-step ref="title" :title="$t('petition_create.title')">
        <div class="n-step-description">
          <p>{{ $t('petition_create.title_description') }}</p>
          <n-input v-model:value="petition.title" type="text" :placeholder="$t('petition_create.title_placeholder')" @keyup.enter="nextStep()" />
        </div>
      </n-step>
      <n-step ref="description" :title="$t('petition_create.petition_title')">
        <div class="n-step-description">
          <p>{{ $t('petition_create.petition_description') }}</p>
          <n-input
            v-model:value="petition.description"
            type="textarea"
            @keyup.enter="nextStep()"
          />
        </div>
      </n-step>
      <n-step ref="image" :title="$t('petition_create.image_title')">
        <div class="n-step-description">
          <p>{{ $t('petition_create.image_description') }}</p>
          <n-upload
            action="TODO"
            accept="image/*"
            :default-upload="true"
            :max="1"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <NaiveIcon
                  :size="48"
                  :depth="3"
                  name="material-symbols:upload"
                />
              </div>
              <n-text style="font-size: 16px">
                {{ $t("petition_create.image_upload_text") }}
              </n-text>
            </n-upload-dragger>
          </n-upload>
        </div>
      </n-step>
      <n-step ref="email" :title="$t('petition_create.email_title')">
        <div class="n-step-description">
          <n-p>{{ $t("petition_create.email_description") }}</n-p>
          <n-input v-model:value="petition.userEmail" type="text" />
        </div>
      </n-step>
    </n-steps>
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
.navigation-buttons{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
}
</style>
