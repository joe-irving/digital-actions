<script setup lang="ts">
const { signIn, signOut, status } = useAuth()
</script>

<template>
  <div>
    {{ status }}
    <button v-if="status === 'authenticated'" @click="signOut()">
      Log out
    </button>
    <button v-else @click="() => signIn()">
      Log in!
    </button>
  </div>
</template>
