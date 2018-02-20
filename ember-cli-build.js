/* eslint-env node */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon')

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    babel: {
      optional: ['es7.decorators']
    },
    sassOptions: {
      includePaths: [
      ]
    },
    snippetSearchPaths: ['tests/dummy/app'],
    // TODO: #43 remove when d3-selection or fast-sourcemaps-concat are fixed 
    // to not break the build @jfellman 2018-02-20
    sourcemaps: {enabled: false}
  })

  return app.toTree()
}
