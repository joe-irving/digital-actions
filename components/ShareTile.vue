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

const sourcedUrl = (source: string) => {
  const url = new URL(props.url)
  url.searchParams.set('source', source)
  return url.toString()
}

const shareButtonLinks = ref({
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    sourcedUrl('facebook')
  )}&amp;src=sdkpreparse`,
  twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    props.tweet || props.description || ''
  )}&url=${encodeURIComponent(sourcedUrl('twitter'))}`,
  whatsapp: `https://wa.me/?text=${encodeURIComponent(
    props.whatsapp || props.description || ''
  )}+${sourcedUrl('whatsapp')}`
})

// const isCopied = ref(false)
// const copyUrl = () => {
//   navigator.clipboard.writeText(props.url)
//   isCopied.value = true
// }

// Generate whatsapp share, facebook share and twitter share links
</script>

<template>
  <n-space vertical>
    <CopyText :copy-text="sourcedUrl('copy')" />
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
