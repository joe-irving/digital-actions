import { router } from '../trpc'
import { user } from './userRouter'
import { targetList } from './targetList'
import { tweetCampaign } from './tweetCampaign'
import { tweetRouter } from './tweets'

export const appRouter = router({
  user,
  tweetCampaign,
  targetList,
  tweetRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
