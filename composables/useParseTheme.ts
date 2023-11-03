import { LocationQueryValue } from 'vue-router'
import { SelectOption } from 'naive-ui'

export const useParseTheme = (theme: LocationQueryValue | LocationQueryValue[], themeOptions: SelectOption[]): number[] => {
  let filteredThemes: number[] = []
  filteredThemes = (theme instanceof Array ? theme : [theme]).map((t) => {
    return parseInt(t || '0')
  })
  return filteredThemes.filter((t) => {
    const isAllowed = themeOptions?.filter(o => o.value === t)
    return t !== 0 && isAllowed && isAllowed.length > 0
  })
}
