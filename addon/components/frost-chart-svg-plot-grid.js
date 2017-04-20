/**
 * Component definition for the frost-chart-svg-plot-grid component
 */

import Ember from 'ember'
const {A, Object: EmberObject, get, isEmpty} = Ember
import {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'

import layout from '../templates/components/frost-chart-svg-plot-grid'

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'g',

  // == PropTypes =============================================================

  propTypes: {
    // options
    chartState: PropTypes.EmberObject.isRequired

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
  @computed('chartState.axes.x.ticks', 'chartState.range.x', 'chartState.range.y')
  _xAxisTicks (xAxisTicks, xRange, yRange) {
    if (!xAxisTicks || !xRange || !yRange) {
      return []
    }

    const xScale = this.get('chartState.scale.x')
    const xDomain = this.get('chartState.domain.x')
    const xTransform = xScale({domain: xDomain, range: xRange})

    // TODO
    // left: calc(${coordinate}px - ${this.$().outerWidth()}px / 2);

    return xAxisTicks.map(xAxisTick => {
      return {
        x: xTransform(get(xAxisTick, 'value')),
        y: yRange[0]
      }
    })
  },

  @readOnly
  @computed('chartState.axes.y.ticks', 'chartState.range.x', 'chartState.range.y')
  _yAxisTicks (yAxisTicks, xRange, yRange) {
    if (!yAxisTicks || !xRange || !yRange) {
      return []
    }

    const yScale = this.get('chartState.scale.y')
    const yDomain = this.get('chartState.domain.y')
    const yTransform = yScale({domain: yDomain, range: yRange})

    return yAxisTicks.map(yAxisTick => {
      return {
        x: xRange[1],
        y: yTransform(get(yAxisTick, 'value'))
      }
    })
  }

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
