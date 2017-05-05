import Ember from 'ember'
const {Helper} = Ember

export function toFixed ([number, digits]) {
  return Number(number).toFixed(digits)
}

export default Helper.helper(toFixed)
