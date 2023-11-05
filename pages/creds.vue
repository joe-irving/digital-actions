<script setup lang="ts">
const { $client } = useNuxtApp()

const breadcrumbItems = ref([
  {
    link: '/',
    title: 'menu.home',
    icon: null
  },
  {
    link: '/creds',
    title: 'menu.creds',
    icon: null
  }
])

const newCreds = ref({
  name: '',
  key: ''
})

const createCreds = async () => {
  const created = await $client.actionNetwork.registerKey.mutate(newCreds.value)
}
</script>

<template>
  <div class="p-2">
    <TitleBar
      title=""
      :breadcrumbs="breadcrumbItems"
    />
    <n-tabs type="line" animated>
      <n-tab-pane name="register" :tab="$t('creds.register')">
        <n-form :model="newCreds" @submit.prevent="createCreds">
          <n-form-item :label="$t('creds.name')">
            <n-input v-model:value="newCreds.name" />
          </n-form-item>
          <n-form-item :label="$t('creds.key')">
            <n-input v-model:value="newCreds.key" />
          </n-form-item>
          <n-button @click.prevent="createCreds">
            Create
          </n-button>
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
