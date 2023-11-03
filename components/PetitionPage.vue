<script setup lang="ts">
const { $client } = useNuxtApp()

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const { data: petition } = await $client.petition.getPublic.useQuery({
  id: props.id
})
</script>

<template>
  <CustomThemeWrapper :theme="petition?.petitionCampaign?.styleTheme">
    <n-space justify="center" class="mt-10 mb-10">
      <n-space>
        <n-space class="max-w-lg flex-wrap">
          <n-space>
            <n-image :src="petition?.image?.url" />
            <n-h1>{{ petition?.title }}</n-h1>
            <div v-html="petition?.content" />
          </n-space>
        </n-space>
        <n-space>
          <n-space><PetitionForm /></n-space>
        </n-space>
      </n-space>
    </n-space>

    <div>{{ petition }}</div>
  </CustomThemeWrapper>
</template>
