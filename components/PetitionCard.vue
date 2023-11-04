<script setup lang="ts">
import { PetitionListItem } from '~/types'

defineProps({
  petition: {
    type: Object as PropType<PetitionListItem | null>,
    default: null
  },
  defaultImage: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <NuxtLink class="max-w-[250px]" :to="`/${petition?.slug}`">
    <n-card :title="petition?.title" hoverable class="landscape">
      <template #cover>
        <div
          :style="{
            backgroundImage: `url('${petition?.image?.url || defaultImage}')`
          }"
          class="w-full h-32 bg-cover bg-no-repeat bg-center"
        />
      </template>
      <n-space>
        <n-tag v-for="theme in petition?.petitionThemes" :key="theme.id">
          {{ theme.title }}
        </n-tag>
      </n-space>
      {{ petition?.sharingInformation.description }}
    </n-card>
  </NuxtLink>
</template>

<style>
.n-card.landscape {
    display: grid;
    grid-template-columns: 100px 1fr;
    grid-template-rows: 1fr 1fr;

}
.n-card.landscape > .n-card-cover {
    grid-column: 1 / span 1;
    grid-row: 1 / span 2;
    border-radius: var(--n-border-radius) 0 0 var(--n-border-radius);
}
.n-card.landscape > .n-card-header {
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;
}
.n-card.landscape > .n-card__content {
    grid-column: 2 / span 1;
    grid-row: 2 / span 1;
}
</style>
