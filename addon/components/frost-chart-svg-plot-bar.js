/**
 * Component definition for the frost-chart-svg-plot-scatter component
 */

import Ember from 'ember'
const {get} = Ember
import {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'

import layout from '../templates/components/frost-chart-svg-plot-bar'

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
  @computed('initializing', 'xDomain', 'xRange', 'xScale', 'yDomain', 'yRange', 'yScale')
  _transform (initializing, xDomain, xRange, xScale, yDomain, yRange, yScale) {
    if (initializing) {
      return null
    }

    return {
      x: xScale({domain: xDomain, range: xRange}),
      y: yScale({domain: yDomain, range: yRange})
    }
  },

  @readOnly
  @computed('initializing', 'data.[]', 'xRange', 'yRange')
  _scaledData (initializing, data, xRange, yRange) {
    if (initializing) {
      return []
    }

    const x = this.get('x')
    const y = this.get('y')
    const _transform = this.get('_transform')

    // Transform the data
    return data.map(entry => {
      const height = _transform.y(get(entry, y))
      return {
        data: entry,
        height: yRange[0] - height,
        width: (xRange[1] - xRange[0]) / data.length,
        x: _transform.x(get(entry, x)),
        y: height
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
