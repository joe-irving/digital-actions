import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { NuxtAuthHandler } from '#auth'

const prisma = new PrismaClient()
const runtimeConfig = useRuntimeConfig()

export default NuxtAuthHandler({
  adapter: PrismaAdapter(prisma),
  secret: runtimeConfig.authSecret,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: runtimeConfig.public.githubClientId,
      clientSecret: runtimeConfig.githubClientSecret
    }),
    {
      id: 'sendgrid',
      type: 'email',
      async sendVerificationRequest ({ identifier: email, url }) {
        // Call the cloud Email provider API for sending emails
        // See https://docs.sendgrid.com/api-reference/mail-send/mail-send
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          // The body format will vary depending on provider, please see their documentation
          // for further details.
          body: JSON.stringify({
            personalizations: [{ to: [{ email }] }],
            from: { email: 'joe@tippingpointuk.org' },
            subject: 'Sign in to Your page',
            content: [
              {
                type: 'text/plain',
                value: `Please click here to authenticate - ${url}`
              }
            ]
          }),
          headers: {
            // Authentication will also vary from provider to provider, please see their docs.
            Authorization: `Bearer ${runtimeConfig.sendgridApiKey}`,
            'Content-Type': 'application/json'
          },
          method: 'POST'
        })

        if (!response.ok) {
          const { errors } = await response.json()
          throw new Error(JSON.stringify(errors))
        }
      }
    }
  ]
})
