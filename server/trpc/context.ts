import { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

let prisma: PrismaClient

/** * Creates context for an incoming request * @link https://trpc.io/docs/context */
export const createContext = async (event: H3Event) => {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  // const prisma = new PrismaClient(event)
  const session = await getServerSession(event)
  const authenticated = !!session?.user
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: session?.user?.email
      }
    }
  })
  return { prisma, session, authenticated, user }
}

export type Context = inferAsyncReturnType<typeof createContext>;
