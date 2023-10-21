import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

enum PermissionLevel {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  PUBLISH = 'publish',
  OWNER = 'owner'
}

// const createTweetCampaignPermissions = (prisma, campaignId: number, userId: string, permissions: PermissionLevel[]) => {

// }

export const tweetCampaign = router({
  userCampaigns: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.authenticated || !ctx.session || !ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not logged in, cannot load tweet campaigns'
      })
    }
    const campaignList = await ctx.prisma.tweetCampaign.findMany({
      where: {
        tweetCampaignPermissions: {
          some: {
            type: {
              in: [PermissionLevel.OWNER, PermissionLevel.READ, PermissionLevel.WRITE]
            },
            user: {
              id: ctx.user?.id
            }
          }
        }
      },
      select: {
        id: true,
        created: true,
        updated: true,
        title: true,
        description: true,
        targetList: {
          select: {
            id: true,
            created: true,
            updated: true,
            name: true,
            isPublic: true
          }
        },
        _count: { select: { tweets: true } },
        tweetCampaignPermissions: {
          select: {
            user: {
              select: {
                id: true,
                name: true
              }
            },
            type: true
          },
          where: {
            userId: ctx.user?.id
          }
        }
      }
    })
    return campaignList
  }),
  getPublic: publicProcedure.input(z.object({
    id: z.number().int().nullable().default(null),
    slug: z.string().nullable().default(null)
  })).query(async ({ input, ctx }) => {
    let where = {}
    if (input.slug) {
      where = {
        slug: input.slug
      }
    } else if (input.id) {
      where = {
        id: input.id
      }
    } else {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Either id or slug need to be specified'
      })
    }
    const campaign = await ctx.prisma.tweetCampaign.findFirst({
      where
    })
    if (campaign?.published) {
      return campaign
    } else {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'This campaign is not public yet'
      })
    }
    // if not public check permissions
  }),
  create: publicProcedure.input(z.object({
    title: z.string(),
    description: z.string(),
    targetListId: z.number().int(),
    slug: z.string()
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
    const targetList = await ctx.prisma.targetList.findFirst({
      where: {
        id: input.targetListId,
        OR: [
          {
            permissions: {
              some: {
                userId: ctx.user?.id,
                type: {
                  in: ['read', 'write', 'owner']
                }
              }
            }
          },
          {
            isPublic: true
          }
        ]
      }
    })
    if (!targetList) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to add that target list'
      })
    }
    const newTweetCampaign = await ctx.prisma.tweetCampaign.create({
      data: {
        title: input.title,
        description: input.description,
        targetListId: input.targetListId,
        slug: input.slug
      },
      select: {
        id: true,
        title: true,
        description: true,
        targetList: true,
        created: true,
        updated: true
      }
    })
    // Create permissions for owner
    await ctx.prisma.tweetCampaignPermission.create({
      data: {
        userId: user.id,
        campaignId: newTweetCampaign.id,
        type: PermissionLevel.OWNER
      }
    })
    return newTweetCampaign
  }),
  update: publicProcedure.input(z.object({
    id: z.number().int(),
    title: z.string().nullable().default(null),
    description: z.string().nullable().default(null),
    slug: z.string().nullable().default(null)
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.authenticated || !ctx.session || !ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not logged in'
      })
    }
    //
    const permissions = await ctx.prisma.tweetCampaignPermission.findMany({
      where: {
        userId: ctx.user?.id,
        campaignId: input.id
      }
    })
    const hasPermission = permissions.map((permission) => {
      return [PermissionLevel.OWNER.toString(), PermissionLevel.WRITE.toString()].includes(permission.type)
    })
    if (permissions.length === 0 || !hasPermission.includes(true)) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permissions to edit this tweet campaign'
      })
    }
    // If it got this far they have permissions to edit
    return await ctx.prisma.tweetCampaign.update({
      where: {
        id: input.id
      },
      data: {
        title: input.title || undefined,
        description: input.description || undefined,
        slug: input.slug || undefined
      }
    })
  })
})
