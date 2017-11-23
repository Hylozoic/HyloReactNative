import { get } from 'lodash/fp'

const MODULE_NAME = 'DeepLinkHandler'
const STORE_DEEP_LINK = `${MODULE_NAME}/STORE_DEEP_LINK`

export function storeDeepLink (navigationAction) {
  return {
    type: STORE_DEEP_LINK,
    payload: navigationAction
  }
}

export default function reducer (state = {}, action) {
  const { payload, type, error } = action
  if (error) return state

  switch (type) {
    case STORE_DEEP_LINK:
      return {
        deepLink: payload
      }
  }

  return state
}

export const getDeepLink = get('DeepLinkHandler.deepLink')
