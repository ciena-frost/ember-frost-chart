import {stack as d3Stack} from 'd3-shape'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'
import layout from '../templates/components/frost-chart-svg-plot-stacked-bar'

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
    y: PropTypes.string.isRequired,
    seriesKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
    seriesColors: PropTypes.array

    // state
  },

  getDefaultProps () {
    return {
      // options
      seriesColors: [
        '#009eef',
        '#a183db',
        '#009999',
        '#a1e7ff',
        '#e8dffb',
        '#9aefea'
      ]

      // state
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('data.[]', 'x', 'chartState.range.x', 'chartState.range.y',
    'chartState.domain.x', 'chartState.domain.y', 'seriesKeys', 'seriesColors')
  _bars (data, xProp, xRange, yRange, xDomain, yDomain, seriesKeys, seriesColors) {
    if (!xRange || !yRange || !xDomain || !yDomain) {
      return []
    }

    const stackLayout = d3Stack().keys(seriesKeys)
    const stackedData = stackLayout(data)

    const xScale = this.get('chartState.scale.x')
    const xTransform = xScale({domain: xDomain, range: xRange})

    const yScale = this.get('chartState.scale.y')
    const yTransform = yScale({domain: yDomain, range: yRange})

    return stackedData.reduce((arr, layer, index) => {
      return arr.concat(layer.map(entry => {
        return {
          x: xTransform(entry.data[xProp]),
          y: yTransform(entry[1]),
          width: xTransform.bandwidth(),
          height: yTransform(entry[0]) - yTransform(entry[1]),
          color: seriesColors[index % seriesColors.length], // Repeat colors if too few are provided
          seriesIndex: index
        }
      }))
    }, [])
  }

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
