/**
* Component definition for the frost-chart-y-axis component
*/

import Ember from 'ember'
const {String: EmberString, assign, get} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {linearTicks} from '../helpers/linear-ticks'
import {PropTypes} from 'ember-prop-types'
import layout from '../templates/components/frost-chart-y-axis'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  attributeBindings: ['style'],
  classNameBindings: ['alignment'],
  layout,

  // == PropTypes =============================================================

  propTypes: {
    // options
    alignment: PropTypes.oneOf(['left', 'right']),
    label: PropTypes.string,
    ticks: PropTypes.func,

    chartState: PropTypes.EmberObject.isRequired,
    dispatch: PropTypes.func.isRequired

    // state
  },

  getDefaultProps () {
    return {
      // options
      aligment: 'left',
      label: null,
      ticks: linearTicks([10]),

      // state
      _axis: 'y',
      _numberOfTickRendered: 0
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('chartState.chart.initialized', 'chartState.domain.y')
  _ticks (initialized, domain) {
    if (!initialized) {
      return []
    }

    return this.ticks(domain).reverse()
  },

  @readOnly
  @computed('_ticks', 'chartState.range.y', 'chartState.domain.y')
  _positionedTicks (ticks, range, domain) {
    if (!range || !domain) {
      return ticks
    }

    const scale = this.get('chartState.scale.y')
    const transform = scale({domain, range})

    return ticks.map(tick => {
      return assign({}, tick, {
        coordinate: transform(get(tick, 'value'))
      })
    })
  },

  @readOnly
  @computed('chartState.axes.initialized', 'chartState.chart.height')
  style (initializedAxes, chartHeight) {
    if (!initializedAxes || !chartHeight) {
      return EmberString.htmlSafe('')
    }

    const chartPadding = this.get('chartState.chart.padding')
    const xAxisAlignment = this.get('chartState.axes.x.alignment')
    const xAxisHeight = this.get('chartState.axes.x.height')
    const yAxisAlignment = this.get('chartState.axes.y.alignment')
    const yAxisFirstTickMargin = this.get('chartState.axes.y.firstTickMargin')
    const yAxisLastTickMargin = this.get('chartState.axes.y.lastTickMargin')

    // TODO I believe we're missing the padding calculation for the opposing direction (e.g. right)
    // TODO We may also have an issue when only one axis is present (see margin calcs)
    return EmberString.htmlSafe(`
      ${yAxisAlignment}: ${get(chartPadding, yAxisAlignment)}px;
      height: calc(${chartHeight}px - ${xAxisHeight}px - ${yAxisFirstTickMargin}px - ${yAxisLastTickMargin}px);
      margin-top: calc(${xAxisAlignment === 'top' ? xAxisHeight : 0}px + ${yAxisFirstTickMargin}px);
      margin-bottom: calc(${xAxisAlignment === 'bottom' ? xAxisHeight : 0}px + ${yAxisLastTickMargin}px);
    `)
  },

  // == Functions =============================================================

  _dispatchRenderedAxis () {
    const outerWidth = this.$().outerWidth(true)
    const tickLabelWidth = this.$('.frost-chart-y-axis-ticks').outerWidth(true)
    let width = outerWidth + this.get('yAxisPadding')

    if (this.get('yAxisTicksOnLines')) {
      width = outerWidth - tickLabelWidth
    }

    this.dispatch({
      type: 'RENDERED_Y_AXIS',
      axis: {
        alignment: this.get('alignment'),
        height: this.$().outerHeight(true),
        width,
        tickLabelWidth
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
    dispatchTickRendered (action) {
      this.dispatch(action)

      this.incrementProperty('_numberOfTickRendered')

      if (this.get('_numberOfTickRendered') >= this.get('_ticks').length) {
        this._dispatchRenderedAxis()
      }
    }
  }
})
