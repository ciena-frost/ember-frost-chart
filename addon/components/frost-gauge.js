import Ember from 'ember'
const {isPresent} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'
import layout from '../templates/components/frost-gauge'

const directions = {
  CLOCKWISE: 1,
  COUNTERCLOCKWISE: -1
}

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  attributeBindings: ['style'],
  layout,

  // == PropTypes =============================================================

  propTypes: {
    // Required
    data: PropTypes.arrayOf(PropTypes.object).isRequired,

    // Options
    direction: PropTypes.oneOf(['clockwise', 'counterclockwise']),
    max: PropTypes.number,
    min: PropTypes.number,
    negativeColor: PropTypes.string,
    negativeClass: PropTypes.string,
    negativeLabel: PropTypes.string,
    orientation: PropTypes.number,
    padding: PropTypes.number,
    size: PropTypes.number,
    text: PropTypes.string
  },

  getDefaultProps () {
    return {
      // Options
      direction: 'clockwise',
      min: 0,
      negativeColor: '#ffffff',
      negativeClass: 'negative-value',
      negativeLabel: '',
      orientation: 0,
      padding: 10,
      size: 150
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('orientation', 'direction', 'maxRange', 'negativeValue')
  arcs (orientation, direction, maxRange, negativeValue) {
    const circumference = this.get('circumference')
    const max = parseInt(maxRange, 10)
    const min = parseInt(this.get('min'), 10)
    let rotationOffset = 0
    const dataSlice = this.get('data').slice()
    if (isPresent(negativeValue)) {
      const negativeData = {
        value: this.get('negativeValue'),
        color: this.get('negativeColor'),
        class: this.get('negativeClass'),
        label: this.get('nevativeLabel')
      }
      dataSlice.push(negativeData)
    }
    const transformList = dataSlice.map((item, index) => {
      const value = parseInt(item.value, 10)
      const percent = this.getPercent(max, min, value)
      const offset = (1 - percent) * circumference
      const transform = this.getTransform(rotationOffset)
      rotationOffset += Math.floor(360 * percent)

      return Ember.Object.create({
        transform,
        offset,
        color: item.color,
        label: item.label,
        class: item.class
      })
    })
    return transformList
  },

  @readOnly
  @computed('size')
  center (size) {
    return size / 2
  },

  @readOnly
  @computed('diameter')
  circumference (diameter) {
    return diameter * Math.PI
  },

  @readOnly
  @computed('data.@each.value')
  dataValueTotal (data) {
    let dataValueTotal = 0
    data.forEach((item) => {
      dataValueTotal += item.value
    })
    return dataValueTotal
  },

  @readOnly
  @computed('radius')
  diameter (radius) {
    return radius * 2
  },

  @readOnly
  @computed('text')
  displayText (text) {
    if (isPresent(text)) {
      return Ember.String.htmlSafe(text)
    }
    return ''
  },

  @readOnly
  @computed('max', 'dataValueTotal')
  maxRange (max, dataValueTotal) {
    if (isPresent(this.get('max'))) {
      return this.get('max')
    }
    return dataValueTotal
  },

  @readOnly
  @computed('max', 'dataValueTotal')
  negativeValue (max, dataValueTotal) {
    if (isPresent(max)) {
      const _max = parseInt(max, 10)
      const _dataValueTotal = parseInt(dataValueTotal, 10)
      if (_dataValueTotal <= _max) {
        return _max - _dataValueTotal
      }
    }
    return null
  },

  @readOnly
  @computed('direction')
  numericalDirection (direction) {
    return (direction === 'counterclockwise') ? directions.COUNTERCLOCKWISE : directions.CLOCKWISE
  },

  @readOnly
  @computed('size')
  radius (size) {
    return (parseInt(size, 10) - this.get('padding') * 2) / 2
  },

  @readOnly
  @computed('size')
  style (size) {
    return Ember.String.htmlSafe(`width: ${size}px; height: ${size}px;`)
  },

  @readOnly
  @computed('numericalDirection')
  transformScale (numericalDirection) {
    return `scale(${this.get('numericalDirection')}, 1)`
  },

  // == Functions =============================================================

  /**
   * Gets a percent given a value with a minimum and maximum range
   * @param {number} max - The maximum value of the range
   * @param {number} min - The minimum value of the range
   * @param {number} value - The amount of the range used up
   * @returns {number} The percentage used up
   *
   */
  getPercent (max, min, value) {
    const val = Math.min(Math.max(min, value), max)
    return ((val) / max)
  },

  /**
   * Gets the transform for a circle given an orientation offset
   * @param {number} orientationOffset - The orientation offset for the circle
   * @returns {string} The transform for the html transform attribute on a circle
   */
  getTransform (orientationOffset) {
    const direction = this.get('numericalDirection')
    const size = this.get('size')
    const orientation = this.get('orientation')
    const center = this.get('center')
    const rotation = `rotate(${orientation + orientationOffset - 90} ${center} ${center})`
    const scale = this.get('transformScale')
    let translate = ''
    if (directions.COUNTERCLOCKWISE === direction) {
      translate = `translate(${size}, 0) `
    }
    return `${translate}${scale} ${rotation}`
  }
})
