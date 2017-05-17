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
    // required
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,

    // options
    direction: PropTypes.oneOf(['clockwise', 'counterclockwise']),
    orientation: PropTypes.number,
    text: PropTypes.string
  },

  getDefaultProps () {
    return {
      data: [],
      direction: 'clockwise',
      orientation: 0,
      max: 100,
      min: 0,
      size: 150,

      _padding: 10
    }
  },

  initialize () {
    return {
      data: []
    }
  },
  // == Computed Properties ===================================================

  @readOnly
  @computed('orientation', 'direction')
  arcs (orientation, direction) {
    const circumference = this.get('circumference')
    const max = parseInt(this.get('max'), 10)
    const min = parseInt(this.get('min'), 10)
    let rotationOffset = 0
    const newData = this.get('data')
    const transformList = newData.map((item, index) => {
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
  @computed('radius')
  diameter (radius) {
    return radius * 2
  },

  /*
    Potential future enhancements to show % of guage filled up by default if no text is provided
  */
  @readOnly
  @computed('text')
  displayText (text) {
    if (isPresent(text)) {
      return Ember.String.htmlSafe(text)
    }
    return ''
  },

  @readOnly
  @computed('direction')
  numericalDirection (direction) {
    return (direction === 'counterclockwise') ? directions.COUNTERCLOCKWISE : directions.CLOCKWISE
  },

  @readOnly
  @computed('size')
  radius (size) {
    return (parseInt(size, 10) - this.get('_padding') * 2) / 2
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
    const rotation = `rotate(${orientation + orientationOffset - 90} ${center} ${center}`
    const scale = this.get('transformScale')
    let translate = ''
    if (directions.COUNTERCLOCKWISE === direction) {
      translate = `translate(${size}, 0)`
    }
    return `${translate} ${scale} ${rotation})`
  }
})
