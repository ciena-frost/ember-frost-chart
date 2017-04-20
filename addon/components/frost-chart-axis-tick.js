/**
 * Component definition for the frost-chart-axis-tick component
 */

import Ember from 'ember'
const {String: EmberString, isNone, run} = Ember
import {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  attributeBindings: ['style'],

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
  style (coordinate) {
    if (isNone(coordinate)) {
      return ''
    }

    // calc is added to align the middle of the tick with the location
    if (this.get('axis') === 'x') {
      return EmberString.htmlSafe(`
        position: absolute;
        left: calc(${coordinate}px - ${this.$().outerWidth()}px / 2);
      `)
    } else {
      return EmberString.htmlSafe(`
        position: absolute;
        top: calc(${coordinate}px - ${this.$().outerHeight()}px / 2);
      `)
    }
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
