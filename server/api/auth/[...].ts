import GithubProvider from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import Mailgun from 'mailgun.js' // mailgun.js v11.1.0
import { NuxtAuthHandler } from '#auth'

const prisma = new PrismaClient()
const runtimeConfig = useRuntimeConfig()

const loginEmailText = () => {
  return `To continue to sign into ${runtimeConfig.siteName} click the button below or copy and paste the whole link into a browser.`
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
      clientSecret: runtimeConfig.githubClientSecret,
      allowDangerousEmailAccountLinking: true
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    Google.default({
      clientId: runtimeConfig.public.googleClientId,
      clientSecret: runtimeConfig.googleClientSecret,
      allowDangerousEmailAccountLinking: true
    }),
    {
      id: 'mailgun',
      type: 'email',
      allowDangerousEmailAccountLinking: true,
      async sendVerificationRequest ({ identifier: email, url }) {
        const mailgun = new Mailgun(FormData)
        const mg = mailgun.client({
          username: 'api',
          key: `${runtimeConfig.mailgunApiKey}`,
          url: 'https://api.eu.mailgun.net'
        })
        await mg.messages.create(`${runtimeConfig.mailgunDomain}`, {
          from: `${runtimeConfig.siteName} <${runtimeConfig.mailgunEmail}>`,
          to: [email],
          subject: `Sign in link for ${runtimeConfig.siteName}`,
          text: `${loginEmailText()}\n\n${url}`,
          html: makeHtmlEmail(url)
        })
      }
    }
  ]
})
