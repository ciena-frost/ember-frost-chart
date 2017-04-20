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
    chartState: PropTypes.EmberObject.isRequired,
    data: PropTypes.array.isRequired,
    line: PropTypes.func.isRequired,
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired

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
  @computed('data.[]', 'x', 'y', 'chartState.range.x', 'chartState.range.y')
  _path (data, x, y, xRange, yRange) {
    if (!xRange || !yRange) {
      return []
    }

    const xScale = this.get('chartState.scale.x')
    const xDomain = this.get('chartState.domain.x')
    const xTransform = xScale({domain: xDomain, range: xRange})

    const yScale = this.get('chartState.scale.y')
    const yDomain = this.get('chartState.domain.y')
    const yTransform = yScale({domain: yDomain, range: yRange})

    const points = data.map(entry => {
      return {
        x: xTransform(get(entry, x)),
        y: yTransform(get(entry, y))
      }
    }).sortBy('x', 'y')

    return this.line(points)
  }

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
