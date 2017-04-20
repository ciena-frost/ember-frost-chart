/**
 * Helper definition for the extent util
 */

import Ember from 'ember'
const {isEmpty} = Ember

export default function extent (data) {
  return data.reduce((domain, entry) => {
    if (isEmpty(domain)) {
      return [entry, entry]
    }

    const [low, high] = domain
    return [
      entry < low ? entry : low,
      entry > high ? entry : high
    ]
  }, [])
}
