import url from 'url'
import { Linking } from 'react-native'

const prefixes = [
  'http://hylo.com',
  'http://www.hylo.com',
  'https://hylo.com',
  'https://www.hylo.com',
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

export function openURLinkApp (pathOrURL) {
  const { pathname } = url.parse(pathOrURL)
  if (pathname) {
    Linking.openURL('hyloapp://' + pathname)
  }
}

export default linking
