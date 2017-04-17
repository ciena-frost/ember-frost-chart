/**
 * Component definition for the frost-chart-axis component
 */

import Ember from 'ember'
const {A, Object: EmberObject, String: EmberString, get} = Ember
import {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'

import layout from '../templates/components/frost-chart-axis'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  attributeBindings: ['style'],
  classNameBindings: ['align'],
  layout,

  // == PropTypes =============================================================

  /**
   * Properties for this component. Options are expected to be (potentially)
   * passed in to the component. State properties are *not* expected to be
   * passed in/overwritten.
   */
  propTypes: {
    // options
    label: PropTypes.string,
    ticks: PropTypes.number

    // state
  },

  /** @returns {Object} the default property values when not provided by consumer */
  getDefaultProps () {
    return {
      // options
      ticks: 10,

      // state
      _renderedTicks: A([])
    }
  },

  // == Computed Properties ===================================================

  // TODO separate out x and y - putting them in the same class isn't being beneficial
  @readOnly
  @computed('align')
  _isVertical (align) {
    return align === 'left' || align === 'right'
  },

  @readOnly
  @computed('initializedChart', 'domain')
  _ticks (initializedChart, domain) {
    if (!initializedChart) {
      return []
    }

    const ticks = this.get('ticks')

    // We want ticks at the min/max of the domain, the rest of the ticks
    // should be divided evenly across the domain
    const _ticks = A()
    _ticks.addObject(EmberObject.create({
      value: domain[0]
    }))

    _ticks.addObjects(Array.from({length: ticks - 1}, (entry, index) => {
      const percentage = (index + 1) / ticks
      const tick = (domain[1] - domain[0]) * percentage + domain[0]
      return EmberObject.create({
        value: tick
      })
    }))

    _ticks.addObject(EmberObject.create({
      value: domain[1]
    }))

    return this.get('_isVertical') ? _ticks.reverse() : _ticks
  },

  @readOnly
  @computed('chartHeight', 'chartPadding', 'chartWidth', '_gutter')
  style (chartHeight, chartPadding, chartWidth, _gutter) {
    const _isVertical = this.get('_isVertical')
    if (_isVertical) {
      const gutter = _gutter ? _gutter.height : 0
      const gutterAlign = _gutter ? _gutter.align : 'bottom'
      const _renderedTicks = this.get('_renderedTicks')
      let tickMargin = 0
      let firstTickMargin = 0
      if (_renderedTicks.length === this.get('ticks') + 1) {
        const firstTick = _renderedTicks.get('firstObject')
        const lastTick = _renderedTicks.get('lastObject')
        firstTickMargin = get(firstTick, 'height') / 2
        tickMargin = get(firstTick, 'height') / 2 + get(lastTick, 'height') / 2
      }
      const margin = gutterAlign === 'bottom' ?
        firstTickMargin :
        gutter + firstTickMargin
        const padding = chartPadding ? get(chartPadding, this.get('align')) : 0
      return EmberString.htmlSafe(`
        ${this.get('align')}: padding;
        height: calc(${chartHeight}px - ${gutter}px - ${tickMargin}px);
        margin-top: ${margin}px;
      `)
    } else {
      const gutter = _gutter ? _gutter.width : 0
      const gutterAlign = _gutter ? _gutter.align : 'left'
      // let maxTickHeight = 0
      // const _renderedTicks = this.get('_renderedTicks')
      // if (_renderedTicks.length === this.get('ticks') + 1) {
      //   maxTickHeight = _renderedTicks.reduce((max, tick) => {
      //     const tickHeight = get(tick, 'height')
      //     return tickHeight > max ? tickHeight : max
      //   }, 0)
      // }
      const padding = chartPadding ? get(chartPadding, this.get('align')) : 0
      return EmberString.htmlSafe(`
        ${this.get('align')}: ${padding}px;
        width: calc(${chartWidth}px - ${gutter}px - ${this.get('_renderedTicks.lastObject.width')}px / 2);
        margin-${gutterAlign}: ${gutter}px;
        margin-right: calc(${this.get('_renderedTicks.lastObject.width')}px / 2);
      `)
    }
  },

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  didReceiveAttrs ({newAttrs}) {
    const range = get(newAttrs, 'range.value')
    if (range) {
      const domain = this.get('domain')
      const scale = this.get('scale')
      const transform = scale({domain, range})

      const _ticks = this.get('_ticks')
      _ticks.forEach((_tick) => {
        _tick.set('coordinate', transform(get(_tick, 'value')))
      })
    }
  },

  init () {
    this._super(...arguments)
    this._register({
      ticks: this.get('ticks'),
      vertical: this.get('_isVertical')
    })
  },

  // == Actions ===============================================================

  actions: {
    _didRenderTick ({height, width}) {
      const _renderedTicks = this.get('_renderedTicks').addObject({height, width})
      if (_renderedTicks.length === this.get('ticks') + 1) {
        if (this.get('_isVertical')) {
          const firstTick = _renderedTicks.get('firstObject')
          const lastTick = _renderedTicks.get('lastObject')
          const tickMargin = get(firstTick, 'height') / 2 + get(lastTick, 'height') / 2
          this._didRender({
            align: this.get('align'),
            firstTickMargin: get(firstTick, 'height') / 2,
            height: this.$().outerHeight(true),
            margin: tickMargin,
            width: this.$().outerWidth(true)
          })
        } else {
          const firstTick = _renderedTicks.get('firstObject')
          const lastTick = _renderedTicks.get('lastObject')
          const tickMargin = get(firstTick, 'width') / 2 + get(lastTick, 'width') / 2
          this.set('_tickHeight', this.$('.frost-chart-axis-ticks').height())
          this._didRender({
            align: this.get('align'),
            height: this.$().outerHeight(true),
            margin: tickMargin,
            width: this.$().outerWidth(true) - tickMargin
          })
        }
      } else {
        this.set('_renderedTicks', _renderedTicks)
      }
    }
  }
})
