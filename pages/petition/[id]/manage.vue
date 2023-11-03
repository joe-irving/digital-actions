<script setup lang="ts">

const route = useRoute()
const router = useRouter()
const { $client } = useNuxtApp()
const verificationToken = route.query.token?.toString() || undefined
const { data: petition } = await $client.petition.getManage.useQuery({
  id: parseInt(route.params.id.toString()),
  token: verificationToken
})
if (petition && verificationToken) {
  router.push({
    query: {
      token: undefined
    }
  })
}
</script>

<template>
  <div>{{ petition }}</div>
</template>
