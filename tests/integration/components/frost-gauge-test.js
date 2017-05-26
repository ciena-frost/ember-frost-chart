import {expect} from 'chai'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {describe, it} from 'mocha'

const test = integration('frost-gauge')

describe(test.label, function () {
  test.setup()

  it('renders arc data and text', function () {
    const data = [
      {
        value: 10,
        color: '#00aaff',
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

    this.setProperties({
      data
    })

    this.render(hbs`
      {{frost-gauge
        hook='myGauge'
        orientation=0
        direction='clockwise'
        data=data
        text='My Gauge'}}
    `)

    expect(this.$('.frost-gauge-fill').length).to.eql(data.length)

    expect(this.$('.frost-gauge-text').html()).to.eql('My Gauge')
  })

  it('all data with value 0', function () {
    const data = [
      {
        value: 0,
        color: '#00aaff',
        class: 'first'
      },
      {
        value: 0,
        color: '#00ddff',
        class: 'second'
      }
    ]

    this.setProperties({
      data
    })

    this.render(hbs`
      {{frost-gauge
        hook='myGauge'
        orientation=0
        direction='clockwise'
        data=data
        text='My Gauge'}}
    `)

    expect(this.$('.frost-gauge-fill').length).to.eql(0)

    expect(this.$('.frost-gauge-text').html()).to.eql('My Gauge')
  })
})
