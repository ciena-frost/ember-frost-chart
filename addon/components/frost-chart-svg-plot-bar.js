/**
 * Component definition for the frost-chart-svg-plot-bar component
 */

import Ember from 'ember'
const {assign, get} = Ember
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
    bar: PropTypes.func.isRequired,
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
  @computed('data.[]', 'chartState.range.x', 'chartState.range.y')
  _bars (data, xRange, yRange) {
    if (!xRange || !yRange) {
      return []
    }

    const xScale = this.get('chartState.scale.x')
    const xDomain = this.get('chartState.domain.x')
    const xTransform = xScale({domain: xDomain, range: xRange})

    const yScale = this.get('chartState.scale.y')
    const yDomain = this.get('chartState.domain.y')
    const yTransform = yScale({domain: yDomain, range: yRange})

    return data.map(entry => {
      const x = get(entry, this.x)
      const y = get(entry, this.y)

      return assign({}, this.bar({data, x, xRange, xTransform, y, yRange, yTransform}), {
        data: entry,
        x: xTransform(x),
        y: yTransform(y)
      })
    })
  }

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
