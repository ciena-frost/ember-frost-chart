import {scaleLinear} from 'd3-scale'
import Ember from 'ember'
const {Helper} = Ember

export function linearScale () {
  return function ({domain, range}) {
    return scaleLinear().domain(domain).range(range)
  }
}

export default Helper.helper(linearScale)
