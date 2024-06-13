<script setup lang="ts">
const { $client } = useNuxtApp()

const { data: users } = await $client.user.all.useQuery()
</script>

<template>
  <div>
    <UserProfile v-for="user in users" :key="user.id" :user="user" />
  </div>
</template>
