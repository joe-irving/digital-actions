<script setup lang="ts">
// import { PropType } from 'nuxt/dist/app/compat/capi'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { AutoCompleteOption } from 'naive-ui'
import type { AppRouter } from '~/server/trpc/routers'
// import type { NominatimLocationInfo } from '~/types'

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

type Location = RouterInput['petition']['create']['location'];

// set model prop for location selected

const props = defineProps({
  modelValue: {
    type: Object as PropType<Location | undefined>,
    default: () => undefined
  },
  default: {
    type: Object as PropType<RouterOutput['petition']['getManage']['location'] | undefined>,
    default: () => undefined
  },
  limitCountry: {
    type: String,
    required: false,
    default: undefined
  }
})

const defaultValue = ref<RouterOutput['petition']['getManage']['location'] | undefined>(props.default)

const locationSearch = ref<Location[]>([])

const locationSearchQuery = ref('')

const locationSearchOptions = computed((): AutoCompleteOption[] => {
  return locationSearch.value.filter(loc => loc).map((loc) => {
    return {
      label: loc?.display_name,
      value: loc?.place_id.toString()
    }
  })
})

const emit = defineEmits(['update:modelValue'])
// define lookup function to nomiatim
const lookupNominatim = async () => {
  const { data: lookup } = await useFetch<Location[]>('https://nominatim.openstreetmap.org/search.php', {
    query: {
      q: encodeURIComponent(locationSearchQuery.value),
      format: 'jsonv2',
      addressdetails: 1,
      countrycodes: props.limitCountry || undefined
    }
  })
  locationSearch.value = lookup.value || []
  if (!locationSearchQuery.value || locationSearchQuery.value === '') {
    emit('update:modelValue', undefined)
  }
}

const optionSelected = (value: string) => {
  const selectedLocation = locationSearch.value.find(loc => loc?.place_id === parseInt(value))
  emit('update:modelValue', selectedLocation || undefined)
}

const locationClosed = () => {
  emit('update:modelValue', undefined)
  defaultValue.value = undefined
  locationSearchQuery.value = ''
  locationSearch.value = []
}
</script>

<template>
  <div>
    <n-auto-complete
      v-if="!modelValue && !defaultValue"
      v-model:value="locationSearchQuery"
      :options="locationSearchOptions"
      clearable
      @keyup="lookupNominatim"
      @select="optionSelected"
    />
    <LocationPreview v-if="modelValue || defaultValue" :location-value="modelValue || defaultValue" @close="locationClosed" />
  </div>
</template>
