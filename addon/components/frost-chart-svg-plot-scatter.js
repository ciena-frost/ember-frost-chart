/**
 * Component definition for the frost-chart-svg-plot-scatter component
 */

import Ember from 'ember'
const {get} = Ember
import {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'

import layout from '../templates/components/frost-chart-svg-plot-scatter'

export default Component.extend({
  
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'g',

  // == PropTypes =============================================================

  propTypes: {
    // options

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
  _scaledData (initializing, data, x, y, xDomain, xRange, xScale, yDomain, yRange, yScale) {
    if (initializing) {
      return []
    }

    const xTransform = xScale({domain: xDomain, range: xRange})
    const yTransform = yScale({domain: yDomain, range: yRange})

    // Transform the data
    return data.map(entry => {
      return {
        x: xTransform(get(entry, x)),
        y: yTransform(get(entry, y))
      }
    })
  },

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }

})
