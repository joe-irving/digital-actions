import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const petitionCampaignPermission = router({
  list: publicProcedure.input(z.object({
    id: z.number().int()
  })).query(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not logged in.'
      })
    }
    const campaign = await ctx.prisma.petitionCampaign.findFirst({
      where: {
        id: input.id,
        permissions: {
          some: {
            userId: ctx.user.id,
            type: {
              in: ['owner', 'admins']
            }
          }
        }
      },
      select: {
        permissions: {
          select: {
            id: true,
            created: true,
            updated: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            },
            campaignId: true,
            type: true
          }
        }
      }
    })
    if (!campaign) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Could not find a petition campaign with that id on your account'
      })
    }
    return campaign.permissions
  })
})
