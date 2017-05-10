/**
 * Helper definition for the range-bounded-area helper
 */

import {path} from 'd3-path'
import curves from 'd3-shape'
import Ember from 'ember'
const {Helper, String: EmberString} = Ember

export function rangeBoundedArea (params, {smooth = 'basis'}) {
  return function ({chartState, points, xRange, yRange}) {
    const _path = path()

    if (points.length >= 2) {
      const curve = curves[EmberString.camelize(`curve-${smooth}`)](_path)
      curve.lineStart()
      points.forEach(point => {
        curve.point(point.x, point.y)
      })
      curve.lineEnd()

      const firstPoint = points[0]
      const lastPoint = points[points.length - 1]
      _path.lineTo(lastPoint.x, yRange[0])
      _path.lineTo(firstPoint.x, yRange[0])
      _path.lineTo(firstPoint.x, firstPoint.y)
    }

    return _path.toString()
  }
}

export default Helper.helper(rangeBoundedArea)
