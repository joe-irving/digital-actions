<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;

type PetitionListItemPublic = RouterOutput['petitionCampaign']['getPublicList'][number];
// type PetitionListItemManage = RouterOutput['petition']['userList'][number];

// type PetitionListItem = PetitionListItemManage & PetitionListItemPublic

const props = defineProps({
  petition: {
    type: Object as PropType<PetitionListItemPublic>,
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

const targetTotal = ref(useGetNextTarget(props.petition.signatureTotal))
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
        <div>
          <div class="flex justify-between pt-4">
            <div class="flex flex-col text-left">
              <span class="text-lg font-extrabold">{{ $n(petition.signatureTotal, 'decimalInt') }}</span>
              <span class="text-xs">{{ $t('petition.signatures') }}</span>
            </div>
            <div class="flex flex-col text-left text-right">
              <span class="text-lg font-extrabold">{{ $n(targetTotal, 'decimalInt') }}</span>
              <span class="text-xs">{{ $t('petition.target') }}</span>
            </div>
          </div>
          <n-progress
            type="line"
            :percentage="(petition.signatureTotal / targetTotal)*100"
            :border-radius="4"
            :height="15"
            :fill-border-radius="0"
            :show-indicator="false"
          />
        </div>
      </n-card>
    </div>
  </NuxtLink>
</template>
