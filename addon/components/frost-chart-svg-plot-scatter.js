/**
 * Component definition for the frost-chart-svg-plot-scatter component
 */

import Ember from 'ember'
const {get} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-chart-svg-plot-scatter'

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
  @computed('data.[]', 'chartState.range.x', 'chartState.range.y', 'chartState.domain.x', 'chartState.domain.y',
    'chartState.axes.y.{ticksAboveLines,tickLabelWidth,padding}')
  _points (data, xRange, yRange, xDomain, yDomain, yAxisTicksAboveLines, yTickLabelWidth, yAxisPadding) {
    if (!xRange || !yRange || !xDomain || !yDomain) {
      return []
    }

    const xScale = this.get('chartState.scale.x')
    const xTransform = xScale({domain: xDomain, range: xRange})

    const yScale = this.get('chartState.scale.y')
    const yTransform = yScale({domain: yDomain, range: yRange})

    return data.map((entry, index) => {
      const transformedX = xTransform(get(entry, this.x))
      return {
        index,
        x: yAxisTicksAboveLines ? transformedX + yTickLabelWidth + yAxisPadding : transformedX,
        y: yTransform(get(entry, this.y))
      }
    })
  }

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
