/**
 * Helper definition for the vertical-bar helper
 */
import Ember from 'ember'
const {Helper, isEmpty} = Ember

export function verticalBar () {
  return function ({data, x, y, xRange, xTransform, yRange, yTransform}) {
    if (!isEmpty(data)) {
      return {
        height: yRange[0] - yTransform(y),
        width: (xRange[1] - xRange[0]) / data.length
      }
    }
  }
}

export default Helper.helper(verticalBar)
