/**
 * Helper definition for the range-bounded-area helper
 */

import {path} from 'd3-path'
import curves from 'd3-shape'
import Ember from 'ember'
const {Helper, String: EmberString} = Ember

export function rangeBoundedArea ({smooth = 'basis'}) {
  return function ({chartState, points, xRange, yRange}) {
    const _path = path()

    const curve = curves[EmberString.camelize(`curve-${smooth}`)](_path)
    curve.lineStart()
    points.forEach(point => {
      curve.point(point.x, point.y)
    })
    curve.lineEnd()

    _path.lineTo(xRange[1], yRange[0])
    _path.lineTo(xRange[0], yRange[0])
    _path.lineTo(points[0].x, points[0].y)

    return _path.toString()
  }
}

export default Helper.helper(rangeBoundedArea)
