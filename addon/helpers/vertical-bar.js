/**
 * Helper definition for the vertical-bar helper
 */
import Ember from 'ember'
const {Helper} = Ember

export function verticalBar () {
  return function ({data, x, y, xRange, xTransform, yRange, yTransform}) {
    return {
      height: yRange[0] - yTransform(y),
      width: (xRange[1] - xRange[0]) / data.length
    }
  }
}

export default Helper.helper(verticalBar)
