import Typography from 'typography'
import CodePlugin from 'typography-plugin-code'
import usWebDesignStandardsTheme from 'typography-theme-us-web-design-standards'

usWebDesignStandardsTheme.overrideThemeStyles = () => ({
  'div.gatsby-highlight': {
    marginBottom: '20px'
  }
})
usWebDesignStandardsTheme.plugins = [
  new CodePlugin(),
]
// Wordpress2016.overrideThemeStyles = () => ({
//   'a.gatsby-resp-image-link': {
//     boxShadow: 'none',
//   },
//   'body': {
//     fontFamily: "'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif",
//   },

// })
// Wordpress2016.pugins = [
//   new CodePlugin(),
// ]

const typography = new Typography(usWebDesignStandardsTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
