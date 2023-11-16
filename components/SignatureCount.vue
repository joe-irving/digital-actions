<script setup lang="ts">
import type { NumberAnimationInst } from 'naive-ui'
const { locale } = useI18n()

const props = defineProps({
  count: {
    type: Number,
    default: 0
  }
})

const nextTarget = computed(() => {
  return useGetNextPetitionTarget(props.count)
})

const animatedCount = ref<NumberAnimationInst | null>(null)
</script>

<template>
  <n-space class="shadow max-w-sm p-2" justify="center">
    <n-progress type="dashboard" gap-position="bottom" :percentage="(count / nextTarget) * 100" unit="">
      <n-statistic :label="$t('petition.signatures')">
        <n-number-animation
          ref="animatedCount"
          :from="0"
          :to="count"
          :active="true"
          :precision="0"
          :duration="1000"
          :show-separator="true"
          :locale="locale"
        />
      </n-statistic>
    </n-progress>
  </n-space>
</template>
