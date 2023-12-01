import GithubProvider from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { NuxtAuthHandler } from '#auth'

const prisma = new PrismaClient()
const runtimeConfig = useRuntimeConfig()
const i18n = useI18n()
const { name: siteName } = useSiteConfig()

const loginEmailText = () => {
  return i18n.t('email_login_text', { site: siteName })
}

const makeHtmlEmail = (url: string) => {
  return `
  <p>${loginEmailText()}</p>
  <table align="center"><tr><td align="center"><div>
  <!--[if mso]>
  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://sendgrid" style="height:50px;v-text-anchor:middle;width:150px;" stroke="f" fillcolor="#4aae1e">
    <w:anchorlock/>
    <center>
  <![endif]-->
      <a href="${url}" target="_blank" style="background-color:#4aae1e;color:#ffffff;display:block;font-family:Helvetica,Arial,sans-serif;font-size:20px;line-height:50px;height:50px;text-align:center;font-weight:bold;text-decoration:none;width:150px;border-radius:5px;-webkit-text-size-adjust:none;">SIGN IN</a>
  <!--[if mso]>
    </center>
  </v:rect>
<![endif]-->
</div></td></tr></table>
<br />
<br />
<br />
${url}
  `
}

export default NuxtAuthHandler({
  adapter: PrismaAdapter(prisma),
  secret: runtimeConfig.authSecret,
  // pages: {
  //   signIn: '/login'
  // },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: runtimeConfig.public.githubClientId,
      clientSecret: runtimeConfig.githubClientSecret
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    Google.default({
      clientId: runtimeConfig.public.googleClientId,
      clientSecret: runtimeConfig.googleClientSecret
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
                value: `${loginEmailText()}\n\n${url}`
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
