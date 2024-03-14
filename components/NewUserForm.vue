<script setup lang="ts">
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

const props = defineProps({
  user: {
    required: true,
    type: Object as PropType<UserOutput>
  }
})
const userInput = ref<UserOutput>(props.user)

const emit = defineEmits<{(e: 'update', value: UserOutput): void, (e: 'submit', value: UserOutput): void}>()

const updateUser = () => {
  emit('update', userInput.value)
}

const onPhoneInput = (input: PhoneInput) => {
//   console.log(_num)
  console.log(input)
//   phoneNumber.value = input
  // if (input.country?.iso2) {
  //   countryChanged(input.country?.iso2)
  // }
}
</script>

<template>
  <n-form v-if="userInput" @keyup="updateUser()">
    {{ userInput }}
    <n-form-item path="name" :label="$t('user.name_label')">
      <n-input v-model:value="userInput.name" />
    </n-form-item>
    <n-form-input path="phone" :label="$t('user.phone_label')">
      <client-only>
        <VueTelInput
          v-model="userInput.phone"
          @on-input="(_num: number, input: PhoneInput) => console.log(input)"
        />
      </client-only>
    </n-form-input>
    <n-form-item path="country" :label="$t('user.country_label')">
      <CountryField v-model="userInput.country" />
    </n-form-item>
  </n-form>
</template>
