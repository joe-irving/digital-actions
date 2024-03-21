<script setup lang="ts">
import type { FormValidationError, FormInst, FormRules, FormItemRule, FormItemInst } from 'naive-ui'
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;

type UserOutput = RouterOutput['user']['me']['user'];

interface CountryCode {
  iso2: string;
  name: string;
  dialCode: string
}

interface PhoneInput {
  country: CountryCode | null
  countryCallingCode: string | null
  formatted: string | null
  nationalNumber: string | null
  number: string | null
  valid: boolean | null
}

const { t } = useI18n()

const props = defineProps({
  user: {
    required: true,
    type: Object as PropType<UserOutput>
  }
})
const userInput = ref<UserOutput>(props.user)
const userFormRef = ref<FormInst | null>(null)

const phoneInputDummy = ref<string | null>(props.user?.phone || null)
const phoneInput = ref<PhoneInput | null>(null)
const phoneInputRef = ref<FormItemInst | null>(null)

const formRules = ref<FormRules>({
  name: {
    required: true,
    trigger: ['blur'],
    message: t('user.name_required')
  },
  phone: {
    required: false,
    trigger: ['blur'],
    validator (_rule: FormItemRule, value: string) {
      if (value === '') {
        return true
      } else if (phoneInput.value && phoneInput.value.formatted && !phoneInput.value.valid) {
        return new Error(t('user.phone_invalid'))
      }
      return true
    }
  },
  postCode: {
    required: false,
    trigger: ['blur'],
    validator (_rule: FormItemRule, value: string) {
      if (value.length > 10) {
        return new Error(t('user.post_code_invalid'))
      }
      return true
    }
  }
})

const emit = defineEmits<{(e: 'update', value: UserOutput): void, (e: 'submit', value: UserOutput): void}>()

const updateUser = () => {
  emit('update', userInput.value)
}
const sumbitUser = () => {
  userFormRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      emit('submit', userInput.value)
    }
  })
}

watch(() => userInput.value, () => {
  updateUser()
})

const onPhoneInput = (input: PhoneInput) => {
  phoneInput.value = input
  if (userInput.value) {
    if (userInput.value.country && input.country?.iso2) {
      userInput.value.country = input.country.iso2
    }
    if (input.number) {
      userInput.value.phone = input.number
    }
  }
  phoneInputRef.value?.validate()
}
</script>

<template>
  <n-form v-if="userInput" ref="userFormRef" :rules="formRules" :model="userInput" @keyup="updateUser()">
    <n-form-item path="name" :label="$t('user.name_label')">
      <n-input v-model:value="userInput.name" />
    </n-form-item>
    <n-form-item ref="phoneInputRef" path="phone" :label="$t('user.phone_label')">
      <client-only>
        <VueTelInput
          v-model="phoneInputDummy"
          style-classes="n-input"
          :input-options="{placeholder: ''}"
          @on-input="(_num: number, input: PhoneInput) => onPhoneInput(input)"
        />
      </client-only>
    </n-form-item>
    <n-form-item path="country" :label="$t('user.country_label')">
      <CountryField v-model="userInput.country" />
    </n-form-item>
    <n-form-item path="postCode" :label="$t('user.post_code_label')">
      <n-input v-model:value="userInput.postCode" />
    </n-form-item>
    <n-space justify="center">
      <n-button type="success" size="large" @click.prevent="sumbitUser()">
        {{ $t('user.update_button') }}
      </n-button>
    </n-space>
  </n-form>
</template>
