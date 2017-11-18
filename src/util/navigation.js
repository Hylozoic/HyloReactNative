/**
 * @providesModule util/navigation
 */

import { NavigationActions } from 'react-navigation'

export function resetToRoute (navigation, routeName) {
  return navigation.dispatch(NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName})]
  }))
}
