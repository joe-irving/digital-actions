import crypto from 'crypto'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'

const algorithm = 'aes-256-cbc'
const config = useRuntimeConfig()
const key = crypto
  .createHash('sha512')
  .update(config.apiKeySecret)
  .digest('hex')
  .substring(0, 32)
const encryptionIV = crypto
  .createHash('sha512')
  .update(config.apiKeyInitVector)
  .digest('hex')
  .substring(0, 16)

// Encrypt data
export function encryptData (data: string) {
  const cipher = crypto.createCipheriv(algorithm, key, encryptionIV)
  return Buffer.from(
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64') // Encrypts data and converts to hex and base64
}

// Decrypt data
export function decryptData (encryptedData: string) {
  const buff = Buffer.from(encryptedData, 'base64')
  const decipher = crypto.createDecipheriv(algorithm, key, encryptionIV)
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  ) // Decrypts data and converts to utf8
}

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
    const databaseCreds = await ctx.prisma.actionNetworkCredential.create({
      data: {
        name: input.name,
        apiKey: encryptData(input.key),
        ownerId: ctx.user.id
      }
    })
    return databaseCreds
  })
})
