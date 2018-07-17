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
  @computed('chartState.range.x', 'chartState.range.y', 'chartState.domain.y', 'startOnly',
    'chartState.axes.y.{ticksAboveLines,tickLabelWidth,padding}')
  _ticks (xRange, yRange, yDomain, startOnly, yAxisTicksAboveLines, yTickLabelWidth, yAxisPadding) {
    if (!xRange || !yRange || !isDomainValid(yDomain)) {
      return []
    }

    const yScale = this.get('chartState.scale.y')
    const yTransform = yScale({domain: yDomain, range: yRange})
    const ticks = this.get('ticks')(yDomain)

    const ticksmap = ticks.map(tick => {
      return {
        x: yAxisTicksAboveLines ? xRange[1] + yTickLabelWidth + yAxisPadding : xRange[1],
        y: yTransform(get(tick, 'value'))
      }
    })

    return startOnly ? [ticksmap[0]] : ticksmap
  }

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================
})
