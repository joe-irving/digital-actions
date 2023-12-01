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

const options = ref([
  user.value?.authenticated ? { key: 'signOut', label: $i18n.t('profile.sign_out') } : { key: 'signIn', label: $i18n.t('profile.log_in') }
])

const handleProfileOptions = async (option: string) => {
  if (option === 'signOut') {
    await signOut()
  } else if (option === 'signIn') {
    await signIn(undefined)
  }
}
</script>

<template>
  <div>
    <div>
      <n-dropdown trigger="click" :options="options" @select="handleProfileOptions">
        <UserProfile :user="user?.user || undefined" :collapsed="collapsed" class="justify-center" />
      </n-dropdown>
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
