import { get } from 'lodash/fp'

const MODULE_NAME = 'DeepLinkHandler'
const STORE_NAVIGATION_ACTION = `${MODULE_NAME}/STORE_NAVIGATION_ACTION`

export function storeNavigationAction (payload) {
  return {type: STORE_NAVIGATION_ACTION, payload}
}

export default function reducer (state = {}, action) {
  const { payload, type, error } = action
  if (error) return state

  switch (type) {
    case STORE_NAVIGATION_ACTION:
      return {navigationAction: payload}
  }

  return state
}

export const getNavigationAction = get(`${MODULE_NAME}.navigationAction`)
