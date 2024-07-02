<script setup lang="ts">
const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const code = ref(`<iframe id="embed-${props.slug}" src="${useShareUrl(props.slug)}?embed" style="width: 100%; height: 1000px; border: 0;" />`)
</script>

<template>
  <div>
    <CopyText :copy-text="code" />
    <Nh3>{{ $t('pc_manage.example_display') }}</Nh3>
    <div v-html="code" />
  </div>
</template>
