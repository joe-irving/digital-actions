import { decryptData } from '../routers/actionNetwork'

export interface ActionNetworkTag {
  identifiers: string[];
  created_date: string;
  modified_date: string;
  name: string;
  _links: {
    self: { href: string };
    'osdi:taggings': { href: string };
    curies: { name: string; href: string; templated: boolean }[];
  };
}

interface Target {
  name: string;
}

interface EmailAddress {
  primary: boolean;
  address: string;
  status: string;
}

interface PhoneNumber {
  primary: boolean;
  number: string;
  number_type: string;
  status: string;
}

interface PostalAddress {
  primary: boolean;
  address_lines: string[];
  locality: string;
  region: string;
  postal_code: string;
  country: string;
  language: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: string;
  };
}

interface OSDICreator {
  given_name: string;
  family_name: string;
  identifiers: string[];
  origin_system: string;
  created_date: string;
  modified_date: string;
  email_addresses: EmailAddress[];
  phone_numbers: PhoneNumber[];
  postal_addresses: PostalAddress[];
  languages_spoken: string[];
  _links: {
    self: { href: string };
    'osdi:attendances': { href: string };
    'osdi:signatures': { href: string };
    'osdi:submissions': { href: string };
    'osdi:donations': { href: string };
    'osdi:outreaches': { href: string };
    'osdi:taggings': { href: string };
    curies: { name: string; href: string; templated: boolean }[];
  };
}

export interface ActionNetworkPetition {
  identifiers: string[];
  origin_system: string;
  created_date: string;
  modified_date: string;
  title: string;
  description: string;
  petition_text: string;
  browser_url: string;
  featured_image_url: string;
  total_signatures: number;
  target: Target[];
  'action_network:hidden': boolean;
  _embedded: { 'osdi:creator': OSDICreator };
  _links: {
    self: { href: string };
    'osdi:signatures': { href: string };
    'osdi:record_signature_helper': { href: string };
    'osdi:creator': { href: string };
    'action_network:embed': { href: string };
    curies: { name: string; href: string; templated: boolean }[];
  };
}

interface SignatureLink {
  href: string;
}

interface Curies {
  name: string;
  href: string;
  templated: boolean;
}

interface Signature {
  identifiers: string[];
  created_date: string;
  modified_date: string;
  comments?: string;
  'action_network:person_id': string;
  'action_network:petition_id': string;
  _links: {
    self: SignatureLink;
    'osdi:petition': SignatureLink;
    'osdi:person': SignatureLink;
  };
}

interface EmbeddedSignatures {
  'osdi:signatures': Signature[];
}

interface Links {
  self: SignatureLink;
  'osdi:signatures': SignatureLink[];
  curies: Curies[];
}

export interface ActionNetworkSignaturesApiResponse {
  total_pages: number;
  per_page: number;
  page: number;
  total_records: number;
  _links: Links;
  _embedded: EmbeddedSignatures;
}

interface Link {
  href: string;
}

interface Curie {
  name: string;
  href: string;
  templated: boolean;
}

interface TaggingLink {
  href: string;
}

interface Tagging {
  _links: {
    self: Link;
    'osdi:tag': Link;
    'osdi:person': Link;
  };
  identifiers: string[];
  created_date: string; // You may want to use a Date type if you parse the timestamp
  modified_date: string; // You may want to use a Date type if you parse the timestamp
  item_type: string;
}

export interface ActionNetworkTaggingsApiResponse {
  _links: {
    next: Link;
    self: Link;
    'osdi:taggings': TaggingLink[];
    curies: Curie[];
  };
  _embedded: {
    'osdi:taggings': Tagging[];
  };
  total_pages: number;
  per_page: number;
  page: number;
  total_records: number;
}

export const createActionNetworkTags = async (key: string, tag: string) => {
  const apiKey = decryptData(key)
  const newTag = await $fetch<ActionNetworkTag>('https://actionnetwork.org/api/v2/tags', {
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

export const getQueryCount = cachedFunction(async (key: string, queryId: string) => {
  const apiKey = decryptData(key)
  const query = await $fetch('https://actionnetwork.org/api/v2/queries/' + queryId, {
    headers: {
      'OSDI-API-Token': apiKey
    }
  })
  return query
}, {
  maxAge: 60 * 60,
  name: 'getActionNetworkQueryCount',
  getKey: (queryId: string) => {
    return queryId
  }
})

export const createActionNetworkPetition = async ({
  key,
  title,
  target,
  description,
  creatorEmail
}: {
  key: string,
  title: string,
  target: string,
  description: string | undefined,
  creatorEmail: string | undefined
}) => {
  const apiKey = decryptData(key)
  const { siteName } = useRuntimeConfig()
  if (!siteName.length) {
    throw new Error('The site title must not be an empty string or creating an action network petition will fail')
  }
  const body = {
    title,
    origin_system: siteName, // Cannot be an empty string
    target: [
      {
        name: target
      }
    ],
    description,
    'osdi:creator': creatorEmail
      ? {
          email_addresses: [
            {
              address: creatorEmail
            }
          ]
        }
      : undefined
  }
  const headers = {
    'OSDI-API-Token': apiKey,
    'Content-Type': 'application/json'
  }
  const query = await $fetch<ActionNetworkPetition>('https://actionnetwork.org/api/v2/petitions', {
    method: 'POST',
    headers,
    body
  })
  return query
}

export const getSignatureCount = cachedFunction(async (key: string, actionNetworkId: string) => {
  // get key
  const apiKey = decryptData(key)
  const ids = actionNetworkId.match(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/)
  if (!ids?.length) {
    return null
  }
  // make request
  const signatures = await $fetch<ActionNetworkSignaturesApiResponse>(`https://actionnetwork.org/api/v2/petitions/${ids[0]}/signatures`, {
    headers: {
      'OSDI-API-Token': apiKey
    }
  })
  // return
  return signatures
}, {
  maxAge: 60 * 60 * 10,
  name: 'getActionNetworkSignatureCount',
  getKey: (_key: string, actionNetworkId: string) => {
    const ids = actionNetworkId.match(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/)
    if (!ids?.length) {
      return actionNetworkId
    }
    return ids[0]
  }
})

export const getTaggingCount = cachedFunction(async (key: string, id: string) => {
  const apiKey = decryptData(key)
  const ids = id.match(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/)
  if (!ids?.length) {
    return null
  }
  const tag = await $fetch<ActionNetworkTaggingsApiResponse>(`https://actionnetwork.org/api/v2/tags/${ids[0]}/taggings`, {
    headers: {
      'OSDI-API-Token': apiKey
    }
  })
  return tag
}, {
  maxAge: 10,
  name: 'getActionNetworkSignatureCount',
  getKey: (_key: string, id: string) => {
    const ids = id.match(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/)
    if (!ids?.length) {
      return id
    }
    return ids[0]
  }
})

export const getActionNetworkPetition = async ({
  key,
  endpoint
}: {
  key: string,
  endpoint: string
}) => {
  const apiKey = decryptData(key)
  const headers = {
    'OSDI-API-Token': apiKey,
    'Content-Type': 'application/json'
  }
  const ids = endpoint.match(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/)
  if (!ids?.length) {
    // return new Error('There is no UUID in the endpoint provided to get action network petition')
    return
  }
  const url = `https://actionnetwork.org/api/v2/petitions/${ids[0]}`
  const query = await $fetch<ActionNetworkPetition>(url, {
    method: 'GET',
    headers
  })
  return query
}
