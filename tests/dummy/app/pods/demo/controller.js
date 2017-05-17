import Ember from 'ember'
const {A, Controller} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {clamp, extent} from 'ember-frost-chart'

const POINTS = 100
const POINT_LOW = 0
const POINT_HIGH = 100

export default Controller.extend({

  // == Computed Properties ===================================================

  @readOnly
  @computed()
  data () {
    const data = A(Array.from({length: POINTS}, () => {
      return {
        x: (Math.floor(Math.random() * (POINT_HIGH - POINT_LOW + 1)) + POINT_LOW),
        y: (Math.floor(Math.random() * (POINT_HIGH - POINT_LOW + 1)) + POINT_LOW)
      }
    }))
    data.addObjects([
      {x: 0, y: 0},
      {x: 0, y: 100},
      {x: 100, y: 0},
      {x: 100, y: 100}
    ])
    return data
  },

  @readOnly
  @computed('data.[]')
  boundingData (data) {
    return data.map((entry) => {
      return {
        x: entry.x,
        y: clamp(entry.y - 10, {min: 0})
      }
    })
  },

  @readOnly
  @computed('data')
  xDomain (data) {
    return extent(data.mapBy('x'))
  },

  @readOnly
  @computed('data')
  yDomain (data) {
    return extent(data.mapBy('y'))
  },

  arcData: [
    {
      value: 10,
      color: '#00aaff',
      label: 'not implemented yet',
      class: 'first'
    },
    {
      value: 30,
      color: '#00ddff',
      class: 'second'
    },
    {
      value: 10,
      color: '#00bbdd',
      class: 'third'
    },
    {
      value: 25,
      color: '#0088aa',
      class: 'fourth'
    },
    {
      value: 15,
      color: '#003366',
      class: 'fifth'
    },
    {
      value: 10,
      color: '#ffffff',
      class: 'sixth'
    }
  ]
})
