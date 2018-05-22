/**
 * @providesModule util/index
 */

import { last, some, eq } from 'lodash'

export function isPromise (value) {
  return value && typeof value.then === 'function'
}

export function safeStringify (obj, space) {
  let cache = []

  const stringified = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        return 'removed circular reference'
      }
      cache.push(value)
    }
    return value
  }, space)
  cache = null

  return stringified
}

// remove circular references
export function noncircular (obj) {
  if (typeof obj !== 'object') return obj
  return JSON.parse(safeStringify(obj))
}

export function basename (url) {
  return last(url.split('/'))
}

export function propsChanged (props, nextProps) {
  return some(nextProps, (value, key) => !eq(props[key], value))
}
