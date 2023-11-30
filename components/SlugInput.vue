<script setup lang="ts">
import slugify from 'slugify'

const { $client } = useNuxtApp()

const props = defineProps({
  modelValue: {
    type: String,
    default: 'test'
  }
})
const slugValue = ref(props.modelValue)
const slugUnique = ref(true)
const emit = defineEmits(['update:modelValue'])

const valueUpdated = (slug: string) => {
  slugValue.value = slugify(slug, {
    trim: false,
    lower: true,
    strict: true
  })
  emit('update:modelValue', slugValue.value)
}

const checkSlugUnique = async () => {
  const { data: validate } = await $client.slug.checkUnique.useQuery({
    slug: slugValue.value
  })
  slugUnique.value = !!validate.value
}
</script>

<template>
  <div>
    <n-input v-model:value="slugValue" @input="valueUpdated" @blur="checkSlugUnique()" />
  </div>
</template>
