<script setup lang="ts">
import { PropType } from 'nuxt/dist/app/compat/capi'
import { AutoCompleteOption } from 'naive-ui'
import { NominatimLocationInfo } from '~/types'

// set model prop for location selected

const props = defineProps({
  modelValue: {
    type: Object as PropType<NominatimLocationInfo | null>,
    default: () => null
  },
  limitCountry: {
    type: String,
    required: false,
    default: undefined
  }
})

const locationSearch = ref<NominatimLocationInfo[]>([])

const locationSearchQuery = ref('')

const locationSearchOptions = computed((): AutoCompleteOption[] => {
  return locationSearch.value.map((loc) => {
    return {
      label: loc.display_name,
      value: loc.place_id.toString()
    }
  })
})

const isClear = computed(() => {
  if (!locationSearchQuery.value || locationSearchQuery.value === '') {
    emit('update:modelValue', null)
    return true
  }
  return false
})

const emit = defineEmits(['update:modelValue'])
// define lookup function to nomiatim
const lookupNominatim = async () => {
  const { data: lookup } = await useFetch<NominatimLocationInfo[]>('https://nominatim.openstreetmap.org/search.php', {
    query: {
      q: encodeURIComponent(locationSearchQuery.value),
      format: 'jsonv2',
      addressdetails: 1,
      countrycodes: props.limitCountry || undefined
    }
  })
  locationSearch.value = lookup.value || []
  if (!locationSearchQuery.value || locationSearchQuery.value === '') {
    emit('update:modelValue', null)
  }
}

const optionSelected = (value: string) => {
  const selectedLocation = locationSearch.value.find(loc => loc.place_id === parseInt(value))
  emit('update:modelValue', selectedLocation || null)
}

const locationClosed = () => {
  emit('update:modelValue', null)
  locationSearchQuery.value = ''
  locationSearch.value = []
}
</script>

<template>
  <div>
    <n-auto-complete
      v-if="!modelValue"
      v-model:value="locationSearchQuery"
      :options="locationSearchOptions"
      clearable
      @keyup="lookupNominatim"
      @select="optionSelected"
    />
    <LocationPreview v-if="!isClear && modelValue" :location-value="modelValue" @close="locationClosed" />
  </div>
</template>
