import Ember from 'ember'
const {isPresent} = Ember

function isDomainValid (domain) {
  if (!domain) {
    return false
  }

  const [min, max] = domain
  return isPresent(min) && !isNaN(min) && isPresent(max) && !isNaN(max)
}

export {isDomainValid}
