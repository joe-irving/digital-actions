// import { SessionData } from '@sidebase/nuxt-auth/dist/runtime/composables/authjs/useAuthState'
import { getServerSession } from '#auth'

export default eventHandler(async (event) => {
  // const authBasePath = useRuntimeConfig().public.auth.computed.pathname
  // const session = await $fetch<SessionData>(authBasePath + '/session', {
  //   method: 'GET',
  //   headers: event.headers
  // })
  const session = await getServerSession(event)
  if (!session) {
    return { authenticated: false }
  } else {
    return { authenticated: true }
  }
})
