import {expect} from 'chai'
import {$hook} from 'ember-hook'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

const test = integration('frost-chart-svg-plot-stacked-bar')

describe(test.label, function () {
  test.setup()

  const data = [
    {category: 'Thing One', a: 1, b: 2, c: 3},
    {category: 'Thing Two', a: 3, b: 2, c: 1}
  ]
  const xDomain = ['Thing One', 'Thing Two']
  const yDomain = [0, 6]

  beforeEach(function () {
    this.setProperties({
      data,
      xDomain,
      yDomain
    })

    this.render(hbs`
      <style>
        .test-chart {
          height: 400px;
        }
      </style>

      {{#frost-chart
        class='test-chart'
        hook='test-chart'
        xDomain=xDomain
        yDomain=yDomain
        xScale=(d3-band-scale)
        as |chart|
      }}
        {{chart.x-axis label='Test Stacked Bar' ticks=(ordinal-ticks)}}

        {{#chart.y-axis ticks=(linear-ticks 6) as |tick|}}
          {{to-fixed tick 0}}
        {{/chart.y-axis}}

        {{#chart.svg as |plot|}}
          {{plot.y-grid}}

          {{#plot.stacked-bar
            data=data
            x='category'
            y='y'
            seriesKeys=(array 'a' 'b' 'c')
            as |bar|
          }}
            <rect x={{bar.x}} y={{bar.y}} width={{bar.width}} height={{bar.height}} fill={{bar.color}} />
          {{/plot.stacked-bar}}
        {{/chart.svg}}
      {{/frost-chart}}
    `)
  })

  it('should render', function () {
    expect($hook('test-chart').length).to.equal(1)
  })

  describe('x-axis', function () {
    it('should have x-axis', function () {
      expect($hook('test-chart-xAxis').length).to.equal(1)
    })

    it('should have correct tick labels', function () {
      expect($hook('test-chart-xAxis-tick', {index: 1}).text().trim()).to.equal('Thing One')
      expect($hook('test-chart-xAxis-tick', {index: 2}).text().trim()).to.equal('Thing Two')
    })

    it('should have correct ordinal tick labels after domain change', function () {
      this.set('xDomain', ['New Thing'])
      expect($hook('test-chart-xAxis-tick', {index: 1}).text().trim()).to.equal('New Thing')
    })
  })

  describe('y-axis', function () {
    it('should have y-axis', function () {
      expect($hook('test-chart-yAxis').length).to.equal(1)
    })

    it('should have correct tick labels', function () {
      const result = $hook('test-chart-yAxis-tick').toArray().map((el) => {
        return el.innerText
      })
      expect(result).to.eql(['6', '5', '4', '3', '2', '1', '0'])
    })
  })

  describe('bars', function () {
    it('should show correct number of bars', function () {
      expect($hook('test-chart-svg-stacked-bar').find('rect').length).to.equal(6)
    })

    it('should redraw correct number of bars after data change', function () {
      this.set('data', [
        {category: 'Thing One', a: 1, b: 2, c: 3}
      ])
      expect($hook('test-chart-svg-stacked-bar').find('rect').length).to.equal(3)
    })
  })
})
