import Ember from 'ember'
const {Logger, isPresent} = Ember

/* eslint-disable complexity */
function isDomainValid (domain) {
  if (!domain) {
    return false
  }

  const [min, max] = domain
  const isValid = isPresent(min) && !isNaN(min) && isPresent(max) && !isNaN(max)
  if (!isValid) {
    Logger.debug(`Invalid domain: [${min}, ${max}]`)
  }

  return isValid
}
/* eslint-enable complexity */

export {isDomainValid}
