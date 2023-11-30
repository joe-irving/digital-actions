import { z } from 'zod'

export const AddressSchema = z.object({
  county: z.optional(z.string()),
  'ISO3166-2-lvl6': z.optional(z.string()),
  state: z.optional(z.string()),
  'ISO3166-2-lvl4': z.optional(z.string()),
  country: z.optional(z.string()),
  country_code: z.optional(z.string()),
  road: z.optional(z.string()),
  neighbourhood: z.optional(z.string()),
  suburb: z.optional(z.string()),
  village: z.optional(z.string()),
  town: z.optional(z.string()),
  municipality: z.optional(z.string())
})

export const LocationSchema = z.object({
  place_id: z.number(),
  licence: z.optional(z.string()),
  osm_type: z.optional(z.string()),
  osm_id: z.number(),
  lat: z.string(),
  lon: z.string(),
  category: z.optional(z.string()),
  type: z.optional(z.string()),
  place_rank: z.optional(z.number()),
  importance: z.optional(z.number()),
  addresstype: z.optional(z.string()),
  name: z.string(),
  display_name: z.string(),
  address: AddressSchema,
  boundingbox: z.optional(z.array(z.string()))
})
