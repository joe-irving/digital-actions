import en from '~/locales/en-GB.json'

export default defineI18nConfig(() => ({
  // legacy: false,
  locale: 'en',
  messages: {
    en
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency', currency: 'GBP', notation: 'standard'
      },
      decimal: {
        style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2
      },
      percent: {
        style: 'percent', useGrouping: false
      },
      decimalInt: {
        style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0
      }
    }
  }
}))
