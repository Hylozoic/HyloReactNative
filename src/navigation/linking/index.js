import url from 'url'
import { Linking } from 'react-native'

const prefixes = [
  'http://hylo.com',
  'http://www.hylo.com',
  'https://hylo.com',
  'https://www.hylo.com',
  'http://staging.hylo.com',
  'https://staging.hylo.com',
  'hyloapp://'
]

const screens = {
  Drawer: {
    screens: {
      Tabs: {
        initialRouteName: 'Home Tab',
        screens: {
          'Home Tab': {
            initialRouteName: 'Feed',
            path: '/feed',
            screens: {
              'Post Details': {
                path: 'all/post/:id'
              }
            }
          },
          'Messages Tab': {
            initialRouteName: 'Messages',
            screens: {
              Thread: '/messages/:id'
            }
          }        
        }
      }
    }
  }
}

export const linking = {
  prefixes,
  config: {
    screens
  }
}

// NOTE: Does not work in the case of initialURL,
// see navigation/linking/custom/navigateToLinkingPath
// for replacement
export async function openPathOrURLInApp (pathOrURL) {
  const { pathname } = url.parse(pathOrURL)
  const targetURL = 'hyloapp://' + pathname
  if (await Linking.canOpenURL(targetURL)) {
    await Linking.openURL(targetURL)
  }
}

export default linking
