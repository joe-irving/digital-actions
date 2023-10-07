import { router } from '../trpc'
import { user } from './userRouter'
import { tweetCampaign } from './tweetCampaign'

export const appRouter = router({
  user,
  tweetCampaign
})

// export type definition of API
export type AppRouter = typeof appRouter
