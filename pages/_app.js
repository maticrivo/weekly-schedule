import 'modern-normalize/modern-normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>
        {`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
              'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
              'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            direction: rtl;
            min-height: 100vh;
            background-color: #f5f8fa;
            margin: 0;
            padding-top: 50px;
          }

          code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
              monospace;
          }

          main {
            padding: 10px;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
          }

          .bp3-navbar-heading {
            margin-right: 0;
          }

          .bp3-card,
          .bp3-callout {
            margin-bottom: 10px;
          }

          .bp3-card:last-child {
            margin-bottom: 0;
          }

          .bp3-html-select select,
          .bp3-select select {
            font-size: 16px;
          }
        `}
      </style>
    </>
  )
}

export default MyApp
