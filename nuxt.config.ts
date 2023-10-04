import { setAbsoluteSqliteDatabaseUrlForPrisma } from './prisma/utils'

setAbsoluteSqliteDatabaseUrlForPrisma()

export default defineNuxtConfig({
  auth: {
    globalAppMiddleware: true
  },
  runtimeConfig: {
    version: '0.0.1',
    public: {
      githubClientId: ''
    },
    githubClientSecret: '',
    sendgridApiKey: ''
  },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-svgo', '@huntersofbook/naive-ui-nuxt', '@sidebase/nuxt-auth'],
  extends: ['@sidebase/core'],
  typescript: {
    shim: false
  }
})
