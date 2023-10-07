import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const tweetCampaign = router({
  all: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tweetCampaign.findMany({
      where: {
        ownerId: ctx.user?.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        targetList: true
      }
    })
  }),
  create: publicProcedure.input(z.object({
    title: z.string(),
    description: z.string(),
    targetListId: z.number().int()
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.authenticated || !ctx.session || !ctx.session?.user) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not logged in'
      })
    }
    if (!input.title) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Expected "title" to be included in request'
      })
    }
    const user = await ctx.prisma.user.findFirst({
      where: {
        email: {
          equals: ctx.session.user.email
        }
      }
    })
    if (!user) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not logged in'
      })
    }
    return await ctx.prisma.tweetCampaign.create({
      data: {
        title: input.title,
        description: input.description,
        ownerId: user.id,
        targetListId: input.targetListId
      },
      select: {
        id: true,
        title: true,
        description: true,
        targetList: true
      }
    })
  })
})
