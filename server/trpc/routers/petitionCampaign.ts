import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'
import { createActionNetworkPetition, createActionNetworkTags, getSignatureCount } from '~/server/trpc/utils/actionNetwork'
import { PermissionLevel } from '~/types'

export const petitionCampaignRouter = router({
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
      response: `[${input.tagPrefix}] Auto Response`,
      unsubscribe: `[${input.tagPrefix}] Do not subscribe`
    }
    const anTag = await createActionNetworkTags(anKeys.apiKey, tags.all)
    const anPetition = await createActionNetworkPetition({
      key: anKeys.apiKey,
      title: input.title,
      creatorEmail: ctx.user.email || undefined,
      target: input.title,
      description: input.title
    })
    await createActionNetworkTags(anKeys.apiKey, tags.response)
    await createActionNetworkTags(anKeys.apiKey, tags.unsubscribe)
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
        styleTheme: {
          create: {
            name: input.title,
            permissions: {
              create: {
                userId: ctx.user.id,
                type: PermissionLevel.OWNER.toString()
              }
            }
          }
        },
        actionNetworkAllTag: tags.all,
        actionNetworkResponseTag: tags.response,
        actionNetworkTagId: anTag._links.self.href,
        petitionEndpointURL: anPetition._links.self.href,
        permissions: {
          create: {
            userId: ctx.user.id,
            type: PermissionLevel.OWNER.toString()
          }
        }
      }
    })
    // Create the owner permissions
    // await ctx.prisma.petitionCampaignPermission.create({
    //   data: {
    //     userId: ctx.user.id,
    //     type: PermissionLevel.OWNER.toString(),
    //     campaignId: petitionCampaign.id
    //   }
    // })

    return petitionCampaign
  }),
  createTags: publicProcedure.input(z.number().int()).mutation(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You have to be logged in to manage petition campaigns'
      })
    }
    const campaign = await ctx.prisma.petitionCampaign.findFirst({
      where: {
        id: input,
        permissions: {
          some: {
            userId: ctx.user.id,
            type: {
              in: ['owner', 'admin']
            }
          }
        }
      }
    })
    if (!campaign) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permissions to manage this petition campaign'
      })
    }
    if (!campaign.actionNetworkCredentialId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No credential attached to this campaign'
      })
    }
    const anKeys = await ctx.prisma.actionNetworkCredential.findFirst({
      where: {
        id: campaign.actionNetworkCredentialId
      }
    })
    if (!anKeys) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not find the action network key linked to this campaign'
      })
    }
    const tags = [
      `[${campaign.tagPrefix}] All signatures`,
      `[${campaign.tagPrefix}] Auto Response`,
      `[${campaign.tagPrefix}] Do not subscribe`
    ]
    for (const tag of tags) {
      await createActionNetworkTags(anKeys.apiKey, tag)
    }
    return tags
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
                  in: ['owner', 'read', 'write', 'admin', 'approval']
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
        petitionContentTemplate: true,
        tagPrefix: true,
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
        styleThemeId: true,
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
    id: z.number().int(),
    filter: z.object({
      theme: z.array(z.number().int()).default([]),
      search: z.string().regex(/^[ a-zA-Z0-9-]*$/gm).optional()
    }).optional()
  })).query(async ({ ctx, input }) => {
    // if petition campaign pubic & petition public & petition approved & has owner (i.e. has been user verified)
    return await ctx.prisma.petition.findMany({
      where: {
        status: 'public',
        petitionCampaign: {
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
                    in: ['owner', 'read', 'write', 'admin', 'approval']
                  }
                }
              }
            }
          ]
        },
        petitionThemes: input.filter && input.filter.theme.length > 0
          ? {
              some: {
                id: {
                  in: input.filter.theme
                }
              }
            }
          : undefined,
        OR: input.filter && input.filter.search && input.filter.search.length > 1
          ? [
              {
                title: {
                  contains: input.filter.search,
                  mode: 'insensitive'
                }
              },
              {
                targetName: {
                  contains: input.filter.search,
                  mode: 'insensitive'
                }
              },
              {
                location: {
                  display_name: {
                    contains: input.filter.search
                  }
                }
              }
            ]
          : undefined
      },
      orderBy: [
        {
          signatureTotal: 'desc'
        }
      ],
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
        },
        targetName: true,
        location: {
          select: {
            name: true,
            country: true,
            display_name: true
          }
        },
        signatureTotal: true
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
                in: ['read', 'write', 'owner', 'approval', 'admin']
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
              in: ['read', 'write', 'owner', 'approval', 'admin']
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
        },
        styleThemeId: true,
        petitionContentTemplate: true
      }
    })
    if (!campaign) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permissions to manage this petition campaign'
      })
    }
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
                  in: ['read', 'write', 'owner', 'approval', 'admin']
                }
              }
            }
          }
        ]
      },
      select: {
        petitionEndpointURL: true,
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
    if (!campaign.petitionEndpointURL) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'No action network petition attached to petition campaign'
      })
    }
    const signatureCount = await getSignatureCount(campaign.actionNetworkCredential.apiKey, campaign.petitionEndpointURL)
    return {
      count: signatureCount?.total_records
    }
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
    // Can only get permissions of user that is logged in.
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
    themes: z.array(z.string().regex(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/gm, {
      message: 'Themes must only have letters, numbers and spaces'
    })).optional(), // Make sure themes are formatted okay with only chars, numbers and spaces
    groupName: z.string().max(200).optional(),
    image: z.object({
      url: z.string(),
      name: z.string()
    }).optional(),
    limitLocationCountry: z.array(z.string().min(2).max(2)).optional(),
    status: z.enum(['public', 'draft']).optional(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/gm, {
      message: 'That is not a valid slug format'
    }).optional(),
    petitionContentTemplate: z.optional(z.string().max(10000))
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in to modify petition campaigns'
      })
    }

    const oldCampaign = await ctx.prisma.petitionCampaign.findFirst({
      where: {
        permissions: {
          some: {
            userId: ctx.user.id,
            campaignId: input.id,
            type: {
              in: ['write', 'owner', 'admin']
            }
          }
        }
      },
      include: {
        themes: true,
        actionNetworkCredential: true
      }
    })
    if (!oldCampaign) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to update this petition campaign'
      })
    }
    const matchSlugs = await ctx.prisma.slug.findFirst({
      where: {
        slug: input.slug
      },
      include: {
        petitionCampaign: true
      }
    })
    if (matchSlugs && input.slug) {
      if (matchSlugs.petitionCampaign && matchSlugs.petitionCampaign.id === input.id) {
        input.slug = undefined
      } else if (matchSlugs.active) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'That slug already exists in the database'
        })
      }
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
    const newThemes = []
    for (const newTheme of newThemeNames) {
      newThemes.push(await ctx.prisma.theme.create({
        data: {
          title: newTheme,
          status: 'suggested'
        }
      }))
      // Add tag to action network here
    }
    const themeConnect = [...newThemes, ...existingThemes]
    for (const newlyConnectedTheme of themeConnect) {
      if (oldCampaign.actionNetworkCredential?.apiKey) {
        await createActionNetworkTags(oldCampaign.actionNetworkCredential?.apiKey, `[${oldCampaign.tagPrefix}] Theme - ${newlyConnectedTheme.title}`)
      }
    }

    // Sort out image
    const image = input.image
      ? await ctx.prisma.file.create({
        data: {
          url: input.image.url,
          name: input.image.name
        }
      })
      : undefined
    // Sort out slug
    let newSlug
    if (!matchSlugs && input.slug) {
      newSlug = await ctx.prisma.slug.create({
        data: {
          slug: input.slug,
          active: true,
          petitionCampaign: {
            connect: {
              id: input.id
            }
          }
        }
      })
      if (!newSlug) {
        input.slug = undefined
      }
    }
    const campaign = await ctx.prisma.petitionCampaign.update({
      where: {
        id: input.id
      },
      data: {
        title: input.title,
        description: input.description,
        groupName: input.groupName,
        themes: input.themes
          ? {
              disconnect: oldCampaign.themes.map(({ id }) => { return { id } }),
              connect: themeConnect.map(({ id }) => { return { id } })
            }
          : undefined,
        limitLocationCountry: input.limitLocationCountry ? input.limitLocationCountry.join(',') : undefined,
        defaultPetitionImageId: image ? image.id : undefined,
        status: input.status,
        slug: input.slug,
        petitionContentTemplate: input.petitionContentTemplate
      },
      select: {
        title: true,
        description: true,
        groupName: true,
        themes: true,
        limitLocationCountry: true,
        status: true,
        slug: true,
        petitionContentTemplate: true,
        defaultPetitionImage: {
          select: {
            url: true,
            id: true
          }
        }
      }
    })
    if (input.slug) {
      await ctx.prisma.slug.update({
        where: {
          slug: oldCampaign.slug
        },
        data: {
          active: false
        }
      })
      await ctx.prisma.slug.update({
        where: {
          slug: input.slug
        },
        data: {
          active: true
        }
      })
    }
    return campaign
  }),
  userCampaigns: publicProcedure.input(z.object({
    limitPermissions: z.array(z.enum(['read', 'write', 'admin', 'owner', 'approval'])).optional()
  }).optional()).query(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not logged in'
      })
    }
    return await ctx.prisma.petitionCampaign.findMany({
      where: {
        permissions: {
          some: {
            userId: ctx.user.id,
            type: {
              in: input?.limitPermissions || ['read', 'write', 'admin', 'owner', 'approval']
            }
          }
        }
      },
      select: {
        id: true,
        created: true,
        updated: true,
        title: true,
        status: true,
        slug: true,
        defaultPetitionImage: {
          select: {
            id: true,
            url: true
          }
        },
        _count: {
          select: {
            petitions: true,
            themes: true
          }
        }
      },
      orderBy: {
        updated: 'desc'
      }
    })
  })
})
