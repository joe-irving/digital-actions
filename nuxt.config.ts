import { setAbsoluteSqliteDatabaseUrlForPrisma } from './prisma/utils'

setAbsoluteSqliteDatabaseUrlForPrisma()

export default defineNuxtConfig({
  auth: {
    globalAppMiddleware: true
  },
  build: {
    transpile: ['trpc-nuxt']
  },
  runtimeConfig: {
    version: '0.0.1',
    public: {
      githubClientId: '',
      googleClientId: ''
    },
    githubClientSecret: '',
    googleClientSecret: '',
    sendgridApiKey: '',
    authSecret: ''
  },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-svgo', '@huntersofbook/naive-ui-nuxt', '@sidebase/nuxt-auth'],
  extends: ['@sidebase/core'],
  typescript: {
    shim: false
  }
})
