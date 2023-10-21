<script setup lang="ts">
const { $client } = useNuxtApp()
const { signIn, signOut } = useAuth()

const { data: user } = $client.user.me.useQuery()
</script>

<template>
  <div>
    <div v-if="user?.authenticated" class="user-box">
      <div class="user">
        <n-avatar
          round
          size="small"
          :src="user?.user?.image || undefined"
        />
      </div>

      <n-button @click="() => signOut()">
        Log Out
      </n-button>
    </div>
    <div v-else class="sign-in-wrapper">
      <n-button @click="() => signIn()">
        Log In
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.user-box {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;

}
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
