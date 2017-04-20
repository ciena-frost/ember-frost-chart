/**
 * Component definition for the frost-chart-svg component
 */

import Ember from 'ember'
const {String: EmberString} = Ember
import {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'

import layout from '../templates/components/frost-chart-svg'

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  attributeBindings: [
    'chartState.canvas.height:height',
    'style',
    'viewbox',
    'chartState.canvas.width:width'
  ],
  layout,
  tagName: 'svg',

  // == PropTypes =============================================================

  propTypes: {
    // options
    chartState: PropTypes.EmberObject.isRequired,
    dispatch: PropTypes.func.isRequired

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
  @computed('chartState.canvas.height', 'chartState.canvas.width')
  style (canvasHeight, canvasWidth) {
    const xAxisAlignment = this.get('chartState.axes.x.alignment')
    const xAxisHeight = this.get('chartState.axes.x.height')
    const yAxisFirstTickMargin = this.get('chartState.axes.y.firstTickMargin') || 0
    const canvasTopMargin = xAxisAlignment === 'top' ? xAxisHeight + yAxisFirstTickMargin : yAxisFirstTickMargin

    const yAxisAlignment = this.get('chartState.axes.y.alignment') || 'left'
    const canvasHorizontalMargin = this.get('chartState.axes.y.width') || 0

    return EmberString.htmlSafe(`
      margin-top: ${canvasTopMargin}px;
      margin-${yAxisAlignment}: ${canvasHorizontalMargin}px;
    `)
  },

  @readOnly
  @computed('chartState.canvas.height', 'chartState.canvas.width')
  viewBox (canvasHeight, canvasWidth) {
    return `0 0 ${canvasHeight} ${canvasWidth}`
  },

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
