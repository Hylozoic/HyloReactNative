/**
 * @providesModule util/index
 */

import { last, some, eq, omitBy } from 'lodash'

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

/**
 * Useful for testing if props have changed in React.Components shouldComponentUpdate
 * method.  You should use React.PureComponent if possible, but if you can't (like if you want to
 * use react-navigations nextProps.isFocused, you can use this to prevent further updates.
 *
 * @param props
 * @param nextProps
 * @returns {*}
 */
export function propsChanged (props, nextProps) {
  const isDiff = some(nextProps, (value, key) => !eq(props[key], value))

  // For Debugging differences
  if (isDiff) console.log(`***** CHANGED PROPS ******`, omitBy(nextProps, (value, key) => eq(props[key], value)))

  return isDiff
}
