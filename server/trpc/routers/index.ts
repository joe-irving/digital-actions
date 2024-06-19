import { router } from '../trpc'
import { userRouter } from './user'
import { themesRouter } from './themesRouter'
import { targetList } from './targetList'
import { tweetCampaign } from './tweetCampaign'
import { tweetRouter } from './tweets'
import { petitionCampaignRouter } from './petitionCampaign'
import { petition } from './petition'
import { slugRouter } from './slug'
import { actionNetwork } from './actionNetwork'
import { styleThemeRouter } from './styleTheme'
import { petitionCampaignPermission } from './petitionCampaignPermission'
import { petitionPermission } from './petitionPermission'
import { petitionCampaignActionNetwork } from './petitionCampaignActionNetwork'
import { customFields } from './customFields'

export const appRouter = router({
  user: userRouter,
  tweetCampaign,
  targetList,
  tweetRouter,
  petitionCampaign: petitionCampaignRouter,
  petition,
  slug: slugRouter,
  actionNetwork,
  theme: themesRouter,
  styleTheme: styleThemeRouter,
  petitionCampaignPermission,
  petitionPermission,
  petitionCampaignActionNetwork,
  customFields
})

// export type definition of API
export type AppRouter = typeof appRouter
