import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const userRouter = router({
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
    }),
  updateSelf: publicProcedure.input(z.object({
    name: z.string().max(200).optional(),
    phone: z.string().optional(),
    country: z.string().max(2).optional(),
    postCode: z.string().max(10).optional()
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be signed in to modify the your account'
      })
    }
    return await ctx.prisma.user.update({
      where: {
        id: ctx.user.id
      },
      data: input,
      select: {
        id: true,
        created: true,
        updated: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        postCode: true
      }
    })
  })
})
