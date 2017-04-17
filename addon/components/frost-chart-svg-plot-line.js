/**
 * Component definition for the frost-chart-svg-plot-scatter component
 */

import Ember from 'ember'
const {get} = Ember
import {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'

import layout from '../templates/components/frost-chart-svg-plot-line'

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'g',

  // == PropTypes =============================================================

  propTypes: {
    // options
    line: PropTypes.func.isRequired

    // state
  },

  getDefaultProps () {
    return {
      // options

      // state
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('initializing', 'data.[]', 'x', 'y', 'xDomain', 'xRange', 'xScale', 'yDomain', 'yRange', 'yScale')
  _path (initializing, data, x, y, xDomain, xRange, xScale, yDomain, yRange, yScale) {
    if (initializing) {
      return []
    }

    // Transform the data
    const xTransform = xScale({domain: xDomain, range: xRange})
    const yTransform = yScale({domain: yDomain, range: yRange})

    const points = data.map(entry => {
      return {
        x: xTransform(get(entry, x)),
        y: yTransform(get(entry, y))
      }
    })

    // Plot the line
    return this.line(points)
  }

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
