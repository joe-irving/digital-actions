import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

const selectFields = {
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
        OR: [
          {
            permissions: {
              some: {
                userId: ctx.user.id,
                type: {
                  in: ['read', 'write', 'owner']
                }
              }
            }
          },
          {
            petitionCampaign: {
              some: {
                permissions: {
                  some: {
                    userId: ctx.user.id,
                    type: {
                      in: ['read', 'write', 'admin', 'owner']
                    }
                  }
                }
              }
            }
          }
        ]
      },
      select: selectFields
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
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You have to be logged in to update a style theme'
      })
    }
    // Check style theme permissions
    const theme = await ctx.prisma.styleTheme.findFirst({
      where: {
        id: input.id,
        OR: [
          {
            permissions: {
              some: {
                userId: ctx.user.id,
                type: {
                  in: ['read', 'write', 'owner']
                }
              }
            }
          },
          {
            petitionCampaign: {
              some: {
                permissions: {
                  some: {
                    userId: ctx.user.id,
                    type: {
                      in: ['read', 'write', 'admin', 'owner']
                    }
                  }
                }
              }
            }
          }
        ]
      }
    })
    if (!theme) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to update this theme'
      })
    }
    // Add image record
    let logoId: number | undefined
    if (input.logo) {
      const logoFile = await ctx.prisma.file.create({
        data: {
          url: input.logo.url,
          name: input.logo.name
        }
      })
      logoId = logoFile.id
    }
    let iconId: number | undefined
    if (input.icon) {
      const iconFile = await ctx.prisma.file.create({
        data: {
          url: input.icon.url,
          name: input.icon.name
        }
      })
      iconId = iconFile.id
    }
    // Update
    return await ctx.prisma.styleTheme.update({
      where: {
        id: input.id
      },
      data: {
        name: input.name,
        backgroundColor: input.backgroundColor,
        backgroundTextColor: input.backgroundTextColor,
        logoId,
        iconId
      },
      select: selectFields
    })
  })
})
