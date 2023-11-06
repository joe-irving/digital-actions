import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'
import { createActionNetworkTags } from '../utils/actionNetwork'
import { PermissionLevel } from '~/types'

export const petitionCampaign = router({
  create: publicProcedure.input(z.object({
    title: z.string(),
    tagPrefix: z.string(),
    actionNetworkCredentialId: z.number().int()
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.authenticated || !ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in to make a petition campaign'
      })
    }
    // Get action network creds
    const anKeys = await ctx.prisma.actionNetworkCredential.findFirst({
      where: {
        id: input.actionNetworkCredentialId,
        ownerId: ctx.user.id
      }
    })
    if (!anKeys) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Could not find that action network credential linked to your account'
      })
    }
    const tags = {
      all: `[${input.tagPrefix}] All signatures`,
      response: `[${input.tagPrefix}] Auto Response`
    }
    const petitionCampaign = await ctx.prisma.petitionCampaign.create({
      data: {
        title: input.title,
        tagPrefix: input.tagPrefix,
        slugRelation: {
          create: {}
        },
        actionNetworkCredential: {
          connect: {
            id: anKeys.id
          }
        },
        actionNetworkAllTag: tags.all,
        actionNetworkResponseTag: tags.response
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

    createActionNetworkTags(anKeys.apiKey, tags.all)
    createActionNetworkTags(anKeys.apiKey, tags.response)
    return petitionCampaign
  }),
  getPublic: publicProcedure.input(z.object({
    id: z.number().int(),
    includeStyle: z.boolean().default(false)
  })).query(async ({ ctx, input }) => {
    const petitionCampaign = await ctx.prisma.petitionCampaign.findFirst({
      where: {
        id: input.id,
        OR: [
          {
            status: 'public'
          },
          {
            permissions: {
              some: {
                userId: ctx.user?.id || '0',
                type: {
                  in: ['owner', 'read', 'write']
                }
              }
            }
          }
        ]

      },
      select: {
        id: true,
        title: true,
        limitLocationCountry: true,
        themes: {
          select: {
            id: true,
            title: true,
            icon: true
          }
        },
        defaultPetitionImage: {
          select: {
            id: true,
            url: true
          }
        },
        styleTheme: input.includeStyle
          ? {
              select: {
                name: true,
                backgroundColor: true,
                backgroundTextColor: true,
                backgroundHeaderColor: true,
                accentColor: true,
                accentTextColor: true,
                accentHeaderColor: true,
                headerFont: true,
                font: true,
                logo: {
                  select: {
                    id: true,
                    url: true
                  }
                },
                logoSquare: {
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
            }
          : false
      }
    })
    return petitionCampaign
  }),
  getPublicList: publicProcedure.input(z.object({
    id: z.number().int()
  })).query(async ({ ctx, input }) => {
    // if petition campaign pubic & petition public & petition approved & has owner (i.e. has been user verified)
    return await ctx.prisma.petition.findMany({
      where: {
        petitionCampaign: {
          id: input.id,
          status: {
            equals: 'public'
          }
        },
        status: 'public',
        approved: true,
        permissions: {
          some: {
            type: 'owner'
          }
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: {
          select: {
            id: true,
            url: true
          }
        },
        sharingInformation: {
          select: {
            description: true
          }
        },
        petitionThemes: {
          select: {
            id: true,
            title: true,
            icon: true
          }
        }
      }
    })
  }),
  getManageList: publicProcedure.input(z.object({
    id: z.number().int()
  })).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in to list petitions on this page'
      })
    }
    return await ctx.prisma.petition.findMany({
      where: {
        petitionCampaign: {
          id: input.id,
          permissions: {
            some: {
              userId: ctx.user.id,
              type: {
                in: ['read', 'write', 'owner', 'approval']
              }
            }
          }
        }
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        approved: true,
        image: {
          select: {
            id: true,
            url: true
          }
        },
        petitionThemes: {
          select: {
            id: true,
            title: true,
            icon: true
          }
        }
      }
    })
  })
})
