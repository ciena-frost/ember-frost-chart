/**
 * Component definition for the frost-chart-axis-tick component
 */

import Ember from 'ember'
const {String: EmberString, isNone, run} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  attributeBindings: ['style'],

  // == PropTypes =============================================================

  propTypes: {
    // options
    axis: PropTypes.string.isRequired,
    coordinate: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    tickLabelsAboveTicks: PropTypes.bool

    // state
  },

  getDefaultProps () {
    return {
      // options
      coordinate: null

      // state
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('coordinate', 'width', 'height', 'tickLabelsAboveTicks')
  style (coordinate, width, height, tickLabelsAboveTicks) {
    if (isNone(coordinate)) {
      return EmberString.htmlSafe('')
    }

    // calc is added to align the middle of the tick with the location
    if (this.get('axis') === 'x') {
      return EmberString.htmlSafe(`
        position: absolute;
        left: calc(${coordinate}px - ${width}px / 2);
      `)
    } else {
      return EmberString.htmlSafe(`
        position: absolute;
        top: calc(${coordinate}px - ${tickLabelsAboveTicks ? height : height / 2}px);
      `)
    }
  },

  // == Functions =============================================================

  _dispatchRenderedTick () {
    const width = this.$().outerWidth()
    const height = this.$().outerHeight()

    this.setProperties({
      width,
      height
    })

    this.dispatch({
      type: 'RENDERED_TICK',
      axis: this.get('axis'),
      tick: {
        height,
        width
      }
    })
  },

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  didInsertElement () {
    this._super(...arguments)
    run.scheduleOnce('afterRender', this, this._dispatchRenderedTick)
  }

  // == Actions ===============================================================

})
