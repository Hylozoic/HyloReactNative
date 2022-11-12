import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { createSelectorCreator, defaultMemoize } from 'reselect'
import { get, isEmpty, size, eq } from 'lodash/fp'
import { some } from 'lodash'

// The selectors below are designed to be performant for the FeedList.

// Factory method so each instance can have its own selector, thus allowing shared selectors across multiple components.
// @see https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances
export const makeGetPost = () => {
  const _getPost = ormCreateSelector(
    orm,
    (state, props) => props.id,
    ({ Post }, id) => {
      return Post.safeGet({ id })
    }
  )
  return _getPost
}

// A minor performance boost to return a reference to an empty array instead of a new reference.  This avoids rerenders down the chain.
const emptyArray = []

// Checks if any element in arr2 is different (by reference)
// This is ONLY useful if you are return a `toRefArray` from an ormCreateSelector.
const isRefArrayEqual = (arr1, arr2) => {
  if (arr1 === arr2) return true
  if (size(arr1) !== size(arr2)) return false
  if (isEmpty(arr1) && isEmpty(arr2)) return true

  return !some(arr1, (value, index) => !eq(arr2[index], value))
}

// Wraps a refArray selector so that it returns the same array reference if all references within the array are equal.
const createArrayRefEqualSelector = createSelectorCreator(
  defaultMemoize,
  isRefArrayEqual
)

const makeArrayRefEqualSelector = arrayRefSelector => createArrayRefEqualSelector(
  arrayRefSelector,
  arr => arr
)

export const makeGetPostCommenters = () => {
  return makeArrayRefEqualSelector(ormCreateSelector(
    orm,
    (state, props) => props.id,
    ({ Post }, id) => Post.safeGet({ id }).commenters.toRefArray()
  ))
}

export const makeGetPostGroups = () => {
  return makeArrayRefEqualSelector(ormCreateSelector(
    orm,
    (state, props) => props.id,
    ({ Post }, id) => Post.safeGet({ id }).groups.toRefArray()
  ))
}

export const makeGetPostTopics = () => {
  return makeArrayRefEqualSelector(ormCreateSelector(
    orm,
    (state, props) => props.id,
    ({ Post }, id) => Post.safeGet({ id }).topics.toRefArray()
  ))
}

export const makeGetPostImageUrls = () => {
  const selector = ormCreateSelector(
    orm,
    (state, props) => props.id,
    ({ Post }, id) => Post.safeGet({ id }).images().orderBy(get('position')).toRefArray()
  )
  return createArrayRefEqualSelector(
    selector,
    arr => isEmpty(arr) ? emptyArray : arr.map(x => x.url)
  )
}

export const makeGetPostFileUrls = () => {
  const selector = ormCreateSelector(
    orm,
    (state, props) => props.id,
    ({ Post }, id) => Post.safeGet({ id }).files().orderBy(get('position')).toRefArray()
  )
  return createArrayRefEqualSelector(
    selector,
    arr => isEmpty(arr) ? emptyArray : arr.map(x => x.url)
  )
}

export const makeGetPostIsPinned = () => {
  return ormCreateSelector(
    orm,
    (state, props) => props.id,
    (state, props) => props.groupId,
    ({ Post }, id, groupId) => {
      const postMembership = Post.safeGet({ id }).postMemberships.filter(p =>
        Number(p.group) === Number(groupId)).toRefArray()[0]
      return postMembership && !!postMembership.pinned
    }
  )
}

export const makeGetPostCreator = () => {
  return ormCreateSelector(
    orm,
    (state, props) => props.id,
    ({ Post }, id) => Post.safeGet({ id }).creator.ref
  )
}
