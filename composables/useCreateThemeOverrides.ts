import { GlobalThemeOverrides } from 'naive-ui'
import { CustomStyleTheme } from '~/types'

function lightenDarkenColor (col: string, amt: number) {
  let usePound = false

  if (col[0] === '#') {
    col = col.slice(1)
    usePound = true
  }

  const num = parseInt(col, 16)

  let r = (num >> 16) + amt

  if (r > 255) { r = 255 } else if (r < 0) { r = 0 }

  let b = ((num >> 8) & 0x00FF) + amt

  if (b > 255) { b = 255 } else if (b < 0) { b = 0 }

  let g = (num & 0x0000FF) + amt

  if (g > 255) { g = 255 } else if (g < 0) { g = 0 }

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
}

function hexToRgb (hex: string, opacity: number = 1) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (_m, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
    : undefined
}

export const useCreateThemeOverrides = (theme: CustomStyleTheme) => {
  const themeOverrides: GlobalThemeOverrides = {
    common: {
      fontFamily: theme.font || undefined,
      // fontFamilyMono: 'v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace',
      // fontWeight: '400',
      // fontWeightStrong: '500',
      // cubicBezierEaseInOut: 'cubic-bezier(.4, 0, .2, 1)',
      // cubicBezierEaseOut: 'cubic-bezier(0, 0, .2, 1)',
      // cubicBezierEaseIn: 'cubic-bezier(.4, 0, 1, 1)',
      // borderRadius: '3px',
      // borderRadiusSmall: '2px',
      // fontSize: '14px',
      // fontSizeMini: '12px',
      // fontSizeTiny: '12px',
      // fontSizeSmall: '14px',
      // fontSizeMedium: '14px',
      // fontSizeLarge: '15px',
      // fontSizeHuge: '16px',
      // lineHeight: '1.6',
      // heightMini: '16px',
      // heightTiny: '22px',
      // heightSmall: '28px',
      // heightMedium: '34px',
      // heightLarge: '40px',
      // heightHuge: '46px',
      // baseColor: '#000',
      // primaryColor: '#63e2b7',
      // primaryColorHover: '#7fe7c4',
      // primaryColorPressed: '#5acea7',
      // primaryColorSuppl: 'rgb(42, 148, 125)',
      // infoColor: '#70c0e8',
      // infoColorHover: '#8acbec',
      // infoColorPressed: '#66afd3',
      // infoColorSuppl: 'rgb(56, 137, 197)',
      // successColor: '#63e2b7',
      // successColorHover: '#7fe7c4',
      // successColorPressed: '#5acea7',
      // successColorSuppl: 'rgb(42, 148, 125)',
      // warningColor: '#f2c97d',
      // warningColorHover: '#f5d599',
      // warningColorPressed: '#e6c260',
      // warningColorSuppl: 'rgb(240, 138, 0)',
      // errorColor: '#e88080',
      // errorColorHover: '#e98b8b',
      // errorColorPressed: '#e57272',
      // errorColorSuppl: 'rgb(208, 58, 82)',
      textColorBase: theme.backgroundTextColor ? theme.backgroundTextColor : undefined,
      textColor1: theme.backgroundTextColor ? hexToRgb(theme.backgroundTextColor, 0.9) : undefined,
      textColor2: theme.backgroundTextColor ? hexToRgb(theme.backgroundTextColor, 0.82) : undefined,
      textColor3: theme.backgroundTextColor ? hexToRgb(theme.backgroundTextColor, 0.52) : undefined,
      textColorDisabled: theme.backgroundTextColor ? hexToRgb(theme.backgroundTextColor, 0.38) : undefined,
      placeholderColor: theme.backgroundTextColor ? hexToRgb(theme.backgroundTextColor, 0.38) : undefined,
      placeholderColorDisabled: theme.backgroundTextColor ? hexToRgb(theme.backgroundTextColor, 0.28) : undefined,
      iconColor: theme.backgroundTextColor ? hexToRgb(theme.backgroundTextColor, 0.38) : undefined,
      iconColorDisabled: theme.backgroundTextColor ? hexToRgb(theme.backgroundTextColor, 0.28) : undefined,
      iconColorHover: theme.backgroundTextColor ? hexToRgb(theme.backgroundTextColor, 0.475) : undefined,
      iconColorPressed: theme.backgroundTextColor ? hexToRgb(theme.backgroundTextColor, 0.30400000000000005) : undefined,
      // opacity1: '0.9',
      // opacity2: '0.82',
      // opacity3: '0.52',
      // opacity4: '0.38',
      // opacity5: '0.28',
      dividerColor: theme.backgroundTextColor ? hexToRgb(theme.backgroundTextColor, 0.15) : undefined,
      borderColor: theme.backgroundTextColor ? hexToRgb(theme.backgroundTextColor, 0.24) : undefined,
      // closeIconColorHover: 'rgba(255, 255, 255, 0.52)',
      // closeIconColor: 'rgba(255, 255, 255, 0.52)',
      // closeIconColorPressed: 'rgba(255, 255, 255, 0.52)',
      // closeColorHover: 'rgba(255, 255, 255, .12)',
      // closeColorPressed: 'rgba(255, 255, 255, .08)',
      // clearColor: 'rgba(255, 255, 255, 0.38)',
      // clearColorHover: 'rgba(255, 255, 255, 0.48)',
      // clearColorPressed: 'rgba(255, 255, 255, 0.3)',
      // scrollbarColor: 'rgba(255, 255, 255, 0.2)',
      // scrollbarColorHover: 'rgba(255, 255, 255, 0.3)'
      // scrollbarWidth: '5px',
      // scrollbarHeight: '5px',
      // scrollbarBorderRadius: '5px',
      // progressRailColor: 'rgba(255, 255, 255, 0.12)',
      // railColor: 'rgba(255, 255, 255, 0.2)',
      popoverColor: theme.backgroundColor ? theme.backgroundColor : undefined,
      tableColor: theme.backgroundColor ? theme.backgroundColor : undefined,
      cardColor: theme.backgroundColor ? theme.backgroundColor : undefined,
      modalColor: theme.backgroundColor ? theme.backgroundColor : undefined,
      bodyColor: theme.backgroundColor ? theme.backgroundColor : undefined,
      tagColor: theme.accentColor ? theme.accentColor : undefined,
      // avatarColor: 'rgba(255, 255, 255, 0.18)',
      // invertedColor: '#000',
      inputColor: theme.backgroundColor ? hexToRgb(theme.backgroundColor, 0.1) : undefined,
      // codeColor: 'rgba(255, 255, 255, 0.12)',
      // tabColor: 'rgba(255, 255, 255, 0.04)',
      // actionColor: 'rgba(255, 255, 255, 0.06)',
      // tableHeaderColor: 'rgba(255, 255, 255, 0.06)',
      hoverColor: theme.backgroundColor ? lightenDarkenColor(theme.backgroundColor, -20) : undefined,
      tableColorHover: theme.backgroundColor ? lightenDarkenColor(theme.backgroundColor, -20) : undefined
      // tableColorStriped: 'rgba(255, 255, 255, 0.05)',
      // pressedColor: 'rgba(255, 255, 255, 0.05)',
      // opacityDisabled: '0.38',
      // inputColorDisabled: 'rgba(255, 255, 255, 0.06)',
      // buttonColor2: 'rgba(255, 255, 255, .08)',
      // buttonColor2Hover: 'rgba(255, 255, 255, .12)',
      // buttonColor2Pressed: 'rgba(255, 255, 255, .08)',
      // boxShadow1: '0 1px 2px -2px rgba(0, 0, 0, .24), 0 3px 6px 0 rgba(0, 0, 0, .18), 0 5px 12px 4px rgba(0, 0, 0, .12)',
      // boxShadow2: '0 3px 6px -4px rgba(0, 0, 0, .24), 0 6px 12px 0 rgba(0, 0, 0, .16), 0 9px 18px 8px rgba(0, 0, 0, .10)',
      // boxShadow3: '0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)'
    }
  }
  return themeOverrides
}
