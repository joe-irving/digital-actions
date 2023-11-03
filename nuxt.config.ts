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
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-svgo',
    '@bg-dev/nuxt-naiveui',
    '@sidebase/nuxt-auth',
    '@nuxtjs/i18n',
    'nuxt3-leaflet',
    '@nuxtseo/module'
  ],
  extends: ['@sidebase/core'],
  typescript: {
    shim: false
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  },
  site: {
    url: 'https://act.defundclimatechaos.uk'
  }
})
