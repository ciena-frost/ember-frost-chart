/**
 * Component definition for the frost-chart-x-axis component
 */

import Ember from 'ember'
const {String: EmberString, assign, get} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'
import {linearTicks} from '../helpers/linear-ticks'

import layout from '../templates/components/frost-chart-x-axis-svg'

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  attributeBindings: ['style'],
  classNameBindings: ['alignment'],
  layout,

  // == PropTypes =============================================================

  propTypes: {
    // options
    alignment: PropTypes.oneOf(['top', 'bottom']),
    label: PropTypes.string,
    ticks: PropTypes.func,
    offset: PropTypes.number,

    chartState: PropTypes.EmberObject.isRequired,
    dispatch: PropTypes.func.isRequired

    // state
  },

  getDefaultProps () {
    return {
      // options
      aligment: 'bottom',
      label: null,
      ticks: linearTicks([10]),
      offset: 0,

      // state
      _axis: 'x',
      // FIXME: #9 Calculate the height of the text to get the height of the svg in the axis
      _svgHeight: 20,
      _numberOfTickRendered: 0

    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('chartState.chart.initialized', 'chartState.domain.x')
  _ticks (initializedChart, domain) {
    if (!initializedChart) {
      return []
    }

    return this.ticks(domain)
  },

  @readOnly
  @computed('_ticks', 'chartState.range.x', 'chartState.domain.x')
  _positionedTicks (ticks, range, domain) {
    if (!range || !domain) {
      return ticks
    }

    const scale = this.get('chartState.scale.x')
    const transform = scale({domain, range})

    return ticks.map(tick => {
      return assign({}, tick, {
        coordinate: transform(get(tick, 'value'))
      })
    })
  },

  @readOnly
  @computed('chartState.axes.initialized', 'chartState.chart.width')
  /* eslint complexity: [2, 7] */
  style (initializedAxes, chartWidth) {
    if (!initializedAxes || !chartWidth) {
      return EmberString.htmlSafe('')
    }

    const chartPadding = this.get('chartState.chart.padding')
    const yAxisAlignment = this.get('chartState.axes.y.alignment')
    const yAxisWidth = this.get('chartState.axes.y.width') || 0
    const xAxisAlignment = this.get('chartState.axes.x.alignment')
    const xAxisFirstTickMargin = this.get('chartState.axes.x.firstTickMargin')
    const xAxisLastTickMargin = this.get('chartState.axes.x.lastTickMargin')

    return EmberString.htmlSafe(`
      ${xAxisAlignment}: ${get(chartPadding, xAxisAlignment)}px;
      margin-left: calc(${yAxisAlignment === 'left' ? yAxisWidth : xAxisFirstTickMargin}px);
      margin-right: calc(${yAxisAlignment === 'right' ? yAxisWidth : xAxisLastTickMargin}px);
    `)
  },

  @readOnly
  @computed('chartState.axes.initialized', 'chartState.chart.width')
  _svgWidth (initializedAxes, chartWidth) {
    const yAxisWidth = this.get('chartState.axes.y.width') || 0
    const xAxisFirstTickMargin = this.get('chartState.axes.x.firstTickMargin')
    const xAxisLastTickMargin = this.get('chartState.axes.x.lastTickMargin')

    return chartWidth - yAxisWidth - xAxisFirstTickMargin - xAxisLastTickMargin
  },

  // == Functions =============================================================

  _dispatchRenderedAxis () {
    this.dispatch({
      type: 'RENDERED_X_AXIS',
      axis: {
        alignment: this.get('alignment'),
        height: this.$().outerHeight(true) + this.get('offset'),
        // ticks: this.get('_ticks'),
        tickHeight: this.$(`.${this.get('css')}-ticks`).height()
      }
    })
  },

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  init () {
    this._super(...arguments)
    this.dispatch({
      type: 'REGISTER_AXIS'
    })
  },

  // == Actions ===============================================================
  actions: {
    _dispatchTickRendered (action) {
      this.dispatch(action)

      this.incrementProperty('_numberOfTickRendered')

      if (this.get('_numberOfTickRendered') >= this.get('_ticks').length) {
        this._dispatchRenderedAxis()
      }
    }
  }
})
