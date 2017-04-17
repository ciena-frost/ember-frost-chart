/**
 * Helper definition for the linear-ticks helper
 *
 * Ticks are at the min/max of the domain with the rest of the ticks
 * divided evenly across the domain
 */
import Ember from 'ember'
const {A, Helper, Object: EmberObject} = Ember

export function linearTicks ([ticks]) {
  return function (domain) {
    const _ticks = A()
    _ticks.addObject(EmberObject.create({
      value: domain[0]
    }))

    _ticks.addObjects(Array.from({length: ticks - 1}, (entry, index) => {
      const percentage = (index + 1) / ticks
      const tick = (domain[1] - domain[0]) * percentage + domain[0]
      return EmberObject.create({
        value: tick
      })
    }))

    _ticks.addObject(EmberObject.create({
      value: domain[1]
    }))

    return _ticks
  }
}

export default Helper.helper(linearTicks)
