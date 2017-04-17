/**
 * Component definition for the frost-chart-axis-tick component
 */

import Ember from 'ember'
const {String: EmberString, isNone, run} = Ember
import {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'

import layout from '../templates/components/frost-chart-axis-tick'

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  attributeBindings: ['style'],
  layout,

  // == PropTypes =============================================================

  /**
   * Properties for this component. Options are expected to be (potentially)
   * passed in to the component. State properties are *not* expected to be
   * passed in/overwritten.
   */
  propTypes: {
    // options

    // state
  },

  /** @returns {Object} the default property values when not provided by consumer */
  getDefaultProps () {
    return {
      // options

      // state
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('coordinate')
  style (coordinate) {
    if (isNone(coordinate)) {
      return
    }

    // calc is added to align the middle of the tick with the location
    if (this.get('isVertical')) {
      return EmberString.htmlSafe(`
        position: absolute;
        top: calc(${coordinate}px - ${this.$().outerHeight()}px / 2);
      `)
    } else {
      return EmberString.htmlSafe(`
        position: absolute;
        left: calc(${coordinate}px - ${this.$().outerWidth()}px / 2);
      `)
    }
  },

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  didInsertElement () {
    this._super(...arguments)
    run.scheduleOnce('afterRender', this, () => this._didRender({
      height: this.$().outerHeight(true),
      width: this.$().outerWidth(true)
    }))
  },

  // == Actions ===============================================================

  actions: {
  }
})
