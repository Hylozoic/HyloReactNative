import { createNavigationContainerRef } from '@react-navigation/native'

export const MODAL_SCREEN_SUFFIX = ' - Modal'

export function modalScreenName (screenNameOrPath) {
  return screenNameOrPath + MODAL_SCREEN_SUFFIX
}

export function isModalScreen (screenNameOrPath = '') {
  return screenNameOrPath.match(new RegExp(`${MODAL_SCREEN_SUFFIX}$`))
}

export const navigationRef = createNavigationContainerRef()
