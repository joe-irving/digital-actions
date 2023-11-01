import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'
import { PermissionLevel } from '~/types'

export const petitionCampaign = router({
  create: publicProcedure.input(z.object({
    title: z.string(),
    tagPrefix: z.string()
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.authenticated || !ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in to make a petition campaign'
      })
    }
    // Create the petition campaign
    const petitionCampaign = await ctx.prisma.petitionCampaign.create({
      data: {
        title: input.title,
        tagPrefix: input.tagPrefix
      }
    })
    // Create the owner permissions
    await ctx.prisma.petitionCampaignPermission.create({
      data: {
        userId: ctx.user.id,
        type: PermissionLevel.OWNER.toString(),
        campaignId: petitionCampaign.id
      }
    })
    return petitionCampaign
  }),
  getPublic: publicProcedure.input(z.number().int()).query(({ ctx, input }) => {
    return ctx.prisma.petitionCampaign.findFirst({
      where: {
        id: input,
        status: 'public'
      },
      select: {
        id: true,
        title: true,
        themes: {
          select: {
            id: true,
            title: true,
            description: true,
            icon: true
          }
        }
      }
    })
  })
})
