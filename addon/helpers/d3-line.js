/**
 * Helper definition for the d3-line helper
 */

import {path as d3Path} from 'd3-path'
import d3Shape from 'd3-shape'
import Ember from 'ember'
const {Helper, String: EmberString} = Ember

export function d3Line (params, {smooth='basis'}) {
  return function (points) {
    const path = d3Path()

    const basis = d3Shape[EmberString.camelize(`curve-${smooth}`)](path)
    basis.lineStart()
    points.forEach(point => {
      basis.point(point.x, point.y)
    })
    basis.lineEnd()

    return path.toString()
  }
}

export default Helper.helper(d3Line)
