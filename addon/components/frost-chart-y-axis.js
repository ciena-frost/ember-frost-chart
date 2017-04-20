 /**
  * Component definition for the frost-chart-y-axis component
  */

 import Ember from 'ember'
 const {A, Object: EmberObject, String: EmberString, assign, get, isEmpty, run} = Ember
 import {PropTypes} from 'ember-prop-types'
 import computed, {readOnly} from 'ember-computed-decorators'
 import {Component} from 'ember-frost-core'

 import layout from '../templates/components/frost-chart-y-axis'
 import {linearTicks} from '../helpers/linear-ticks'

 export default Component.extend({

   // == Dependencies ==========================================================

   // == Keyword Properties ====================================================

   attributeBindings: ['style'],
   classNameBindings: ['alignment'],
   layout,

   // == PropTypes =============================================================

   propTypes: {
     // options
     alignment: PropTypes.oneOf(['left', 'right']),
     label: PropTypes.string,
     ticks: PropTypes.func,

     chartState: PropTypes.EmberObject.isRequired,
     dispatch: PropTypes.func.isRequired

     // state
   },

   getDefaultProps () {
     return {
       // options
       aligment: 'left',
       label: null,
       ticks: linearTicks([10]),

       // state
       _axis: 'y'
     }
   },

   // == Computed Properties ===================================================

   @readOnly
   @computed('chartState.chart.initialized', 'chartState.domain.y')
   _ticks (initialized, domain) {
     if (!initialized) {
       return []
     }

     return this.ticks(domain).reverse()
   },

   @readOnly
   @computed('_ticks', 'chartState.range.y')
   _positionedTicks (ticks, range) {
     if (!range) {
       return ticks
     }

     const scale = this.get('chartState.scale.y')
     const domain = this.get('chartState.domain.y')
     const transform = scale({domain, range})

     return ticks.map(tick => {
       return assign({}, tick, {
         coordinate: transform(get(tick, 'value'))
       })
     })
   },

   @readOnly
   @computed('chartState.axes.initialized', 'chartState.chart.height')
   style (initializedAxes, chartHeight) {
     if (!initializedAxes || !chartHeight) {
       return ''
     }

     const chartPadding = this.get('chartState.chart.padding')
     const xAxisAlignment = this.get('chartState.axes.x.alignment')
     const xAxisHeight = this.get('chartState.axes.x.height')
     const yAxisAlignment = this.get('chartState.axes.y.alignment')
     const yAxisFirstTickMargin = this.get('chartState.axes.y.firstTickMargin')
     const yAxisLastTickMargin = this.get('chartState.axes.y.lastTickMargin')

     // TODO I believe we're missing the padding calculation for the opposing direction (e.g. right)
     // TODO We may also have an issue when only one axis is present (see margin calcs)
     return EmberString.htmlSafe(`
       ${yAxisAlignment}: ${get(chartPadding, yAxisAlignment)}px;
       height: calc(${chartHeight}px - ${xAxisHeight}px - ${yAxisFirstTickMargin}px - ${yAxisLastTickMargin}px);
       margin-top: calc(${xAxisAlignment === 'top' ? xAxisHeight : 0}px + ${yAxisFirstTickMargin}px);
       margin-bottom: calc(${xAxisAlignment === 'bottom' ? xAxisHeight : 0}px + ${yAxisLastTickMargin}px);
     `)
   },

   // == Functions =============================================================

   _dispatchRenderedAxis () {
     this.dispatch({
       type: 'RENDERED_Y_AXIS',
       axis: {
         alignment: this.get('alignment'),
         height: this.$().outerHeight(true),
         ticks: this.get('_ticks'),
         width: this.$().outerWidth(true)
       }
     })
   },

   // == DOM Events ============================================================

   // == Lifecycle Hooks =======================================================

   init () {
     this._super(...arguments)
     this.attrs.dispatch({
       type: 'REGISTER_AXIS'
     })
   },

   didInsertElement () {
     this._super(...arguments)
     run.scheduleOnce('afterRender', this, this._dispatchRenderedAxis)
   }

   // == Actions ===============================================================

})
