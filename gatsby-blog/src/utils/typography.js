import Typography from 'typography'
import CodePlugin from 'typography-plugin-code'
import usWebDesignStandardsTheme from 'typography-theme-us-web-design-standards'

usWebDesignStandardsTheme.overrideThemeStyles = () => ({
  'div.gatsby-highlight': {
    marginBottom: '20px'
  },
  'a': {
    textDecoration: 'none'
  }
})
usWebDesignStandardsTheme.plugins = [
  new CodePlugin(),
]


const typography = new Typography(usWebDesignStandardsTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
