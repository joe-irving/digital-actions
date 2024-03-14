<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const countries = useGetCountryList()
const defaultCountry = ref<string>(runtimeConfig.public.defaultCountry)

const props = defineProps({
  modelValue: {
    type: String as PropType<string | null>,
    required: false,
    default: () => null
  }
})
const emit = defineEmits<{(e: 'update:modelValue', value: string): void}>()

const country = ref<string>(props.modelValue || '')
const countryOptions = ref(countries.map((c) => { return { label: c.name, value: c.iso2 } }))

if (props.modelValue === '' || !props.modelValue) {
  country.value = defaultCountry.value
  emit('update:modelValue', country.value)
}

const countryUpdated = () => {
  emit('update:modelValue', country.value)
}
</script>

<template>
  <n-select v-model:value="country" :options="countryOptions" @update:value="countryUpdated" />
</template>
