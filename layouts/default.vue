<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { h } from 'vue'
import { NuxtLink, NaiveIcon } from '#components'

const { $i18n } = useNuxtApp()

const createIcon = (icon: string) => {
  return () => h(NaiveIcon, { name: icon })
}

const createLabel = (label: string, path: string) => {
  return () => h(NuxtLink, { to: path }, { default: () => label })
}

const collapsed = ref(true)
const menuOptions = ref<MenuOption[]>([
  {
    key: 'home',
    label: createLabel($i18n.t('menu.home'), '/'),
    icon: createIcon('dashicons:admin-home')
  },
  {
    key: 'tweet-campaigns',
    label: createLabel($i18n.t('menu.tweet_campaign'), '/tweet'),
    icon: createIcon('cib:twitter')
  },
  {
    key: 'petitions',
    label: createLabel($i18n.t('menu.petitions'), '/petition'),
    icon: createIcon('mdi:clipboard-edit-outline')
  }
])
</script>

<template>
  <n-space vertical size="large">
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        class="h-screen"
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
          <ProfileBox :collapsed="collapsed" class="pb-2" />
        </n-space>
      </n-layout-sider>
      <n-layout class="h-screen" :native-scrollbar="false">
        <n-dialog-provider><slot /></n-dialog-provider>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<style>
.main-wrapper {
  height: 100vh;
  overflow-y: scroll;
  /* padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px; */
}
</style>
