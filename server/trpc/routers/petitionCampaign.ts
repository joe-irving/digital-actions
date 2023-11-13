import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'
import { createActionNetworkTags, getTaggingCount } from '~/server/trpc/utils/actionNetwork'
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
    const anTag = await createActionNetworkTags(anKeys.apiKey, tags.all)
    createActionNetworkTags(anKeys.apiKey, tags.response)
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
        actionNetworkResponseTag: tags.response,
        actionNetworkTagId: anTag._links.self.href
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
        created: true,
        updated: true,
        title: true,
        content: true,
        slug: true,
        approved: true,
        status: true,
        targetName: true,
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
        },
        location: {
          select: {
            id: true,
            country: true,
            name: true,
            display_name: true
          }
        }
      }
    })
  }),
  getManage: publicProcedure.input(z.object({
    id: z.number().int()
  })).query(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You have to be logged in to manage petition campaigns'
      })
    }
    const campaign = await ctx.prisma.petitionCampaign.findFirst({
      where: {
        id: input.id,
        permissions: {
          some: {
            userId: ctx.user.id,
            type: {
              in: ['read', 'write', 'owner', 'approval']
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
        actionNetworkCredential: {
          select: {
            name: true
          }
        },
        tagPrefix: true,
        _count: {
          select: {
            petitions: true
          }
        },
        themes: {
          select: {
            id: true,
            title: true,
            icon: true
          }
        },
        status: true,
        defaultPetitionImage: {
          select: {
            id: true,
            url: true
          }
        },
        limitLocationCountry: true,
        slug: true,
        groupName: true,
        actionNetworkAllTag: true,
        actionNetworkResponseTag: true,
        sharingInformation: {
          select: {
            tweet: true,
            whatsappShareText: true,
            shareTitle: true,
            description: true,
            shareImage: {
              select: {
                id: true,
                url: true
              }
            }
          }
        }
      }
    })
    return campaign
  }),
  getSignatureStats: publicProcedure.input(z.object({
    id: z.number().int()
  })).query(async ({ ctx, input }) => {
    // get petition campaign
    const campaign = await ctx.prisma.petitionCampaign.findFirst({
      where: {
        id: input.id,
        OR: [
          {
            status: 'public'
          },
          {
            permissions: {
              some: {
                userId: ctx.user?.id || 'NEVER',
                type: {
                  in: ['read', 'write', 'owner', 'approval']
                }
              }
            }
          }
        ]
      },
      select: {
        actionNetworkTagId: true,
        actionNetworkCredential: {
          select: {
            apiKey: true
          }
        }
      }
    })
    if (!campaign) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Could not find a petition campaign that you have access to with that id'
      })
    }
    if (!campaign.actionNetworkCredential) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'No api key attached to this petition campaign'
      })
    }
    if (!campaign.actionNetworkTagId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'No action network tag attached to petition campaign'
      })
    }
    const tag = await getTaggingCount(campaign.actionNetworkCredential.apiKey, campaign.actionNetworkTagId)
    // return {
    //   count: tag?.total_records
    // }
    return tag
  }),
  getUserPermissions: publicProcedure.input(z.object({
    id: z.number().int()
  })).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in to get user permissions'
      })
    }
    return await ctx.prisma.petitionCampaignPermission.findMany({
      where: {
        userId: ctx.user.id,
        campaignId: input.id
      }
    })
  }),
  update: publicProcedure.input(z.object({
    id: z.number().int(),
    title: z.string().max(200).optional(),
    description: z.string().max(1000).optional(),
    themes: z.array(z.string()).optional(),
    groupName: z.string().max(200).optional(),
    image: z.object({
      url: z.string(),
      name: z.string()
    }).optional(),
    limitLocationCountry: z.string()
  })).query(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in to modify petition campaigns'
      })
    }
    // allowed?
    const permissions = await ctx.prisma.petitionCampaignPermission.findFirst({
      where: {
        userId: ctx.user.id,
        campaignId: input.id,
        type: {
          in: ['write', 'owner']
        }
      }
    })
    if (!permissions) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to update this petition campaign'
      })
    }
    const existingThemes = input.themes
      ? await ctx.prisma.theme.findMany({
        where: {
          title: {
            in: input.themes
          }
        }
      })
      : []
    const existingThemeNames = existingThemes.map(t => t.title)
    const newThemeNames = (input.themes || []).filter(t => !existingThemeNames.includes(t))
    const newThemes = await newThemeNames.map(async (name) => {
      const newTheme = await ctx.prisma.theme.create({
        data: {
          title: name
        }
      })
      return newTheme
    })
    const themeConnect = [...newThemes, ...existingThemes]
    const campaign = await ctx.prisma.petitionCampaign.update({
      where: {
        id: input.id
      },
      data: {
        title: input.title,
        description: input.description,
        themes: {
          connect: []
        }
      }
    })
    return campaign
  })
})
