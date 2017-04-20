/**
 * Helper definition for the line-bounded-area helper
 */

import {path as d3path} from 'd3-path'
import curves from 'd3-shape'
import Ember from 'ember'
const {Helper, String: EmberString, get} = Ember

export function lineBoundedArea ({smooth = 'basis', x = 'x', y = 'y'}) {
  return function ({boundingData, points, xRange, xTransform, yRange, yTransform}) {
    // Create the path
    const _path = d3path()

    // Set the points of the curve
    const curve = curves[EmberString.camelize(`curve-${smooth}`)](_path)
    curve.lineStart()
    points.forEach(point => {
      curve.point(point.x, point.y)
    })
    curve.lineEnd()

    const boundingPoints = boundingData.map(entry => {
      return {
        x: xTransform(get(entry, x)),
        y: yTransform(get(entry, y))
      }
    }).reverse()

    _path.lineTo(boundingPoints[0].x, boundingPoints[0].y)

    curve.lineStart()
    boundingPoints.forEach(point => {
      curve.point(point.x, point.y)
    })
    curve.lineEnd()

    _path.lineTo(points[0].x, points[0].y)

    return _path.toString()
  }
}

export default Helper.helper(lineBoundedArea)
