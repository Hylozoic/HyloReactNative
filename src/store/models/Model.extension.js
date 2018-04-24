import { Model } from 'redux-orm'
import { ManyToMany } from 'redux-orm/lib/fields'
import { normalizeEntity } from 'redux-orm/lib/utils'
import { mapValues, uniq, isEmpty } from 'lodash'

Model.safeWithId = function (id) {
  return this.hasId(id) ? this.withId(id) : null
}

Model.safeGet = function (matchObj) {
  if (isEmpty(matchObj)) return null
  let result
  try {
    result = this.get(matchObj)
  } catch (e) {
    result = null
  }
  return result
}

Model.prototype.updateAppending = function (attrs) {
  return this.update(mapValues(attrs, (val, key) => {
    if (!val) return val
    const field = this.constructor.fields[key]
    if (!(field && field instanceof ManyToMany)) return val

    const existingIds = this[key].toRefArray().map(x => x.id)
    return uniq(existingIds.concat(val.map(normalizeEntity)))
  }))
}

Model.prototype.increment = function (attr, delta = 1) {
  return this.update({[attr]: (this[attr] || 0) + delta})
}
