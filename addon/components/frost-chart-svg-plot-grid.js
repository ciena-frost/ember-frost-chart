/**
 * Component definition for the frost-chart-svg-plot-grid component
 */

import Ember from 'ember'
const {get, isPresent} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-chart-svg-plot-grid'

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
  @computed('chartState.range.x', 'chartState.range.y', 'chartState.domain.x')
  _xAxisTicks (xRange, yRange, xDomain) {
    if (!xRange || !yRange || !this._isDomainValid(xDomain)) {
      return []
    }

    const scale = this.get('chartState.scale.x')
    const transform = scale({domain: xDomain, range: xRange})
    const ticks = this.get('ticks')(xDomain)

    // TODO
    // left: calc(${coordinate}px - ${this.$().outerWidth()}px / 2);

    return ticks.map(tick => {
      return {
        x: transform(get(tick, 'value')),
        y: yRange[0]
      }
    })
  },

  @readOnly
  @computed('chartState.range.x', 'chartState.range.y', 'chartState.domain.y')
  _yAxisTicks (xRange, yRange, yDomain) {
    if (!xRange || !yRange || !this._isDomainValid(yDomain)) {
      return []
    }

    const scale = this.get('chartState.scale.y')
    const transform = scale({domain: yDomain, range: yRange})
    const ticks = this.get('ticks')(yDomain)

    return ticks.map(tick => {
      return {
        x: xRange[1],
        y: transform(get(tick, 'value'))
      }
    })
  },

  // == Functions =============================================================

  _isDomainValid (domain) {
    const [min, max] = domain
    return domain && isPresent(min) && !isNaN(min) && isPresent(max) && !isNaN(max)
  }

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
