/**
 * Component definition for the frost-chart-x-axis component
 */

import Ember from 'ember'
const {A, Object: EmberObject, String: EmberString, assign, get, isEmpty, run} = Ember
import {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'

import layout from '../templates/components/frost-chart-x-axis'
import {linearTicks} from '../helpers/linear-ticks'

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

      // state
      _axis: 'x'
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
  @computed('_ticks', 'chartState.range.x')
  _positionedTicks (ticks, range) {
    if (!range) {
      return ticks
    }

    const scale = this.get('chartState.scale.x')
    const domain = this.get('chartState.domain.x')
    const transform = scale({domain, range})

    return ticks.map(tick => {
      return assign({}, tick, {
        coordinate: transform(get(tick, 'value'))
      })
    })
  },

  @readOnly
  @computed('chartState.axes.initialized', 'chartState.chart.width')
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
      width: calc(${chartWidth}px - ${yAxisWidth}px - ${xAxisFirstTickMargin}px - ${xAxisLastTickMargin}px);
      margin-left: calc(${yAxisAlignment === 'left' ? yAxisWidth : 0}px);
      margin-right: calc(${yAxisAlignment === 'right' ? yAxisWidth : 0}px);
    `)
  },

  @readOnly
  @computed('chartState.axes.x.tickHeight')
  _tickHeight (tickHeight) {
    return EmberString.htmlSafe(`height: ${tickHeight}px;`)
  },

  // == Functions =============================================================

  _dispatchRenderedAxis () {
    this.dispatch({
      type: 'RENDERED_X_AXIS',
      axis: {
        alignment: this.get('alignment'),
        height: this.$().outerHeight(true),
        ticks: this.get('_ticks'),
        tickHeight: this.$(`.${this.get('css')}-ticks`).height()
      }
    })
  },

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  init () {
    this._super(...arguments)
    this.attrs.dispatch({
      type: 'REGISTER_AXIS'
    })
  },

  didInsertElement () {
    this._super(...arguments)
    run.scheduleOnce('afterRender', this, this._dispatchRenderedAxis)
  }

  // == Actions ===============================================================

})
