import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const customFields = router({
  create: publicProcedure.input(z.object({
    petitionId: z.number().int(),
    name: z.string().regex(/^[a-z0-9_ -]{3,100}$/, 'Needs to be just numbers, lowercase letters, dashes, underscores or spaces. Max length 100 chars.'),
    label: z.string().max(1000),
    type: z.enum(['checkbox', 'radio', 'text']),
    required: z.boolean().optional()
  })).mutation(async ({ ctx, input }) => {
    // check if user
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in to create custom fields'
      })
    }
    // Check petition okay
    const petition = await ctx.prisma.petition.findFirst({
      where: {
        id: input.petitionId,
        petitionCampaign: {
          permissions: {
            some: {
              userId: ctx.user.id,
              type: {
                in: ['owner', 'admin', 'approval', 'write']
              }
            }
          }
        }
      },
      select: {
        customFields: true
      }
    })
    if (!petition) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permission to modify that petition, or it does not exist.'
      })
    }
    // get highest order
    let highestOrder: number
    if (petition.customFields.length > 0) {
      highestOrder = petition.customFields.map(f => f.order).reduce((a, b) => Math.max(a, b), -Infinity)
    } else {
      highestOrder = -1
    }
    // add custom field
    const newField = await ctx.prisma.customField.create({
      data: {
        petitionId: input.petitionId,
        name: input.name,
        label: input.label,
        type: input.type,
        order: highestOrder + 1
      },
      select: {
        id: true,
        name: true,
        required: true,
        label: true,
        type: true,
        order: true,
        options: {
          select: {
            id: true,
            name: true,
            label: true
          }
        }
      }
    })
    return newField
  }),
  update: publicProcedure.input(z.object({
    id: z.number().int(),
    name: z.string().regex(/^[a-z0-9_ -]{3,100}$/, 'Needs to be just numbers, lowercase letters, dashes, underscores or spaces. Max length 100 chars.').optional(),
    label: z.string().max(1000).optional(),
    required: z.boolean().optional(),
    order: z.number().optional()
  })).mutation(async ({ ctx, input }) => {
    // check if user
    if (!ctx.user?.id) {
      return new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in to create custom fields'
      })
    }
    // Check petition okay
    const petition = await ctx.prisma.petition.findFirst({
      where: {
        customFields: {
          some: {
            id: input.id
          }
        },
        petitionCampaign: {
          permissions: {
            some: {
              userId: ctx.user.id,
              type: {
                in: ['owner', 'admin', 'approval', 'write']
              }
            }
          }
        }
      }
    })
    if (!petition) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permission to modify that custom field, or it does not exist.'
      })
    }
    // add custom field
    return await ctx.prisma.customField.update({
      where: {
        id: input.id
      },
      data: {
        name: input.name,
        label: input.label,
        required: input.required,
        order: input.order
      }
    })
  }),
  delete: publicProcedure.input(z.object({
    id: z.number().int()
  })).mutation(async ({ ctx, input }) => {
    // check if user
    if (!ctx.user?.id) {
      return new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in to create custom fields'
      })
    }
    // Check petition okay
    const petition = await ctx.prisma.petition.findFirst({
      where: {
        customFields: {
          some: {
            id: input.id
          }
        },
        petitionCampaign: {
          permissions: {
            some: {
              userId: ctx.user.id,
              type: {
                in: ['owner', 'admin', 'approval', 'write']
              }
            }
          }
        }
      }
    })
    if (!petition) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permission to modify that custom field, or it does not exist.'
      })
    }
    // add custom field
    return await ctx.prisma.customField.delete({
      where: {
        id: input.id
      }
    })
  })
})
