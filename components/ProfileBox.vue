<script setup lang="ts">
const { $client, $i18n } = useNuxtApp()
const { signIn, signOut } = useAuth()

defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const { data: user } = $client.user.me.useQuery()

const handleProfileOptions = async (option: string) => {
  if (option === 'signOut') {
    await signOut()
  }
}
</script>

<template>
  <div>
    <div v-if="user?.authenticated">
      <n-dropdown trigger="click" :options="[{key: 'signOut', label: $i18n.t('profile.sign_out')}]" @select="handleProfileOptions">
        <UserProfile v-if="user?.user" :user="user.user" :collapsed="collapsed" class="justify-center" />
      </n-dropdown>
    </div>
    <div v-else class="sign-in-wrapper">
      <n-button @click="() => signIn(undefined)">
        {{ $t('profile.log_in') }}
      </n-button>
    </div>
  </div>
</template>

<style scoped>
/* .user-box {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;

} */
.user {
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.sign-in-wrapper{
    display: flex;
    justify-content: center;
}
</style>
