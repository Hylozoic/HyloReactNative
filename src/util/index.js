/**
 * @providesModule util/index
 */

export function isPromise (value) {
  return value && typeof value.then === 'function'
}
