/**
 * Helper definition for the d3-band-scale helper
 */
import {scaleBand} from 'd3-scale'
import Ember from 'ember'
const {Helper} = Ember

export function bandScale () {
  return function ({domain, range}) {
    return scaleBand().domain(domain).rangeRound(range).paddingInner(0.2)
  }
}

export default Helper.helper(bandScale)
