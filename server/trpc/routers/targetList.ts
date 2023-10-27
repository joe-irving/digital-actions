import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'
import { PermissionLevel } from '~/types'

export const targetList = router({
  create: publicProcedure.input(z.object({
    name: z.string(),
    isPublic: z.boolean().default(false)
  })).mutation(async ({ input, ctx }) => {
    // is user authenticated
    if (!ctx.authenticated || !ctx.session || !ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not logged in, cannot create target lists'
      })
    }
    // create
    const targetList = await ctx.prisma.targetList.create({
      data: {
        name: input.name,
        isPublic: input.isPublic
      },
      select: {
        id: true,
        created: true,
        updated: true,
        name: true,
        isPublic: true
      }
    })
    // add owner permissions
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'No user associated with request'
      })
    }
    await ctx.prisma.targetListPermission.create({
      data: {
        userId: ctx.user.id,
        type: PermissionLevel.OWNER,
        targetListId: targetList.id
      }
    })
    return targetList
  }),
  update: publicProcedure.input(z.object({
    id: z.number().int(),
    name: z.string().nullable().default(null),
    isPublic: z.boolean().nullable().default(null)
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.authenticated || !ctx.session || !ctx.session?.user || !ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not logged in, cannot modify target lists'
      })
    }
    // get permissions
    const permissions = ctx.prisma.targetListPermission.findFirst({
      where: {
        userId: ctx.user.id,
        targetListId: input.id,
        type: {
          in: [PermissionLevel.OWNER, PermissionLevel.WRITE].map(toString)
        }
      }
    })
    if (!permissions) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permissions to edit this tweet campaign'
      })
    }
    // Go this far, is logged in and has correct permissions
    return await ctx.prisma.targetList.update({
      where: {
        id: input.id
      },
      data: {
        name: input.name || undefined,
        isPublic: input.isPublic || undefined
      },
      select: {
        id: true,
        name: true,
        isPublic: true
      }
    })
  }),
  listPublic: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.targetList.findMany({
      where: {
        isPublic: {
          equals: true
        }
      }
    })
  }),
  listUserTargets: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id || 'none'
    return await ctx.prisma.targetList.findMany({
      where: {
        OR: [
          {
            permissions: {
              some: {
                type: {
                  in: ['owner', 'write', 'read']
                },
                userId
              }
            }
          },
          {
            isPublic: {
              equals: true
            }
          }
        ]
      }
    })
  })
})
