<script setup lang="ts">
const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

const { $client } = useNuxtApp()

const { data: permissions } = await $client.petitionCampaignPermission.list.useQuery({
  id: props.id
})
</script>

<template>
  <div>
    <div
      v-for="p in permissions"
      :key="p.id"
      class="flex gap-2"
    >
      <UserProfile :user="p.user" :align-right="false" />
      <n-tag>{{ p.type }}</n-tag>
      Invite user box & change permission level toggle
    </div>
  </div>
</template>
