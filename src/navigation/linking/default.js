// Default React Navigation linking config
// NOTE: This is not being used as there is currently no
//       screens.config option which allows for multiple
//       paths to match to each screen, which is currently
//       one of our requirememts mostly due to join community.

const prefixes = [
  'http://hylo.com',
  'http://www.hylo.com',
  'https://hylo.com',
  'https://www.hylo.com',
  'hyloapp://'
]

const screens = {
  JoinCommunity: 'join',
  AppNavigator: {
    screens: {
      Messages: 'messages',
      Tabs: {
        initialRouteName: 'Home',
        screens: {
          // Home: 'tester',
          initialRouteName: 'Members',
          Members: {
            path: 'm',
            screens: {
              Member: ':id'
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

export default linking
