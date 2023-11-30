import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const themesRouter = router({
  available: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You have to be logged in to view all public themes'
      })
    }
    return await ctx.prisma.theme.findMany({
      where: {
        status: 'public'
      }
    })
  })
})
