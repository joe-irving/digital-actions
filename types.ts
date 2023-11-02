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

export interface NominatimLocationInfo {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    county: string;
    'ISO3166-2-lvl6': string;
    state: string;
    'ISO3166-2-lvl4': string;
    country: string;
    country_code: string;
  };
  boundingbox: [string, string, string, string];
}

export interface DatabaseFile {
  id: number;
  url: string;
}

export interface CustomStyleTheme {
  name: string;
  backgroundColor: string | null;
  backgroundTextColor: string | null;
  backgroundHeaderColor: string | null;
  accentColor: string | null;
  accentTextColor: string | null;
  accentHeaderColor: string | null;
  headerFont: string | null;
  font: string | null;
  logo: DatabaseFile | null;
  logoSquare: DatabaseFile | null;
  icon: DatabaseFile | null;
}

interface sharingDescription {
  description: string
}
interface petitionTheme {
  id: number,
  title: string,
  icon: string
}

export interface PetitionListItem {
  id: number
  title: string,
  sharingInformation: sharingDescription,
  image: DatabaseFile | null,
  slug: string,
  petitionThemes: petitionTheme[]
}
