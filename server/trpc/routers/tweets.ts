import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'
import { PermissionLevel } from '~/types'

// const authorizedRequest = publicProcedure.input(z.object({
//   campaignId: z.number().int()
// })).use((opts) => {
//   const { ctx, input } = opts
//   if (!ctx.user || ctx.authenticated) {
//     throw new TRPCError({
//       code: 'UNAUTHORIZED',
//       message: 'You need to be signed in to create tweets'
//     })
//   }
//   // Check if has correct permissions
//   const permissions = await ctx.prisma.tweetCampaignPermission.findFirst({
//     where: {
//       campaignId: input.campaignId,
//       userId: ctx.user.id,
//       type: {
//         in: [PermissionLevel.WRITE, PermissionLevel.OWNER].map(toString)
//       }
//     }
//   })
//   if (!permissions) {
//     throw new TRPCError({
//       code: 'UNAUTHORIZED',
//       message: 'You do not have permissions to add to that tweet campaign'
//     })
//   }
//   return opts.next()
// })

export const tweetRouter = router({
  create: publicProcedure.input(z.object({
    text: z.string(),
    campaignId: z.number().int()
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.user || ctx.authenticated) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be signed in to create tweets'
      })
    }
    // Check if has correct permissions
    const permissions = await ctx.prisma.tweetCampaignPermission.findFirst({
      where: {
        campaignId: input.campaignId,
        userId: ctx.user.id,
        type: {
          in: [PermissionLevel.WRITE, PermissionLevel.OWNER].map(toString)
        }
      }
    })
    if (!permissions) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permissions to add to that tweet campaign'
      })
    }
    // Okay to go!
    return await ctx.prisma.tweet.create({
      data: {
        text: input.text,
        campaignId: input.campaignId
      },
      select: {
        id: true,
        campaignId: true,
        text: true
      }
    })
  }),
  update: publicProcedure.input(z.object({
    id: z.number().int(),
    text: z.string()
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.user || ctx.authenticated) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be signed in to update tweets'
      })
    }
    const permissions = ctx.prisma.tweetCampaignPermission.findFirst({
      where: {
        campaign: {
          tweets: {
            some: {
              id: input.id
            }
          }
        },
        type: {
          in: [PermissionLevel.WRITE, PermissionLevel.OWNER]
        }
      }
    })
    if (!permissions) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permissions to edit this tweet'
      })
    }
    return await ctx.prisma.tweet.update({
      where: {
        id: input.id
      },
      data: {
        text: input.text
      },
      select: {
        id: true,
        created: true,
        updated: true,
        text: true,
        campaignId: true
      }
    })
  })
})
