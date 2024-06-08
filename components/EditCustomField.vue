<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;

type CustomField = RouterOutput['petition']['getManage']['customFields'][number];
// This accepts a single custom field
// It has an edit and view version
// When you click away, it goes into view version and saves
// When it edit version you can edit each section of the form

// To save, the update endpoint is called
const { $client } = useNuxtApp()

const props = defineProps({
  field: {
    type: Object as PropType<CustomField>,
    required: true
  }
})

const emit = defineEmits<{(e: 'delete', value: CustomField): void}>()

const fieldValue = ref(props.field)

const editMode = ref(false)

const documentMouseDown = ref(false)
const fieldMouseOver = ref(false)

const markMouseAs = (val: boolean) => {
  documentMouseDown.value = val
}
const deleteField = () => {
  $client.customFields.delete.mutate({ id: props.field.id })
  emit('delete', props.field)
}

watch(documentMouseDown, () => {
  if (documentMouseDown.value && fieldMouseOver.value && !editMode.value) {
    editMode.value = true
  } else if (documentMouseDown.value && !fieldMouseOver.value && editMode.value) {
    $client.customFields.update.mutate({
      id: fieldValue.value.id,
      label: fieldValue.value.label,
      name: fieldValue.value.name,
      required: fieldValue.value.required
    })
    editMode.value = false
  }
})

onMounted(() => {
  document.body.addEventListener('mousedown', () => markMouseAs(true))
  document.body.addEventListener('mouseup', () => markMouseAs(false))
})

onUnmounted(() => {
  document.body.removeEventListener('mousedown', () => markMouseAs(true))
  document.body.removeEventListener('mousedown', () => markMouseAs(false))
})
</script>

<template>
  <div @mouseover="() => fieldMouseOver = true" @mouseleave="() => fieldMouseOver = false">
    <n-card v-if="editMode">
      <n-form v-if="field.type === 'checkbox' || field.type === 'text'" v-model="fieldValue">
        <Nh3>{{ $t('petition.edit_title', field) }}</Nh3>
        <n-form-item label-placement="left" size="large" path="label" :label="$t('petition.custom_field_label')">
          <n-input v-model:value="fieldValue.label" />
        </n-form-item>
        <n-space>
          <n-form-item size="small" label-placement="left" path="name" :label="$t('petition.custom_field_name')">
            <n-input v-model:value="fieldValue.name" />
          </n-form-item>
        </n-space>
        <n-space justify="space-between">
          <n-switch v-model:value="fieldValue.required">
            <template #checked>
              {{ $t('petition.required') }}
            </template>
            <template #unchecked>
              {{ $t('petition.optional') }}
            </template>
          </n-switch>

          <n-button @click="() => deleteField()">
            <template #icon>
              <NaiveIcon name="mdi:delete" />
            </template>
          </n-button>
        </n-space>
      </n-form>
      <div v-else>
        <Nh3>TODO: edit other types of field</Nh3>
      </div>
    </n-card>
    <div v-else>
      <PetitionCustomFields :fields="[field]" />
    </div>
  </div>
</template>
