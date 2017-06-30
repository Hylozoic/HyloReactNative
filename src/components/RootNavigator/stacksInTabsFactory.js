import {
  StackNavigator
} from 'react-navigation'

function stackNavigatorFactory (tabObject, otherScreens, tabName) {
  const paths = Object.assign({}, ...[tabObject, otherScreens])
  const config = {
    initialRouteName: tabName,
    navigationOptions: {
      title: tabName
    }
  }

  const stackNavigator = StackNavigator(
    paths,
    config
  )

  return stackNavigator
}

export default function stacksInTabsFactory (tabs, screens) {
  // merge tabs and scenes
  // add configuration options for each scene
  // create a StackNavigator for each tab
  // return an object that can be passed into TabNavigator
  const routeConfigs = {}
  for (const key of Object.keys(tabs)) {
    const obj = {}
    obj[key] = tabs[key]
    routeConfigs[key] = {screen: stackNavigatorFactory(obj, screens, key)}
  }
  return routeConfigs
}
