<script setup lang="ts">
const breadcrumbItems = ref([
  {
    link: '/',
    title: null,
    icon: 'dashicons:admin-home'
  },
  {
    link: '/petition/campaign',
    title: 'menu.petition_campaign',
    icon: null
  },
  {
    link: '/petition/campaign/new',
    title: 'menu.new',
    icon: null
  }
])
</script>

<template>
  <div>
    <TitleBar
      title="petition_campaign.create_new"
      :breadcrumbs="breadcrumbItems"
    />
    <div>
      Petition Form
    </div>
  </div>
</template>
