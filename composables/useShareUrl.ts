export const useShareUrl = (slug: string) => {
  const { url: siteUrl } = useSiteConfig()
  const localePath = useLocalePath()
  return siteUrl + localePath(`/${slug}`)
}
