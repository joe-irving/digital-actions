<script setup lang="ts">
const breadcrumbs = ref([
  {
    title: 'menu.home',
    link: '/',
    icon: null
  },
  {
    title: 'menu.petition',
    link: '/petition',
    icon: null
  }
])
</script>

<template>
  <div>
    <TitleBar :title="$t('menu.petitions')" :breadcrumbs="breadcrumbs" class="p-4" />
    <PetitionApprovalList />
  </div>
</template>
