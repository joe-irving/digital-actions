<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;

type PetitionListItemPublic = RouterOutput['petitionCampaign']['getPublicList'][number];
type PetitionListItemManage = RouterOutput['petition']['userList'][number];

type PetitionListItem = PetitionListItemManage & PetitionListItemPublic

const props = defineProps({
  petition: {
    type: Object as PropType<PetitionListItem>,
    required: true
  },
  defaultImage: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  }
})

const styleClass = ref(props.class)
</script>

<template>
  <NuxtLink :to="`/${petition?.slug}`">
    <div :class="styleClass">
      <n-card :title="petition?.title" hoverable>
        <template #cover>
          <div
            :style="{
              backgroundImage: `url('${petition?.image?.url || defaultImage}')`
            }"
            class="w-full h-32 bg-cover bg-no-repeat bg-center"
          >
            <n-space class="p-2">
              <n-tag v-for="theme in petition?.petitionThemes" :key="theme.id" round>
                {{ theme.title }}
              </n-tag>
            </n-space>
          </div>
        </template>
        <n-space>
          <n-tag v-if="petition?.targetName" round>
            <template #icon>
              <NaiveIcon name="mdi:target" />
            </template>
            {{ petition.targetName }}
          </n-tag>
          <n-tag v-if="petition.location" round>
            <template #icon>
              <NaiveIcon name="mdi:map" />
            </template>
            <span v-if="petition.location.name">{{ petition.location.name }}</span>
            <span v-else>{{ petition.location.display_name }}</span>
          </n-tag>
        </n-space>
      </n-card>
    </div>
  </NuxtLink>
</template>
