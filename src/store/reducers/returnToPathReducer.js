import { isEmpty } from 'lodash/fp'
import { LOGOUT, SET_RETURN_TO_PATH } from 'store/constants'

export const initialState = null

export default function returnToPathReducer (state = initialState, { type, payload }) {
  switch (type) {
    case SET_RETURN_TO_PATH: {
      return isEmpty(payload.returnToPath)
        ? null
        : payload.returnToPath
    }

    // Handles the case the of logout action firing and then NonAuthLayout capturing
    // the current auth'd URL as the `returnToPath`. There may be a better way to handle
    // this, but this works for now.
    case LOGOUT: {
      return null
    }
  }

  return state
}
