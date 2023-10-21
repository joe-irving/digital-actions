<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { h } from 'vue'
import { NuxtLink, NaiveIcon } from '#components'

const createIcon = (icon: string) => {
  return () => h(NaiveIcon, { name: icon })
}

const createLabel = (label: string, path: string) => {
  return () => h(NuxtLink, { to: path }, { default: () => label })
}

const collapsed = ref(false)
const menuOptions = ref<MenuOption[]>([
  {
    key: 'home',
    label: createLabel('Home', '/'),
    icon: createIcon('dashicons:admin-home')
  },
  {
    key: 'tweet-campaigns',
    label: createLabel('Tweet Campaign', '/tweet'),
    icon: createIcon('cib:twitter')
  }
])
</script>

<template>
  <n-space vertical size="large">
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-space justify="space-between" vertical :style="{height: '100vh'}">
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
          />
          <div style="padding: 10px;">
            <ProfileBox />
          </div>
        </n-space>
      </n-layout-sider>
      <n-layout class="main-wrapper">
        <slot />
      </n-layout>
    </n-layout>
  </n-space>
</template>

<style>
.main-wrapper {
  height: 100vh;
  overflow-y: scroll;
}
</style>
