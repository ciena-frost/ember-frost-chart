/**
 * Component definition for the frost-chart-svg-plot-scatter component
 */

import Ember from 'ember'
const {A, get} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'
import layout from '../templates/components/frost-chart-svg-plot-line'
import getTransformedX from 'ember-frost-chart/utils/transform'

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
  @computed('data.[]', 'x', 'y', 'chartState.range.x', 'chartState.range.y', 'chartState.domain.x',
    'chartState.domain.y', 'chartState.axes.y.{ticksAboveLines,tickLabelWidth,padding}')
  _path (data, x, y, xRange, yRange, xDomain, yDomain, yAxisTicksAboveLines, yTickLabelWidth, yAxisPadding) {
    if (!xRange || !yRange || !xDomain || !yDomain) {
      return []
    }

    const xScale = this.get('chartState.scale.x')
    const xTransform = xScale({domain: xDomain, range: xRange})

    const yScale = this.get('chartState.scale.y')
    const yTransform = yScale({domain: yDomain, range: yRange})

    const points = A(data.map(entry => {
      return {
        x: getTransformedX(get(entry, x), xTransform, yAxisTicksAboveLines, yTickLabelWidth, yAxisPadding),
        y: yTransform(get(entry, y))
      }
    })).sortBy('x', 'y')

    return this.line(points)
  }

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
