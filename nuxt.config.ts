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
      googleClientId: '',
      defaultCountry: ''
    },
    githubClientSecret: '',
    googleClientSecret: '',
    sendgridApiKey: '',
    sendgridEmail: '',
    mailgunEmail: '',
    mailgunApiKey: '',
    mailgunDomain: '',
    authSecret: '',
    apiKeySecret: '',
    apiKeyInitVector: '',
    siteName: 'Digital Actions'
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
    url: process.env.NUXT_SITE_URL,
    name: process.env.NUXT_SITE_NAME,
    description: process.env.NUXT_SITE_DESCRIPTION,
    defaultLocale: process.env.NUXT_SITE_DEFAULT_LOCALE || 'en-GB',
    identity: {
      type: 'Organization'
    },
    twitter: process.env.NUXT_SITE_TWITTER,
    trailingSlash: true
  }
})
