import { decryptData } from '../routers/actionNetwork'

export const createActionNetworkTags = async (key: string, tag: string) => {
  const apiKey = decryptData(key)
  const newTag = await $fetch('https://actionnetwork.org/api/v2/tags', {
    method: 'POST',
    body: {
      name: tag
    },
    headers: {
      'OSDI-API-Token': apiKey
    }
  })
  return newTag
}
