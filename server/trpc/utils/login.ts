export const sendLoginEmail = async (email: string, callbackUrl: string) => {
  const token = await $fetch.raw('/api/auth/csrf')
  const cookies = token.headers.getSetCookie()
  const loginBody = {
    ...token._data,
    email,
    callbackUrl,
    json: true,
    redirect: false
  }
  return await $fetch.raw('/api/auth/signin/sendgrid', {
    method: 'POST',
    body: (new URLSearchParams(loginBody)).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: '*/*',
      Cookie: cookies.join('; ')
    }
  })
}
