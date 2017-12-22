// The pending reducer:
//   - checks for _PENDING suffix,
//       adds the action to state.pending
//   - checks for CLEAR_ prefix used with _PENDING,
//       sets the action to `undefined` in state.pending
//   - if neither suffix nor prefix are present,
//       sets action to `null` in state.pending
// The distinction between `undefined` and `null` is slightly arbitrary,
// but it allows us to completely reset pending state (as opposed to just
// turning pending off between repeated queries). The alternative would be
// using `delete` or filtering, but it's slow.
export default function pending (state = {}, action) {
  const { type, meta } = action

  // Regexplanation: use matching groups instead of previous approach
  // (simple regex replace, then `.endsWith`). Groups are fairly
  // self-documenting in array destructure below.
  const match = /^(.+?\/)?(CLEAR_)?(.+?)(_PENDING)?$/.exec(type)
  if (!match) return state

  const [
    _,                                     // eslint-disable-line no-unused-vars
    moduleName,
    clearPrefix,
    originalType,
    pendingSuffix
  ] = match

  // Skip for special Redux actions
  if (originalType === '@@INIT' || moduleName === '@@redux/') return state
  const pendingType = moduleName ? `${moduleName}${originalType}` : originalType

  // Check pending here so actions like CLEAR_BIG_BUTTON don't get stomped on
  if (clearPrefix && pendingSuffix) {
    return {
      ...state,
      [pendingType]: undefined
    }
  }

  if (pendingSuffix) {
    return {
      ...state,
      [pendingType]: meta || true
    }
  }

  // No _PENDING action should make it this far, so we're officially not pending
  if (state[pendingType]) {
    return {
      ...state,
      [pendingType]: null
    }
  }

  return state
}
