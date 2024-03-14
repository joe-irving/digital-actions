<script setup lang="ts">
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

// const runtimeConfig = useRuntimeConfig()
// const defaultCountry = ref<string>(runtimeConfig.public.defaultCountry)

const props = defineProps({
  default: {
    type: String as PropType<string | null>,
    required: false,
    default: () => null
  }
})

const phoneNumber = ref<PhoneInput>({
  country: null,
  countryCallingCode: null,
  formatted: null,
  nationalNumber: null,
  number: null,
  valid: null
})

const numberModel = ref<string>('')

if (props.default) {
  numberModel.value = props.default
}

const emit = defineEmits<{(e: 'update:modelValue', value: string): void, (e: 'update:country', value: string): void}>()

const countryChanged = (countryCode: string) => {
  emit('update:country', countryCode)
}

const onInput = (_num: number, input: PhoneInput) => {
//   console.log(_num)
//   console.log(input)
//   phoneNumber.value = input
  if (input.country?.iso2) {
    countryChanged(input.country?.iso2)
  }
}
</script>

<template>
  <client-only>
    <VueTelInput
      :v-model="numberModel"
      style-classes="n-input"
      :input-options="{placeholder: ''}"
    />
  </client-only>
</template>
