/**
 * Component definition for the frost-chart-svg-plot-y-grid component
 */

import Ember from 'ember'
const {get} = Ember
import layout from '../templates/components/frost-chart-svg-plot-y-grid'
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
    ticks: PropTypes.func.isRequired

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
  @computed('chartState.range.x', 'chartState.range.y', 'chartState.domain.y')
  _ticks (xRange, yRange, yDomain) {
    if (!xRange || !yRange || !isDomainValid(yDomain)) {
      return []
    }

    const yScale = this.get('chartState.scale.y')
    const yTransform = yScale({domain: yDomain, range: yRange})
    const ticks = this.get('ticks')(yDomain)

    return ticks.map(tick => {
      return {
        x: xRange[1],
        y: yTransform(get(tick, 'value'))
      }
    })
  }

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================
})
