import { getServerSession } from '#auth'

export default eventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    return {}
  }
  return event.context.prisma.user.findMany()
})
