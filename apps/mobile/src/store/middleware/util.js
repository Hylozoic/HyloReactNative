export function isPromise (value) {
  return value && typeof value.then === 'function'
}
