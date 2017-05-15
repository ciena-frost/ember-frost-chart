import Ember from 'ember'
const {isPresent} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'
import layout from '../templates/components/frost-guage'

function getPercent (max, min, value) {
  let valInt = parseInt(value, 10)
  let maxInt = parseInt(max, 10)
  let minInt = parseInt(min, 10)
  let val = Math.min(Math.max(minInt, valInt), maxInt)
  return ((val) / max)
}

export default Component.extend({
  layout,
  attributeBindings: ['style'],

  propTypes: {
    // options
    elementPrefix: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    direction: PropTypes.oneOf(['clockwise', 'counterclockwise']),
    orientation: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    size: PropTypes.number,
    text: PropTypes.string
  },

  getDefaultProps () {
    const elementPrefix = 'frost-guage'

    return {
      elementPrefix: elementPrefix,
      classNames: [elementPrefix],
      min: 0,
      max: 100,
      direction: 'clockwise',
      // will move scale to propTypes once it's required. Consider it unsupported for now.
      scale: 0,
      orientation: 0,
      negative: '#000000',
      padding: 10
    }
  },

  @readOnly
  @computed('direction')
  numericalDirection (direction) {
    return (direction === 'counterclockwise') ? -1 : 1
  },

  @readOnly
  @computed('size')
  style (size) {
    return Ember.String.htmlSafe('width: ' + size + 'px; height: ' + size + 'px;')
  },

  @readOnly
  @computed('orientation', 'numericalDirection')
  transform (orientation, numericalDirection) {
    const d = parseInt(numericalDirection, 10)
    const s = parseInt(this.get('size'), 10)
    const o = orientation
    const c = this.get('center')
    const rotation = `rotate(${o - 90} ${c} ${c}`
    const scale = `scale(${numericalDirection}, 1)`
    let translate = ''
    if (d === -1) {
      translate = `translate(${s}, 0)`
    }
    return `${translate} ${scale} ${rotation})`
  },

  @readOnly
  @computed('size')
  center (size) {
    return size / 2
  },

  @readOnly
  @computed('size')
  radius (size) {
    return (parseInt(size, 10) - this.get('padding') * 2) / 2
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

  @readOnly
  @computed('orientation', 'numericalDirection')
  arcs (orientation, numericalDirection) {
    let transformList = []
    let rotationOffset = 0

    this.get('data').forEach((data) => {
      let percent = getPercent(this.get('max'), this.get('min'), data.value)
      let arcValue = (1 - percent) * this.get('circumference')
      let transform = this.getTransform(rotationOffset)
      let object = Ember.Object.create({
        transform: transform,
        offset: arcValue,
        color: data.color,
        label: data.label,
        classes: data.classes
      })
      transformList.push(object)
      rotationOffset += Math.floor(360 * percent)
    })
    return transformList
  },

  @readOnly
  @computed('size', 'scale', 'orientation')
  ticks (size, scale, orientation) {
    const grade = scale
    const qty = Math.floor(this.get('max') / grade)
    const orient = size / 2
    const c = this.get('center')
    const r = this.get('radius')
    let rotation
    let ticks = []
    let x = 0
    let label
    while (x < qty) {
      rotation = (360 / qty * x) + orientation
      label = Math.floor(this.get('max') / qty * x)
      ticks.push({
        x1: size / 2,
        y1: 0,
        x2: size / 2,
        y2: 20,
        labelX: c + (r + 25) * Math.cos((rotation + 90) * Math.PI / 180),
        labelY: c + (r + 15) * Math.sin((rotation + 90) * Math.PI / 180),
        label,
        rotation,
        orient
      })
      x++
    }
    return ticks
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
    return 'stuff'
  },

  getTransform (orientationOffset) {
    const d = parseInt(this.get('numericalDirection'), 10)
    const s = parseInt(this.get('size'), 10)
    const o = this.get('orientation')
    const c = this.get('center')
    const rotation = `rotate(${o + orientationOffset - 90} ${c} ${c}`
    const scale = `scale(${this.get('numericalDirection')}, 1)`
    let translate = ''
    if (d === -1) {
      translate = `translate(${s}, 0)`
    }
    return `${translate} ${scale} ${rotation})`
  }
})
