import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'
import { getActionNetworkPetition } from '../utils/actionNetwork'

export const petitionCampaignActionNetwork = router({
  registerPetition: publicProcedure.input(z.object({
    campaignId: z.number().int(),
    endpoint: z.string()
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You have to be logged in to verify a petition endpoint'
      })
    }
    // Get petition campaign
    const petitionCampaign = await ctx.prisma.petitionCampaign.findFirst({
      where: {
        id: input.campaignId,
        permissions: {
          some: {
            userId: ctx.user.id,
            type: {
              in: ['owner', 'admin']
            }
          }
        }
      },
      select: {
        actionNetworkCredential: {
          select: {
            id: true,
            apiKey: true
          }
        }
      }
    })
    if (!petitionCampaign) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permissions to use action network api key to verify a petition for this petition campaign'
      })
    }
    if (!petitionCampaign.actionNetworkCredential?.apiKey) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'There is no API Key for this petition campaign'
      })
    }
    const anPetition = await getActionNetworkPetition({
      key: petitionCampaign.actionNetworkCredential.apiKey,
      endpoint: input.endpoint
    })
    if (!anPetition) {
      return null
    }
    // Get petition to see if in database
    const existingPetition = await ctx.prisma.verifiedActionNetworkPetition.findFirst({
      where: {
        endpoint: anPetition._links.self.href
      }
    })
    const data = {
      endpoint: anPetition._links.self.href,
      petitionCampaignId: input.campaignId,
      actionNetworkCredentialId: petitionCampaign.actionNetworkCredential.id,
      content: anPetition.petition_text,
      title: anPetition.title,
      target: anPetition.target[0].name,
      imageUrl: anPetition.featured_image_url
    }
    return await ctx.prisma.verifiedActionNetworkPetition.upsert({
      where: {
        id: existingPetition?.id || -1
      },
      update: data,
      create: data
    })
  })
})
