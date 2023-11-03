<script setup lang="ts">
import { TRPCClientError } from '@trpc/client'
import { FormInst } from 'naive-ui'
const { $client } = useNuxtApp()
const router = useRouter()

const createCampaign = async () => {
  // Is there a target list, if not create
  let targetListId = parseInt(formValue.value.targetListId || '0')
  if (targetListId === 0) {
    const targetList = await $client.targetList.create.mutate({
      name: targetListName.value
    })
    targetListId = targetList.id
  }
  try {
    const c = await $client.tweetCampaign.create.mutate({
      targetListId,
      title: formValue.value.title,
      slug: formValue.value.slug,
      description: formValue.value.description
    })
    router.push(`/tweet/${c.id}`)
  } catch (err) {
    if (err instanceof TRPCClientError) {
      errorMessage.value = err.message
    } else {
      throw err
    }
  }
}

// Form with name, description, target list (drop down from public) & slug
const { data: publicTargetLists } = await $client.targetList.listUserTargets.useQuery()
const publicTargetOptions = computed(() => {
  if (!publicTargetLists.value) {
    return []
  }
  return publicTargetLists.value.map((t) => {
    return {
      label: t.name,
      value: t.id.toString()
    }
  })
})
const allOptions = [{ label: 'Create new', value: '0' }, ...publicTargetOptions.value]
const formRef = ref<FormInst | null>()
const formValue = ref({
  title: '',
  slug: '',
  description: '',
  targetListId: undefined
})
const targetListName = ref<string>('')
const errorMessage = ref<string | null>(null)
</script>

<template>
  <div>
    <n-form ref="formRef" :model="formValue" size="large" @submit.prevent="createCampaign">
      <n-form-item path="title" label="Title">
        <n-input v-model:value="formValue.title" placeholder="The title of your campaign" />
      </n-form-item>
      <n-form-item path="slug" label="Slug">
        <n-input v-model:value="formValue.slug" placeholder="A unique value" />
      </n-form-item>
      <n-form-item path="description" label="Description">
        <n-input v-model:value="formValue.description" placeholder="Tell people about your campaign" />
      </n-form-item>
      <n-form-item path="targetListId" label="Targets">
        <n-select v-model:value="formValue.targetListId" :options="allOptions" />
      </n-form-item>
      <n-form-item v-if="formValue.targetListId === '0'" path="targetListName" label="New Target List Name">
        <n-input v-model:value="targetListName" />
      </n-form-item>
      <n-button @click="createCampaign">
        Create
      </n-button>
    </n-form>
    <n-card v-if="errorMessage" :title="errorMessage" />
  </div>
</template>
