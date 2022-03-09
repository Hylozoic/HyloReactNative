export const MODULE_NAME = 'LoadingModal'
export const SHOW_LOADING_MODAL = `${MODULE_NAME}/SHOW_LOADING_MODAL`

export const initialState = {
  shouldDisplay: false
}

export default function reducer (state = initialState, action) {
  const { type, payload } = action
  if (type === SHOW_LOADING_MODAL) {
    return {
      ...state,
      shouldDisplay: payload
    }
  }
  return state
}

export function showLoadingModal (shouldDisplay) {
  return {
    type: SHOW_LOADING_MODAL,
    payload: shouldDisplay
  }
}

export function getShouldDisplay (state) {
  return state[MODULE_NAME].shouldDisplay
}
