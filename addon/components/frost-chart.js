/**
 * Component definition for the frost-chart component
 */

import Ember from 'ember'
const {A, assign, get, isEmpty, run, inject} = Ember
import {task, timeout} from 'ember-concurrency'
import {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'

import layout from '../templates/components/frost-chart'

export default Component.extend({

  // == Dependencies ==========================================================

  resizeDetector: inject.service(),

  // == Keyword Properties ====================================================

  layout,

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

  getDefaultProps () {
    return {
      // options

      // state
      _chartHeight: null,
      _chartWidth: null,
      _initializedAxes: false,
      _initializedChart: false,
      _registeredAxes: A(),
      _renderedAxes: 0,
      _xAxisGutter: null,
      _yAxisGutter: null
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('_chartHeight', '_initializedAxes', '_xAxisGutter', '_yAxisGutter')
  _canvasHeight (_chartHeight, _initializedAxes, _xAxisGutter, _yAxisGutter) {
    if (!_initializedAxes) {
      return null
    }

    const gutter = _xAxisGutter ? _xAxisGutter.height : 0
    const margin = _yAxisGutter ? _yAxisGutter.margin : 0
    return _chartHeight - gutter - margin
  },

  @readOnly
  @computed('_chartWidth', '_initializedAxes', '_xAxisGutter', '_yAxisGutter')
  _canvasWidth (_chartWidth, _initializedAxes, _xAxisGutter, _yAxisGutter) {
    if (!_initializedAxes) {
      return null
    }

    const gutter = _yAxisGutter ? _yAxisGutter.width : 0
    const margin = _xAxisGutter ? _xAxisGutter.margin : 0
    return _chartWidth - gutter - margin
  },

  @readOnly
  @computed('_canvasWidth')
  _xRange (width) {
    const xRange = this.get('xRange')
    if (isEmpty(xRange) && width) {
      return [0, width]
    }
    return xRange
  },

  @readOnly
  @computed('_registeredAxes')
  _xTicks (_registeredAxes) {
    const horizontalAxis = _registeredAxes.findBy('vertical', false)

    if (horizontalAxis) {
      return get(horizontalAxis, 'ticks')
    } else {
      return 0
    }
  },

  @readOnly
  @computed('_canvasHeight')
  _yRange (height) {
    const yRange = this.get('yRange')
    if (isEmpty(yRange) && height) {
      return [height, 0]
    }
    return yRange
  },

  @readOnly
  @computed('_registeredAxes')
  _yTicks (_registeredAxes) {
    const verticalAxis = _registeredAxes.findBy('vertical', true)

    if (verticalAxis) {
      return get(verticalAxis, 'ticks')
    } else {
      return 0
    }
  },

  // == Functions =============================================================

  _onResize () {
    this.get('_resizeTask').perform()
  },

  _setup () {
    this.get('resizeDetector').setup(
      this.$(),
      this.get('_onResize').bind(this)
    )
  },

  _setupChart () {
    const $el = this.$()
    this.setProperties({
      _chartHeight: $el.height(),
      _chartPadding: {
        top: parseFloat($el.css('padding-top')),
        right: parseFloat($el.css('padding-right')),
        bottom: parseFloat($el.css('padding-bottom')),
        left: parseFloat($el.css('padding-left'))
      },
      _chartWidth: $el.width(),
      _initializedChart: true
    })
  },

  _teardown () {
    this.get('resizeDetector').teardown(this.$(), this.get('_onResize').bind(this))
  },

  // == Tasks =================================================================

  _resizeTask: task(function * () {
    yield timeout(1000 / 60) // 60FPS
    this.setProperties({
      _chartHeight: this.$().height(),
      _chartWidth: this.$().width()
    })
  }).keepLatest(),

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  didInsertElement () {
    this._super(...arguments)
    run.scheduleOnce('afterRender', this, this._setup)
    run.scheduleOnce('sync', this, this._setupChart)
  },

  willDestroyElement () {
    this._teardown()
    this._super(...arguments)
  },

  // == Actions ===============================================================

  actions: {
    _didRenderAxis ({align, firstTickMargin, height, margin, width}) {
      const _renderedAxes = this.get('_renderedAxes') + 1
      const _initializedAxes = _renderedAxes === this.get('_registeredAxes.length')
      if (align === 'top' || align === 'bottom') {
        this.setProperties({
          _renderedAxes,
          _initializedAxes,
          _xAxisGutter: {
            align,
            margin,
            height
          }
        })
      } else {
        this.setProperties({
          _renderedAxes,
          _initializedAxes,
          _yAxisGutter: {
            align,
            firstTickMargin,
            margin,
            width
          }
        })
      }
    },

    _registerAxis (axis) {
      this.get('_registeredAxes').addObject(axis)
    }
  }
})
