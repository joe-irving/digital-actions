<script setup lang="ts">
interface User {
    id: string;
    name: string;
    email: string;
    image: string | undefined;
}

defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  },
  collapsed: {
    type: Boolean,
    required: false,
    default: false
  },
  alignRight: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div
    class="flex justify-center gap-x-2"
    :class="{
      'flex-row-reverse': !alignRight
    }"
  >
    <n-space
      v-if="!collapsed"
      vertical
    >
      <Np
        class="font-bold"
        :class="{
          'text-right': alignRight
        }"
      >
        {{ user.name }}
      </Np>
      <Np
        class="text-xs"
        :class="{
          'text-right': alignRight
        }"
      >
        {{ user.email }}
      </Np>
    </n-space>
    <n-avatar
      round
      :src="user.image || undefined"
    />
  </div>
</template>
