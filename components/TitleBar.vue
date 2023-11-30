<script setup lang="ts">
const localePath = useLocalePath()
const { t, te } = useI18n()

interface BreadcrumbItem {
    link: string;
    title: string | null;
    icon: string | null | undefined;
}

defineProps({
  title: {
    type: String,
    default: 'menu.home'
  },
  subtitle: {
    type: String,
    default: ''
  },
  breadcrumbs: {
    type: Array<BreadcrumbItem>,
    default: [{
      link: '/',
      title: 'menu.home',
      icon: 'dashicons:admin-home'
    }]
  }
})
</script>

<template>
  <n-page-header>
    <slot />
    <template #title>
      {{ te(title) ? t(title) : title }}
    </template>
    <template #header>
      <n-breadcrumb>
        <n-breadcrumb-item v-for="item in breadcrumbs" :key="item.link">
          <NuxtLink :to="localePath(item.link)">
            <NaiveIcon v-if="item.icon" :name="item.icon" />
            <span v-if="item.title && item.title.length > 0">{{ te(item.title) ? t(item.title) : item.title }}</span>
          </NuxtLink>
        </n-breadcrumb-item>
      </n-breadcrumb>
    </template>
    <template #extra>
      <slot name="extra" />
    </template>
  </n-page-header>
</template>
