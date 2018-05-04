import Ember from 'ember'
const {A, Helper, Object: EmberObject} = Ember

export function ordinalTicks () {
  return function (domain) {
    const _ticks = A()
    const numTicks = domain.length
    _ticks.addObjects(Array.from({length: numTicks}, (entry, index) => {
      const tick = domain[index]
      return EmberObject.create({
        index: index + 1,
        value: tick
      })
    }))

    return _ticks
  }
}

export default Helper.helper(ordinalTicks)
