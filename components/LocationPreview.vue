<script setup lang="ts">
// import { PropType } from 'nuxt/dist/app/compat/capi'
import type { NominatimLocationInfo } from '~/types'

const emit = defineEmits(['close'])

const props = defineProps({
  locationValue: {
    type: Object as PropType<NominatimLocationInfo | null>,
    default: () => null
  }
})

const latLng = computed(() : [number, number] => {
  if (props.locationValue) {
    return [parseFloat(props.locationValue.lat), parseFloat(props.locationValue.lon)]
  } else {
    return [0, 0]
  }
})

const handleClose = () => {
  emit('close', { close: 'close' })
}
</script>

<template>
  <div class="location-box shadow relative">
    <div class="relative">
      <div v-if="locationValue" class="map-container relative">
        <LMap
          ref="map"
          :zoom="10"
          :center="latLng"
          :options="{
            zoomControl: false,
            dragging: false,
            boxZoom: false
          }"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
            layer-type="base"
            name="OpenStreetMap"
          />
        <!-- <LMarker :lat-lng="latLng" /> -->
        </LMap>
      </div>
    </div>

    <div class="address-content">
      <n-h2>
        {{ locationValue?.name }}
      </n-h2>
      <n-p>{{ locationValue?.display_name }}</n-p>
      <n-button @click="handleClose()">
        {{ $t('petition_create.close') }}
      </n-button>
      <n-button tertiary circle class="absolute top-0 right-0 close-button" @click="handleClose()">
        <template #icon>
          <NaiveIcon name="mdi:close" @click="handleClose()" />
        </template>
      </n-button>
    </div>
  </div>
</template>

<style>
.map-container {
    height: 150px;
    width: 100%;
}
.address-content {
    padding: 10px;
}
.close-button {
    z-index: 1000;
}
</style>
