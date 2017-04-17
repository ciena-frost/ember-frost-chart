/**
 * Component definition for the frost-chart-svg-plot-scatter component
 */

import {path} from 'd3-path'
import curves from 'd3-shape'
import Ember from 'ember'
const {A, String: EmberString, get, isEmpty} = Ember
import {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'

import layout from '../templates/components/frost-chart-svg-plot-area'

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'g',

  // == PropTypes =============================================================

  propTypes: {
    // options
    smooth: PropTypes.string

    // state
  },

  getDefaultProps () {
    return {
      // options
      smooth: 'basis',

      // state
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('boundingData.[]', 'data.[]', 'initializing', 'x', 'xDomain', 'xRange', 'xScale', 'y', 'yDomain', 'yRange', 'yScale')
  _path (boundingData, data, initializing, x, xDomain, xRange, xScale, y, yDomain, yRange, yScale) {
    if (initializing) {
      return []
    }

    const xTransform = xScale({domain: xDomain, range: xRange})
    const yTransform = yScale({domain: yDomain, range: yRange})

    // Transform the data
    const points = A(data.map(entry => {
      return {
        x: xTransform(get(entry, x)),
        y: yTransform(get(entry, y))
      }
    }))

    // Create the path
    const _path = path()

    // Set the points of the curve
    const curve = curves[EmberString.camelize(`curve-${this.get('smooth')}`)](_path)
    curve.lineStart()
    points.forEach(point => {
      curve.point(point.x, point.y)
    })
    curve.lineEnd()

    // If there is bounding data, use it to form the remaining points
    // otherwise use the graph ranges
    if (isEmpty(boundingData)) {
      _path.lineTo(xRange[1], yRange[0])
      _path.lineTo(xRange[0], yRange[0])
      _path.lineTo(points[0].x, points[0].y)
    } else {
      const boundingPoints = boundingData.map(entry => {
        return {
          x: xTransform(get(entry, x)),
          y: yTransform(get(entry, y))
        }
      }).reverse()

      _path.lineTo(boundingPoints[0].x, boundingPoints[0].y)

      curve.lineStart()
      boundingPoints.forEach(point => {
        basis.point(point.x, point.y)
      })
      basis.lineEnd()

      _path.lineTo(points[0].x, points[0].y)
    }

    return _path.toString()
  },

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }

})
