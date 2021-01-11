const path = require('path')
const hyperlink = require('hyperlink')
const TapRender = require('@munter/tap-render');

const root = path.join(__dirname, '..')

;(async () => {
  const tapRender = new TapRender()
  tapRender.pipe(process.stdout)
  try {
    const skipPatterns = [
      // initial redirect
      'load index.html',
      'load docs/index.html',
      // google fonts
      'load https://fonts.googleapis.com/',
      // static resources
      'load static/assets',
      // externals links
      // /
      'load try-neo4j',
      // /developer
      'load developer',
      // /labs
      'load labs',
      // /docs
      'load docs',
      // /product
      'load product',
      // /load graph-data-science
      'load graph-data-science',
      // rate limit on twitter.com (will return 400 code if quota exceeded)
      'external-check https://twitter.com/neo4j'
    ]
    const skipFilter = (report) => {
      return Object.values(report).some((value) => {
          return skipPatterns.some((pattern) => String(value).includes(pattern))
        }
      )
    };
    await hyperlink({
        root,
        inputUrls: [`build/site/labs/index.html`],
        skipFilter: skipFilter,
        recursive: true,
        internalOnly: true,
      },
      tapRender
    )
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
  const results = tapRender.close();
  process.exit(results.fail ? 1 : 0);
})()
