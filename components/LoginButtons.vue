<script setup lang="ts">
const { signIn, signOut, status } = useAuth()
</script>

<template>
  <div>
    <button v-if="status != 'authenticated'" @click="() => signIn()">
      Log in!
    </button>
    <button v-else @click="signOut()">
      Log out
    </button>
  </div>
</template>
