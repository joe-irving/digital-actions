import { router } from '../trpc'
import { user } from './userRouter'
import { themesRouter } from './themesRouter'
import { targetList } from './targetList'
import { tweetCampaign } from './tweetCampaign'
import { tweetRouter } from './tweets'
import { petitionCampaign } from './petitionCampaign'
import { petition } from './petition'
import { slugRouter } from './slug'
import { actionNetwork } from './actionNetwork'
import { styleThemeRouter } from './styleTheme'

export const appRouter = router({
  user,
  tweetCampaign,
  targetList,
  tweetRouter,
  petitionCampaign,
  petition,
  slug: slugRouter,
  actionNetwork,
  theme: themesRouter,
  styleTheme: styleThemeRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
