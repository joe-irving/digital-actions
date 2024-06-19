<script lang="ts" setup>
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;

type CustomFields = RouterOutput['petition']['getPublic']['customFields'];

const props = defineProps({
  fields: {
    type: Array as PropType<CustomFields>,
    default: () => []
  }
})

const emit = defineEmits<{(e: 'update', value: {[key: string]: string}): void}>()

const sortedFields = ref(props.fields)
sortedFields.value.sort((a, b) => a.order - b.order)

const formValue = ref<{
    [key: string]: string | undefined
}>({})

for (const field of props.fields) {
  formValue.value[field.name] = undefined
}

watch(formValue.value, () => {
  const output: {[key: string]: string} = {}
  let value: string | boolean | undefined
  for (const field of props.fields) {
    value = formValue.value[field.name]
    if (!value) {
      continue
    }
    if (field.type === 'checkbox') {
      output[field.name] = '1'
    } else if (typeof value === 'string') {
      output[field.name] = value
    }
  }
  emit('update', output)
  return output
})
</script>

<template>
  <div>
    <n-form-item
      v-for="field in sortedFields"
      :key="field.id"
      :label="field.type === 'checkbox' ? undefined : field.label"
      :required="field.type === 'checkbox' ? undefined : field.required"
      :show-label="field.type !== 'checkbox'"
    >
      <n-checkbox v-if="field.type === 'checkbox'" v-model:checked="formValue[field.name]" :label="field.label" />
      <n-radio-group v-if="field.type === 'radio' && field.options.length > 0" v-model:value="formValue[field.name]" :name="field.name" :label="field.label" :required="field.required">
        <n-space vertical>
          <n-radio
            v-for="option in field.options"
            :key="option.id"
            :value="option.name"
            :label="option.label"
          />
        </n-space>
      </n-radio-group>
      <n-input v-else-if="field.type === 'text' && ((typeof formValue[field.name]) === 'string' || formValue[field.name] === undefined)" v-model:value="formValue[field.name]" />
    </n-form-item>
  </div>
</template>
