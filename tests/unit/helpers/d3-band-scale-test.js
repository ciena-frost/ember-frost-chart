import {expect} from 'chai'
import {bandScale} from 'ember-frost-chart/helpers/d3-band-scale'
import {describe, it} from 'mocha'

describe('Unit | Helper | d3 band scale', function () {
  const scale = bandScale()
  const transform = scale({
    domain: ['One', 'Two', 'Three'],
    range: [0, 100]
  })

  it('should return a band scale function', function () {
    expect(typeof transform).to.equal('function')
  })

  it('should return mapped positions for ordinal items', function () {
    expect(transform('One')).to.equal(1)
    expect(transform('Two')).to.equal(36)
  })
})
