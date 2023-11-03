<script setup lang="ts">

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  tweet: {
    type: String,
    default: ''
  },
  whatsapp: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  }
})

const shareButtonLinks = ref({
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    props.url
  )}`,
  twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    props.tweet || props.description || ''
  )}&url=${encodeURIComponent(props.url)}`,
  whatsapp: `https://wa.me/?text=${encodeURIComponent(
    props.whatsapp || props.description || ''
  )}+${props.url}`
})

const isCopied = ref(false)
const copyUrl = () => {
  navigator.clipboard.writeText(props.url)
  isCopied.value = true
}

// Generate whatsapp share, facebook share and twitter share links
</script>

<template>
  <n-space vertical>
    <div class="flex flex-wrap gap-2 justify-center" @click="copyUrl">
      <div class="rounded p-2 border-2 grow min-w-24">
        {{ props.url }}
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
    <n-space justify="space-between">
      <NuxtLink :to="shareButtonLinks.twitter" target="_blank">
        <n-button>
          <template #icon>
            <NaiveIcon name="mdi:twitter" />
          </template>
          {{ $t("share.twitter") }}
        </n-button>
      </NuxtLink>
      <NuxtLink :to="shareButtonLinks.facebook" target="_blank">
        <n-button>
          <template #icon>
            <NaiveIcon name="mdi:facebook" />
          </template>{{ $t("share.facebook") }}
        </n-button>
      </NuxtLink>
      <NuxtLink :to="shareButtonLinks.whatsapp" target="_blank">
        <n-button>
          <template #icon>
            <NaiveIcon name="mdi:whatsapp" />
          </template>
          {{ $t("share.whatsapp") }}
        </n-button>
      </NuxtLink>
    </n-space>
  </n-space>
</template>
