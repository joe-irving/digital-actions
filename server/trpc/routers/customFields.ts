import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const customFields = router({
  create: publicProcedure.input(z.object({
    petitionId: z.number().int(),
    name: z.string().regex(/^[a-z0-9_ -]{3,100}$/, 'Needs to be just numbers, lowercase letters, dashes, underscores or spaces. Max length 100 chars.'),
    label: z.string().max(1000),
    type: z.enum(['checkbox']),
    required: z.boolean().optional()
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
      }
    })
    if (!petition) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permission to modify that petition, or it does not exist.'
      })
    }
    // add custom field
    return await ctx.prisma.customField.create({
      data: {
        petitionId: input.petitionId,
        name: input.name,
        label: input.label,
        type: input.type
      }
    })
  }),
  update: publicProcedure.input(z.object({
    id: z.number().int(),
    name: z.string().regex(/^[a-z0-9_ -]{3,100}$/, 'Needs to be just numbers, lowercase letters, dashes, underscores or spaces. Max length 100 chars.'),
    label: z.string().max(1000),
    type: z.enum(['checkbox']),
    required: z.boolean().optional()
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
        type: input.type
      }
    })
  })
})
