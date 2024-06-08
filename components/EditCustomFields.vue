<script setup lang="ts">
// / Get list of fields, pass to edit field and deal with ordering
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;

type CustomFields = RouterOutput['petition']['getManage']['customFields']

const { $client } = useNuxtApp()

const props = defineProps({
  petitionId: {
    type: Number,
    required: true
  },
  fields: {
    type: Array as PropType<CustomFields>,
    required: true
  }
})
const fieldValues = ref(props.fields)
fieldValues.value.sort((a, b) => {
  return a.order - b.order
})
// first off set the order to be 0-n

fieldValues.value.forEach((_field, index, _fields) => {
  if (fieldValues.value[index].order === index) {
    return
  }
  fieldValues.value[index].order = index
  $client.customFields.update.mutate({
    id: fieldValues.value[index].id,
    order: index
  })
})

const moveField = (by: number, index: number) => {
  if ((index + by) < 0) {
    return
  }
  fieldValues.value[index].order += by
  fieldValues.value[index + by].order -= by
  $client.customFields.update.mutate({
    id: fieldValues.value[index].id,
    order: fieldValues.value[index].order
  })
  $client.customFields.update.mutate({
    id: fieldValues.value[index + by].id,
    order: fieldValues.value[index + by].order
  })
  fieldValues.value.sort((a, b) => {
    return a.order - b.order
  })
}

const createField = async (type: 'text' | 'checkbox') => {
  const newField = await $client.customFields.create.mutate({
    type,
    petitionId: props.petitionId,
    label: `Label for ${type} field`,
    name: `${type} field`
  })
  fieldValues.value.push(newField)
}

const fieldDeleted = (field: CustomFields[number]) => {
  const index = fieldValues.value.indexOf(field)
  if (index > -1) {
    fieldValues.value.splice(index, 1)
  }
}
</script>

<template>
  <div>
    <n-space v-for="(field, index) in fieldValues" :key="field.id">
      <n-space vertical>
        <n-button circle @click="() => moveField(-1, index)">
          <template #icon>
            <NaiveIcon name="material-symbols:arrow-upward" />
          </template>
        </n-button>
        <n-button circle @click="() => moveField(1, index)">
          <template #icon>
            <NaiveIcon name="material-symbols:arrow-downward" />
          </template>
        </n-button>
      </n-space>
      <EditCustomField :field="field" @delete="fieldDeleted" />
    </n-space>
    <n-space>
      <n-button @click="createField('text')">
        <template #icon>
          <NaiveIcon name="material-symbols:text-fields-rounded" />
        </template>
        {{ $t('petition.new_text_field') }}
      </n-button>
      <n-button @click="createField('checkbox')">
        <template #icon>
          <NaiveIcon name="material-symbols:check-box-outline" />
        </template>
        {{ $t('petition.new_checkbox_field') }}
      </n-button>
    </n-space>
  </div>
</template>
