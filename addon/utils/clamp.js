/**
 * Helper definition for the clamp util
 */

export default function clamp (value, {max, min}) {
  if (min && value < min) {
    return min
  } else if (max && value > max) {
    return max
  }
  return value
}
