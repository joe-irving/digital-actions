<script setup lang="ts">

defineProps({
  showPrev: {
    type: Boolean,
    default: true
  },
  showNext: {
    type: Boolean,
    default: true
  },
  progress: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['next', 'prev'])

</script>

<template>
  <div class="w-full h-full grow flex justify-center">
    <div class="max-w-md p-4 flex flex-col justify-between">
      <n-progress type="line" :percentage="progress * 100" :show-indicator="false" />
      <div class="p-2 grow flex flex-col justify-center">
        <slot />
      </div>
      <div class="flex justify-between p-2">
        <div>
          <n-button v-if="showPrev" @click="emit('prev')">
            {{ $t("petition_create.nav_previous") }}
          </n-button>
        </div>
        <div>
          <n-button v-if="showNext" type="primary" @click="emit('next')">
            {{ $t("petition_create.nav_next") }}
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>
