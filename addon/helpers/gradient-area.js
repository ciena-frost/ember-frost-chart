/**
 * Helper definition for the gradient-area helper
 */

import {path as d3Path} from 'd3-path'
import Ember from 'ember'
const {Helper} = Ember

export function gradientArea (params, {smooth = 'natural'}) {
  return function (params) {
    const _path = d3Path()
    const minX = Math.min.apply(Math, params.points.map(function (point) { return point.x }))
    const maxX = Math.max.apply(Math, params.points.map(function (point) { return point.x }))

    _path.moveTo(minX, params.yRange[0])

    params.points.forEach((point, index) => {
      _path.lineTo(point.x, point.y)
    })

    _path.lineTo(maxX, params.yRange[0])
    return _path.toString()
  }
}

export default Helper.helper(gradientArea)
