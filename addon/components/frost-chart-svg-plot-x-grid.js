/**
 * Component definition for the frost-chart-svg-plot-x-grid component
 */

import Ember from 'ember'
const {get} = Ember
import layout from '../templates/components/frost-chart-svg-plot-x-grid'
import computed, {readOnly} from 'ember-computed-decorators'
import {isDomainValid} from 'ember-frost-chart/utils/validation'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'g',

  // == PropTypes =============================================================

  propTypes: {
    // options
    chartState: PropTypes.EmberObject.isRequired,
    ticks: PropTypes.func.isRequired,
    axesOnly: PropTypes.bool

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
  @computed('chartState.range.x', 'chartState.range.y', 'chartState.domain.x', 'axesOnly')
  _ticks (xRange, yRange, xDomain, axesOnly) {
    if (!xRange || !yRange || !isDomainValid(xDomain)) {
      return []
    }

    const xScale = this.get('chartState.scale.x')
    const xTransform = xScale({domain: xDomain, range: xRange})

    const ticks = this.get('ticks')(xDomain).map(tick => {
      return {
        x: xTransform(get(tick, 'value')),
        y: yRange[0]
      }
    })

    return axesOnly ? [ticks[0]] : ticks
  }

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================
})
