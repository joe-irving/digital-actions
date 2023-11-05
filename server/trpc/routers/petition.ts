import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import sanitizeHtml from 'sanitize-html'
import { publicProcedure, router } from '../trpc'
import { createActionNetworkTags } from '../utils/actionNetwork'
import { LocationSchema } from './location'

const selectFieldAuthorised = {
  id: true,
  created: true,
  updated: true,
  title: true,
  slug: true,
  content: true,
  targetName: true,
  petitionCampaignId: true,
  sharingInformation: {
    select: {
      whatsappShareText: true,
      shareTitle: true,
      description: true,
      tweet: true,
      shareImage: {
        select: {
          id: true,
          url: true
        }
      }
    }
  },
  image: {
    select: {
      id: true,
      url: true
    }
  },
  approved: true,
  status: true,
  petitionThemes: {
    select: {
      id: true,
      title: true,
      icon: true
    }
  }
}

export const petition = router({
  create: publicProcedure.input(z.object({
    title: z.string().max(200),
    content: z.string().max(10000),
    petitionCampaign: z.number().int(),
    image: z.optional(z.object({
      url: z.string().max(1000),
      name: z.string().max(100)
    })),
    creatorEmail: z.optional(z.string().regex(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i, {
      message: 'That is not an email in the creatorEmail field.'
    }).or(z.string().min(0).max(0)).or(z.null())),
    themes: z.array(z.number().int()),
    location: z.optional(LocationSchema),
    target: z.string().max(100)
  })).mutation(async ({ input, ctx }) => {
    const creatorEmail = !input.creatorEmail || input.creatorEmail === '' ? ctx.user?.email : input.creatorEmail
    if (!creatorEmail) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'There is neither a creator email submitted or an email attached to the logged in user'
      })
    }
    // Check that petition campaign is public to this user
    const petitionCampaign = await ctx.prisma.petitionCampaign.findFirst({
      where: {
        status: 'public',
        id: input.petitionCampaign
      },
      select: {
        id: true,
        tagPrefix: true,
        themes: {
          select: {
            id: true
          }
        },
        actionNetworkCredential: {
          select: {
            apiKey: true
          }
        }
      }
    })
    if (!petitionCampaign) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'The given ID did not match up to a petition campaign that was public'
      })
    }

    // Filter themes to ones available in petition campaign
    const allowedThemes = petitionCampaign.themes.filter((theme) => {
      return input.themes.includes(theme.id)
    })
    // if image, create it
    const image = input.image
      ? await ctx.prisma.file.create({
        data: {
          name: input.image.name,
          url: input.image.url
        }
      })
      : undefined
    const imageId = image?.id

    // if  location create it
    const location = input.location
      ? await ctx.prisma.location.upsert({
        where: {
          place_id: input.location.place_id
        },
        create: {
          place_id: input.location.place_id,
          licence: input.location.licence,
          osm_type: input.location.osm_type,
          osm_id: input.location.osm_id,
          lat: input.location.lat,
          lon: input.location.lon,
          category: input.location.category,
          type: input.location.type,
          place_rank: input.location.place_rank,
          importance: input.location.importance,
          addresstype: input.location.addresstype,
          name: input.location.name,
          display_name: input.location.display_name,
          county: input.location.address.county,
          ISO3166_2_lvl6: input.location.address['ISO3166-2-lvl6'],
          state: input.location.address.state,
          ISO3166_2_lvl4: input.location.address['ISO3166-2-lvl4'],
          country: input.location.address.country
        },
        update: {
          place_id: input.location.place_id,
          licence: input.location.licence,
          osm_type: input.location.osm_type,
          osm_id: input.location.osm_id,
          lat: input.location.lat,
          lon: input.location.lon,
          category: input.location.category,
          type: input.location.type,
          place_rank: input.location.place_rank,
          importance: input.location.importance,
          addresstype: input.location.addresstype,
          name: input.location.name,
          display_name: input.location.display_name,
          county: input.location.address.county,
          ISO3166_2_lvl6: input.location.address['ISO3166-2-lvl6'],
          state: input.location.address.state,
          ISO3166_2_lvl4: input.location.address['ISO3166-2-lvl4'],
          country: input.location.address.country
        }
      })
      : undefined
    // TODO add image to petition, include slug.
    const petition = await ctx.prisma.petition.create({
      data: {
        title: input.title,
        content: sanitizeHtml(input.content),
        targetName: input.target,
        status: 'public',
        sharingInformation: {
          create: {
            whatsappShareText: '',
            shareTitle: input.title,
            tweet: '',
            description: '',
            shareImageId: imageId
          }
        },
        slugRelation: {
          create: {}
        },
        permissions: ctx.user
          ? {
              create: {
                type: 'owner',
                userId: ctx.user.id
              }
            }
          : undefined,
        creatorEmail,
        petitionThemes: {
          connect: allowedThemes
        },
        petitionCampaign: {
          connect: {
            id: petitionCampaign.id
          }
        },
        image: imageId
          ? {
              connect: {
                id: imageId
              }
            }
          : undefined,
        location: location
          ? {
              connect: {
                id: location.id
              }
            }
          : undefined
      }
    })
    // Create tag
    if (petitionCampaign && petitionCampaign?.actionNetworkCredential) {
      createActionNetworkTags(
        petitionCampaign.actionNetworkCredential?.apiKey,
      `[${petitionCampaign.tagPrefix}]: ${petition.id}`
      )
    }
    // Idk why this is needed, but the only way that adding an image was working
    const petitionWithImage = await ctx.prisma.petition.update({
      where: {
        id: petition.id
      },
      data: {
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true
      }
    })
    if (ctx.user) {
      return petitionWithImage
    }
    // If not logged in fetch token and perform sendgrid auth request
    const token = await $fetch.raw('/api/auth/csrf')
    const cookies = token.headers.getSetCookie()
    const redirectUrl = `/petition/${petition.id}?token=${petition.verificationToken}`
    const loginBody = {
      ...token._data,
      email: creatorEmail,
      callbackUrl: redirectUrl,
      json: true,
      redirect: false
    }
    $fetch.raw('/api/auth/signin/sendgrid', {
      method: 'POST',
      body: (new URLSearchParams(loginBody)).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
        Cookie: cookies.join('; ')
      }
    })
    return petitionWithImage
    // Create and link sharing information
  }),
  getManage: publicProcedure.input(z.object({
    id: z.number().int(),
    token: z.optional(z.string())
  })).query(async ({ ctx, input }) => {
    // if not logged in return
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You have to be logged in to get a petition on the manage page'
      })
    }
    const selectFields = {
      ...selectFieldAuthorised,
      permissions: {
        where: {
          userId: ctx.user.id
        }
      }
    }

    const petition = await ctx.prisma.petition.findFirst({
      where: {
        id: input.id,
        permissions: {
          some: {
            userId: ctx.user.id,
            type: {
              in: ['read', 'write', 'owner']
            }
          }
        }
      },
      select: selectFields
    })
    if (!petition && !input.token) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Could not find a petition with ID ${input.id} for user with email ${ctx.user.email}`
      })
    }
    if (petition) {
      // TODO replace with real data
      return { ...petition, signatures: 11323 }
    }
    // Otherwise attempt to verify & update permissions
    const verifiedPetition = await ctx.prisma.petition.findFirst({
      where: {
        id: input.id,
        verificationToken: input.token,
        creatorEmail: ctx.user.email
      },
      select: selectFields
    })
    if (!verifiedPetition) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'In order to verify the petition you need the id and verification token to match, and the creator to be the logged in user.'
      })
    }
    // Add owner permissions
    ctx.prisma.userPetitionPermissions.create({
      data: {
        type: 'owner',
        petitionId: verifiedPetition.id,
        userId: ctx.user.id
      }
    })
    return { ...verifiedPetition, signatures: 0 }
  }),
  update: publicProcedure.input(z.object({
    id: z.number().int(),
    title: z.optional(z.string().max(200)),
    content: z.optional(z.string().max(10000)),
    target: z.optional(z.string().max(200)),
    themes: z.optional(z.array(z.number().int()))
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be signed in to modify petitions'
      })
    }

    // Get userPetitionPermissions
    const petitionAllowed = await ctx.prisma.petition.findFirst({
      where: {
        id: input.id,
        permissions: {
          some: {
            userId: ctx.user.id,
            type: {
              in: ['write', 'owner']
            }
          }
        }
      },
      select: {
        id: true,
        petitionCampaign: {
          select: {
            themes: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })
    if (!petitionAllowed) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permission to edit this petition.'
      })
    }
    const allowedThemesLimit = petitionAllowed.petitionCampaign?.themes || []
    const allowedThemes = allowedThemesLimit.filter((theme) => {
      return input.themes?.includes(theme.id)
    })

    // Authorized and has appropriate permissions
    const petition = await ctx.prisma.petition.update({
      where: {
        id: input.id
      },
      data: {
        title: input.title,
        content: input.content ? sanitizeHtml(input.content) : undefined,
        targetName: input.target,
        petitionThemes: {
          connect: allowedThemes
        }
      },
      select: selectFieldAuthorised
    })

    // placeholder
    return petition
  }),
  getPublic: publicProcedure.input(z.object({
    id: z.number().int()
  })).query(async ({ ctx, input }) => {
    const petition = await ctx.prisma.petition.findFirst({
      where: {
        id: input.id,
        OR: [
          {
            permissions: {
              some: {
                userId: ctx.user?.id || 'NEVER',
                type: {
                  in: ['read', 'write', 'owner']
                }
              }
            }
          },
          {
            status: 'public',
            approved: true
          }
        ]
      },
      select: {
        id: true,
        title: true,
        content: true,
        sharingInformation: {
          select: {
            shareTitle: true,
            whatsappShareText: true,
            shareImage: {
              select: {
                id: true,
                url: true
              }
            },
            tweet: true,
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
        image: {
          select: {
            id: true,
            url: true
          }
        },
        slug: true,
        petitionCampaign: {
          select: {
            id: true,
            title: true,
            description: true,
            petitionEndpointURL: true,
            tagPrefix: true,
            styleTheme: true,
            groupName: true
          }
        }
      }
    })
    if (!petition) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Cannot find that petition'
      })
    }
    // TODO get signatures from cached action network endpoint
    return { ...petition, signatures: 12423 }
  })
})
