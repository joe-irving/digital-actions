import { publicProcedure, router } from '../trpc'

export const user = router({
  me: publicProcedure
    .query(async ({ ctx }) => {
      // get session email
      // lookup user by email
      // return user or null
      // return await ctx.prisma.user.findMany()
      if (!ctx.session) {
        return {
          authenticated: false,
          user: null
        }
      }
      if (!ctx.session.user) {
        return {
          authenticated: true,
          user: null
        }
      }
      // const sessionEmail = ctx.session.email
      // return ctx.session.user.email
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: {
            equals: ctx.session.user.email
          }
        }
      })
      return {
        authenticated: true,
        user
      }
    })
})
