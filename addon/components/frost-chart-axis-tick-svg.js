/**
 * Component definition for the frost-chart-axis-tick-svg component
 */

import Ember from 'ember'
const {String: EmberString, isNone, run} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  attributeBindings: ['transform'],
  tagName: 'g',

  // == PropTypes =============================================================

  propTypes: {
    // options
    axis: PropTypes.string.isRequired,
    coordinate: PropTypes.number

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
  @computed('coordinate')
  transform (coordinate) {
    if (isNone(coordinate)) {
      return EmberString.htmlSafe('')
    }

    // calc is added to align the middle of the tick with the location
    let x = 0
    let y = 0
    if (this.get('axis') === 'x') {
      x = coordinate
    } else {
      y = coordinate
    }

    return `translate(${x}, ${y})`
  },

  // == Functions =============================================================

  _dispatchRenderedTick () {
    this.dispatch({
      type: 'RENDERED_TICK',
      axis: this.get('axis'),
      tick: {
        height: this.$().outerHeight(true),
        width: this.$().outerWidth(true)
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
