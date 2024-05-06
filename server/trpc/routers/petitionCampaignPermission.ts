import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'
import { sendLoginEmail } from '../utils/login'
import { permissionTypeList, permissionsSelect } from './permissions'

export const petitionCampaignPermission = router({
  me: publicProcedure.input(z.object({
    id: z.number().int()
  })).query(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in'
      })
    }
    return await ctx.prisma.petitionCampaignPermission.findMany({
      where: {
        campaignId: input.id,
        userId: ctx.user.id
      },
      select: permissionsSelect
    })
  }),
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
              in: ['owner', 'admin']
            }
          }
        }
      },
      select: {
        permissions: {
          select: permissionsSelect
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
  }),
  update: publicProcedure.input(z.object({
    id: z.number().int(),
    type: z.enum(['admin', 'read', 'write', 'approval'])
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not logged in for updating permissions'
      })
    }
    const neededTypesList = permissionTypeList.filter(definition => definition.type === input.type)
    if (!neededTypesList.length) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not find type definition'
      })
    }
    const neededTypes = neededTypesList[0].allowed
    const userPermission = await ctx.prisma.petitionCampaignPermission.findMany({
      where: {
        id: input.id,
        campaign: {
          permissions: {
            some: {
              userId: ctx.user.id,
              type: {
                in: neededTypes
              }
            }
          }
        }
      }
    })

    if (!userPermission.length) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `This user does not have permission to add type "${input.type}"`
      })
    }
    return await ctx.prisma.petitionCampaignPermission.update({
      where: {
        id: input.id
      },
      data: {
        type: input.type
      },
      select: permissionsSelect
    })
  }),
  delete: publicProcedure.input(z.number().int()).mutation(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not logged in for create permissions'
      })
    }
    // get permission
    const permission = await ctx.prisma.petitionCampaignPermission.findFirst({
      where: {
        id: input,
        campaign: {
          permissions: {
            some: {
              userId: ctx.user.id,
              type: {
                in: ['admin', 'owner']
              }
            }
          }
        }
      }
    })
    if (!permission) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Could not find a permission to delete that you have permission to delete with that id'
      })
    }
    // delete
    return await ctx.prisma.petitionCampaignPermission.delete({
      where: {
        id: input
      },
      select: permissionsSelect
    })
  }),
  add: publicProcedure.input(z.object({
    campaignId: z.number().int(),
    email: z.string().regex(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i, {
      message: 'That is not an email in the creatorEmail field.'
    }),
    type: z.enum(['admin', 'approval', 'read', 'write', ''])
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not logged in for create permissions'
      })
    }
    // Check if type acceptable for user to add
    const allowedTypes = permissionTypeList.filter(p => p.type === input.type)
    if (!allowedTypes.length) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not find record on that permission type'
      })
    }
    const allUserPermissions = await ctx.prisma.petitionCampaignPermission.findMany({
      where: {
        campaignId: input.campaignId,
        OR: [
          {
            userId: ctx.user.id
          },
          {
            user: {
              email: input.email
            }
          }
        ]

      }
    })
    const userPermissions = allUserPermissions.filter(p => p.userId === ctx.user?.id)
    const permissionExists = allUserPermissions.filter(p => p.userId !== ctx.user?.id)
    if (permissionExists.length) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cannot add permission that already exists'
      })
    }
    if (!userPermissions) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have any permissions for this petition campaign'
      })
    }
    const userPermissionTypes = userPermissions.map(p => p.type)
    const hasAllowedTypes = allowedTypes[0].allowed.filter(allowedType => userPermissionTypes.includes(allowedType))
    if (!hasAllowedTypes.length) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have the appropriate permission levels'
      })
    }
    // Lookup user with email
    let userId: string | undefined
    let userCreated = false
    const userToAdd = await ctx.prisma.user.findFirst({
      where: {
        email: input.email
      }
    })
    userId = userToAdd?.id
    if (!userId) {
      const newUser = await ctx.prisma.user.create({
        data: {
          email: input.email
        }
      })
      if (!newUser) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Issue creating a new user for ${input.email}`
        })
      }
      userCreated = true
      userId = newUser?.id
    }
    // Create permission
    const newPermission = await ctx.prisma.petitionCampaignPermission.create({
      data: {
        userId,
        campaignId: input.campaignId,
        type: input.type
      },
      select: permissionsSelect
    })
    if (userCreated) {
      await sendLoginEmail(input.email, `/petition/campaign/${input.campaignId}`)
    }
    return newPermission
  })
})
