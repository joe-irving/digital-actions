<script setup lang="ts">
const { $client } = useNuxtApp()
// get petition campaigns that user has permission to manage

const testCreate = () => {
  $client.petitionCampaign.create.mutate({
    title: 'Test title',
    tagPrefix: 'Another Test'
  })
}
</script>

<template>
  <div>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <NuxtLink to="/">
          <NaiveIcon name="dashicons:admin-home" />
        </NuxtLink>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <NuxtLink to="/petition/campaign">
          {{ $t('menu.petition_campaign') }}
        </NuxtLink>
      </n-breadcrumb-item>
    </n-breadcrumb>
    <n-button to="new">
      Click me
    </n-button>
  </div>
</template>
