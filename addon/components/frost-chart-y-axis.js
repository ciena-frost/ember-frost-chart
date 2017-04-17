/**
 * Component definition for the frost-chart-y-axis component
 */

 /**
  * Component definition for the frost-chart-x-axis component
  */

 import Ember from 'ember'
 const {A, Object: EmberObject, String: EmberString, get, isEmpty} = Ember
 import {PropTypes} from 'ember-prop-types'
 import computed, {readOnly} from 'ember-computed-decorators'
 import {Component} from 'ember-frost-core'

 import layout from '../templates/components/frost-chart-axis'
 import {linearTicks} from '../helpers/linear-ticks'

 export default Component.extend({
   // == Dependencies ==========================================================

   // == Keyword Properties ====================================================

   attributeBindings: ['style'],
   classNameBindings: ['align'],
   layout,

   // == PropTypes =============================================================

   propTypes: {
     // options
     label: PropTypes.string,
     ticks: PropTypes.func

     // state
   },

   getDefaultProps () {
     return {
       // options
       ticks: linearTicks([10]),

       // state
       _chartHeight: null,
       _isVertical: true,
       _renderedTicks: A()
     }
   },

   // == Computed Properties ===================================================

   @readOnly
   @computed('initializedChart', 'domain')
   _ticks (initializedChart, domain) {
     if (!initializedChart) {
       return []
     }

     return this.ticks(domain).reverse()
   },

   @readOnly
   @computed('chartHeight', 'chartPadding', '_gutter')
   style (chartHeight, chartPadding, _gutter) {
     const gutter = _gutter ? _gutter.height : 0
     const gutterAlign = _gutter ? _gutter.align : 'bottom'
     const _renderedTicks = this.get('_renderedTicks')
     let tickMargin = 0
     let firstTickMargin = 0
     if (!isEmpty(this.get('_ticks')) && _renderedTicks.length === this.get('_ticks.length')) {
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
     this.register({
       axis: 'y',
       ticks: this.get('_ticks'),
     })
   },

   // == Actions ===============================================================

   actions: {
     _didRenderTick ({height, width}) {
       const _renderedTicks = this.get('_renderedTicks').addObject({height, width})
       if (!isEmpty(this.get('_ticks')) && _renderedTicks.length === this.get('_ticks.length')) {
         const firstTick = _renderedTicks.get('firstObject')
         const lastTick = _renderedTicks.get('lastObject')
         const tickMargin = get(firstTick, 'height') / 2 + get(lastTick, 'height') / 2
         this._didRender({
           align: this.get('align'),
           firstTickMargin: get(firstTick, 'height') / 2,
           height: this.$().outerHeight(true),
           margin: tickMargin,
           ticks: this.get('_ticks.length'),
           width: this.$().outerWidth(true)
         })
       } else {
         this.set('_renderedTicks', _renderedTicks)
       }
     }
   }
})
