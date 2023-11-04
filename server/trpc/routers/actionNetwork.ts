import crypto from 'crypto'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

const algorithm = 'aes-256-cbc'

export const actionNetwork = router({
  registerKey: publicProcedure.input(z.object({
    name: z.string(),
    key: z.string()
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in to register action network keys'
      })
    }
    const config = useRuntimeConfig()
    // create secret,. create iv, creater syfer, store in database
    // console.log(cipher)
    // let encryptedData = cipher.update(input.key, 'utf-8', 'hex')
    // encryptedData += cipher.final('hex')
    // console.log('Encrypted key: ' + encryptedData)
    return input
  })
})
