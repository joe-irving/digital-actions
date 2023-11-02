<script setup lang="ts">
// import { darkTheme, LayoutContentInst } from 'naive-ui'
import { CustomStyleTheme } from '~/types'

defineProps({
  theme: {
    type: Object as PropType<CustomStyleTheme>,
    default: () => {
      return {
        name: ''
      }
    }
  }
})

const pageContent = ref<HTMLElement | null>(null)

const hasScrolled = ref(false)
const scrollDown = ref(false)
const lastYPosition = ref(0.0)

const handleScroll = () => {
  hasScrolled.value = true
}

const checkScrollStatus = () => {
  if (!pageContent.value || !hasScrolled.value) {
    return
  }
  hasScrolled.value = false
  const nextYPos = pageContent.value.getBoundingClientRect().y
  if (nextYPos < lastYPosition.value) {
    scrollDown.value = true
  } else {
    scrollDown.value = false
  }
  lastYPosition.value = nextYPos
}

const checkScroll = setInterval(checkScrollStatus, 100)

onUnmounted(() => {
  clearInterval(checkScroll)
})
</script>

<template>
  <n-config-provider>
    <n-space vertical size="large">
      <n-layout @scroll="console.log">
        <n-layout-header>
          <n-space
            :class="{
              '-translate-y-16': scrollDown
            }"
            class="p-2 shadow-md rounded-none fixed z-40 w-full h-16 transition-transform duration-400"
            justify="space-between"
          >
            <n-space>
              <NuxtLink to="/">
                <n-image v-if="theme.logo" :src="theme.logo?.url" width="64" height="64" />
                <n-h1 v-else>
                  {{ theme.name }}
                </n-h1>
              </NuxtLink>
            </n-space>
            <n-space>
              <slot name="menu" />
              <ProfileBox />
            </n-space>
          </n-space>
        </n-layout-header>
        <n-layout-content class="h-screen" :native-scrollbar="false" @scroll="handleScroll()">
          <div ref="pageContent" class="pt-16">
            <slot />
          </div>
        </n-layout-content>
      </n-layout>
    </n-space>
  </n-config-provider>
</template>
