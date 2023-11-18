import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const styleThemeRouter = router({
  get: publicProcedure.input(z.number().int()).query(({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You have to be logged in to get a style theme'
      })
    }
    // TODO
    // Check permissions as read
    // Get style theme
    return input
  })
})
