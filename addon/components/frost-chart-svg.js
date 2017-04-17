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
    'height',
    'style',
    'viewbox',
    'width'
  ],
  layout,
  tagName: 'svg',

  // == PropTypes =============================================================

  /**
   * Properties for this component. Options are expected to be (potentially)
   * passed in to the component. State properties are *not* expected to be
   * passed in/overwritten.
   */
  propTypes: {
    // options

    // state
  },

  /** @returns {Object} the default property values when not provided by consumer */
  getDefaultProps () {
    return {
      // options

      // state
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('_canvasHeight')
  height (_canvasHeight) {
    return _canvasHeight
  },

  @readOnly
  @computed('_canvasHeight', '_canvasWidth', '_xAxisGutter', '_yAxisGutter')
  style (_canvasHeight, _canvasWidth, _xAxisGutter, _yAxisGutter) {
    const xAxisGutter = _xAxisGutter ? _xAxisGutter.height : 0
    const yAxisFirstTickMargin = _yAxisGutter ? _yAxisGutter.firstTickMargin : 0
    const xAxisGutterAlign = _xAxisGutter ? _xAxisGutter.align : 'bottom'
    const xMargin = xAxisGutterAlign === 'bottom' ?
      yAxisFirstTickMargin :
      xAxisGutter + yAxisFirstTickMargin
    const yAxisGutter = _yAxisGutter ? _yAxisGutter.width : 0
    const yAxisGutterAlign = _yAxisGutter ? _yAxisGutter.align : 'left'
    return EmberString.htmlSafe(`
      margin-top: ${xMargin}px;
      margin-${yAxisGutterAlign}: ${yAxisGutter}px;
    `)

    //   const gutter = _gutter ? _gutter.height : 0
    //   const gutterAlign = _gutter ? _gutter.align : 'bottom'
    //   const _renderedTicks = this.get('_renderedTicks')
    //   let tickMargin = 0
    //   let firstTickMargin = 0
    //   if (_renderedTicks.length === this.get('ticks') + 1) {
    //     const firstTick = _renderedTicks.get('firstObject')
    //     const lastTick = _renderedTicks.get('lastObject')
    //     firstTickMargin = get(firstTick, 'height') / 2
    //     tickMargin = get(firstTick, 'height') / 2 + get(lastTick, 'height') / 2
    //   }
    //   return EmberString.htmlSafe(`
    //     ${this.get('align')}: 0;
    //     height: calc(${chartHeight}px - ${gutter}px - ${tickMargin}px);
    //     margin-${gutterAlign === 'bottom' ? 'top' : 'bottom'}: calc(${gutter}px + ${firstTickMargin}px);
    //   `)
    // } else {
    //   const gutter = _gutter ? _gutter.width : 0
    //   const gutterAlign = _gutter ? _gutter.align : 'left'
    //   return EmberString.htmlSafe(`
    //     ${this.get('align')}: 0;
    //     width: calc(${chartWidth}px - ${gutter}px);
    //     margin-${gutterAlign}: ${gutter}px;
    //   `)
    // }
  },

  @readOnly
  @computed('_canvasWidth')
  width (_canvasWidth) {
    return _canvasWidth
  },

  @readOnly
  @computed('_canvasHeight', '_canvasWidth')
  viewBox (_canvasHeight, _canvasWidth) {
    return `0 0 ${_canvasWidth} ${_canvasHeight}`
  },

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }
})
