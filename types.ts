export enum PermissionLevel {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  PUBLISH = 'publish',
  OWNER = 'owner'
}

export interface TweetCampaignSummary {
  id: number;
  title: string;
  description: string;
  tweetCount: number;
  targetListName: string;
  userPermissionLevel: string[];
  createdDate: string;
  updatedDate: string;
}
