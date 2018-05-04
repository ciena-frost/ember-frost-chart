# 7.1.0 (2018-05-04)
- Add stacked-bar chart type


# 7.0.0 (2018-04-13)

* Upgraded `ember-frost-core` to ^8.0.0

# 6.0.0 (2018-03-22)
* **Updated** pull request template
* **Added** issue template
* **Updated** to `pr-bumper` version `3`
* **Updated** to node 8
* **Added** slack integration
* **Updated** `ember-frost-test` to `^4.0.1`
* **Updated** `ember-test-utils` to `^8.1.1`
* **Updated** `ember-cli-frost-blueprints` to `^5.0.2`
* **Updated** `ember-prop-types` to `^7.0.1`
* **Updated** `ember-frost-core` to `^7.0.0`
* **Removed** ignoring of `package-lock.json` file
* **Added** `package-lock.json` file
* **Updated** Travis CI scripts to allow non-exact node version

# 5.0.1 (2018-02-20)
- #43 sourcemaps disabled until fixed in external dependencies
- #42 changed default height and width to 0 instead of null


# 5.0.0 (2018-01-05)
* **Added** the ignoring of linting of the `CHANGELOG.md` file
* **Removed** useLintTree ember-cli-mocha configuration from `ember-cli-build.js`
* **Removed** unused `ember-elsewhere` package
* **Updated** `ember-cli-code-coverage` to `0.3.12`
* **Removed** unused `ember-spread` package
* **Removed** unused `ember-truth-helpers` package
* **Updated** `ember-cli-code-snippet` to version `1.7.0`
* **Updated** `ember-frost-test` to version `^4.0.0`
* **Updated** `ember-cli-chai` to version `0.4.3`
* **Updated** `ember-cli-mocha` to version `0.14.4`
* **Updated** `ember-test-utils` to `^8.1.0`
* **Updated** `ember-hook` to `1.4.2` and moved to dependency
* **Updated** `ember-sinon` to `^0.7.0`
* **Updated** `sinon-chai` to version `^2.14.0`
* **Removed** unused `ember-cli-sri` package
* **Updated** `ember-d3` to version `0.3.4` and move to dependency
* **Removed** `d3` package since it is included by `ember-d3` package at correct version
* **Updated** `ember-cli-frost-blueprints` to `^5.0.1`
* **Updated** code coverage configuration to be in correct directory
* **Updated** `ember-prop-types` to version `^6.0.1`
* **Added** package-lock to the `.gitignore`files until we are ready to migrate to node 8
* **Updated** `ember-cli-sass` to version `7.1.1`
* **Updated** `ember-frost-core` to version `^5.0.0`
* **Removed** installation of packages via blueprints since the packages are now being installed via dependencies

# 4.1.1 (2017-11-17)
* #33 - Bind context to call of `this._super.included()` in index.js

# 4.1.0 (2017-09-28)

- Added gradient area graphs
- Added custom path helper
- Added an example to the dummy app


# 4.0.3 (2017-08-15)
* Closes ciena-frost/ember-frost-chart#29

# 4.0.2 (2017-08-11)
* Upgrade ember-cli 2.12.3 inter-dependencies

# 4.0.1 (2017-07-18)
* **Upgrade** to `ember-cli@2.12.3`

# 4.0.0 (2017-05-26)
* **Added** Use case where all values are the minimum (typically 0) for the data
* **Added** Added more verbose class names


# 3.0.2 (2017-05-25)
* Fixes https://github.com/ciena-frost/ember-frost-chart/issues/15


# 3.0.1 (2017-05-23)
* **Added** sanitize item values


# 3.0.0 (2017-05-18)
* **Added** exposed padding to gauge


# 2.2.1 (2017-05-18)
* **Added** more observers to arc


# 2.2.0 (2017-05-18)
Added guage


# 2.1.0 (2017-05-18)
Added gauge


# 2.0.1 (2017-05-16)
* **Fixed** issue with NaN coordinate in `frost-chart-axis-tick-svg`


# 2.0.0 (2017-05-15)
* **Added** independent x and y grid
* **Added** svg x axis
* **Replaced** `frost-char-svg-plot-grid` by `frost-char-svg-plot-x-grid` and `frost-char-svg-plot-y-grid`

# 1.1.0 (2017-05-10)
* **Exposed** chart state for `frost-chart`
* **Fixed** first parameter missing in helper


# 1.0.1 (2017-05-10)
* **Updated** the secure tokens in `.travis.yml`

# 1.0.0 (2017-05-05)
- Initial release of the new architecture


# 0.0.1 (2017-04-11)
get the build working and ready for real code

