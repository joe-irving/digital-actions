import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const petition = router({
  create: publicProcedure.input(z.object({
    title: z.string().max(200),
    content: z.string().max(1000),
    petitionCampaign: z.number().int(),
    image: z.optional(z.object({
      url: z.string().max(1000),
      name: z.string().max(100)
    })),
    creatorEmail: z.optional(z.string().regex(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i, {
      message: 'That is not an email in the creatorEmail field.'
    }).or(z.string().min(0).max(0)).or(z.null())),
    themes: z.array(z.number())
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
        themes: {
          select: {
            id: true
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
    // TODO add image to petition, include slug.
    const petition = await ctx.prisma.petition.create({
      data: {
        title: input.title,
        content: input.content,
        sharingInformation: {
          create: {
            whatsappShareText: '',
            shareTitle: input.title,
            tweet: '',
            description: '',
            shareImageId: imageId
          }
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
          : undefined
      }
    })
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
    const redirectUrl = `/petition/${petition.id}/manage?verify=${petition.verificationToken}`
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
  })
})
