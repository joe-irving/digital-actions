import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const styleThemeRouter = router({
  get: publicProcedure.input(z.number().int()).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You have to be logged in to get a style theme'
      })
    }
    // TODO
    // Check permissions as read
    // Get style theme
    return await ctx.prisma.styleTheme.findFirst({
      where: {
        id: input,
        permissions: {
          some: {
            userId: ctx.user.id,
            type: {
              in: ['read', 'write', 'owner']
            }
          }
        }
      },
      select: {
        id: true,
        created: true,
        updated: true,
        name: true,
        backgroundColor: true,
        backgroundTextColor: true,
        logo: {
          select: {
            id: true,
            url: true
          }
        },
        icon: {
          select: {
            id: true,
            url: true
          }
        }
      }
    })
  }),
  update: publicProcedure.input(z.object({
    id: z.number().int(),
    name: z.string().optional(),
    backgroundColor: z.string().optional(),
    backgroundTextColor: z.string().optional(),
    logo: z.object({
      name: z.string(),
      url: z.string()
    }).optional(),
    icon: z.object({
      name: z.string(),
      url: z.string()
    }).optional()
  })).mutation(({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You have to be logged in to update a style theme'
      })
    }
    return input
  })
})
