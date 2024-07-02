<script setup lang="ts">
const props = defineProps({
  copyText: {
    type: String,
    required: true
  }
})

const isCopied = ref(false)
const copyUrl = () => {
  navigator.clipboard.writeText(props.copyText)
  isCopied.value = true
}

</script>

<template>
  <div class="flex flex-wrap gap-2 justify-center" @click="copyUrl">
    <div class="rounded p-2 border-2 grow min-w-24">
      {{ copyText }}
    </div>
    <div class="grow-0">
      <n-button :type="isCopied ? 'success' : undefined">
        <template #icon>
          <NaiveIcon :name="isCopied ? 'material-symbols:check-circle-outline' : 'mdi:clipboard'" />
        </template>
        {{ isCopied ? $t('share.copied') : $t('share.copy') }}
      </n-button>
    </div>
  </div>
</template>
