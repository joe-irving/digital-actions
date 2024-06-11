<script setup lang="ts">
// some comment
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;
type Signatures = RouterOutput['petition']['signatureCount'];

const props = defineProps({
  signatures: {
    type: Object as PropType<Signatures>,
    required: true
  },
  class: {
    type: String,
    required: false,
    default: undefined
  }
})
const styleClass = props.class
const count = ref(props.signatures?.count || 0)
const target = computed(() => useGetNextTarget(count.value))
const percent = computed(() => 100 * count.value / target.value)
</script>

<template>
  <div :class="styleClass">
    <div class="flex flex-col justify-center">
      <n-progress
        type="line"
        :percentage="percent"
        :border-radius="4"
        :fill-border-radius="0"
        :show-indicator="false"
      />
    </div>
    <div class="flex justify-between">
      <div class="p-2 flex flex-col justify-center content-center text-left">
        <span class="text-xl">
          {{ $n(count, 'decimalInt') }}
        </span>
        <span>{{ $t("petition_form.signatures") }}</span>
      </div>
      <div class="p-2 flex flex-col justify-center content-center text-right">
        <span class="text-xl">
          {{ $n(target, 'decimalInt') }}
        </span>
        <span>{{ $t("petition_form.next_target") }}</span>
      </div>
    </div>
  </div>
</template>
