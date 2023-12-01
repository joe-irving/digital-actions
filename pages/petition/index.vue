<script setup lang="ts">
// Get petitions on account
// Get petition campaigns on account
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
    <div>
      <PetitionApprovalList />
    </div>
  </div>
</template>
