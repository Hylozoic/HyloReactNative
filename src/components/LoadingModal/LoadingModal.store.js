export const MODULE_NAME = 'LoadingModal'
export const SET_LOADING_MODAL = `${MODULE_NAME}/SET_LOADING_MODAL`

export const defaultState = {
  display: false
}

export default function reducer (state = defaultState, action) {
  const { type, payload } = action
  if (type === SET_LOADING_MODAL) {
    return {
      ...state,
      display: payload
    }
  }
  return state
}

export function setLoadingModal (display) {
  return {
    type: SET_LOADING_MODAL,
    payload: display
  }
}

export function getDisplay (state) {
  return state[MODULE_NAME].display
}
