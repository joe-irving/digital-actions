import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const slugRouter = router({
  checkUnique: publicProcedure.input(z.object({
    slug: z.string()
  })).query(async ({ ctx, input }) => {
    // return if not logged in
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in to look for unique slugs.'
      })
    }
    const slug = await ctx.prisma.slug.findFirst({
      where: {
        slug: input.slug,
        active: true
      }
    })
    return !slug
  }),
  get: publicProcedure.input(z.object({
    slug: z.string()
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.slug.findFirst({
      where: {
        slug: input.slug
      },
      include: {
        petition: {
          select: {
            id: true
          }
        },
        petitionCampaign: {
          select: {
            id: true
          }
        }
      }
    })
  })
})
