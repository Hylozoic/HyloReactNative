import { MAIN_ROUTE_NAME, MAIN_ROUTE_PATH } from 'navigation/util/routing'

const config = {
  /* configuration for matching screens with paths */
  screens: {
    DrawerHome: {
      screens: {
        [MAIN_ROUTE_NAME]: {
          path: MAIN_ROUTE_PATH,
          screens: {
            Members: 'people',
            Feed: 'feed/:communityId',
            TopicFeed: 'c/:communitySlugFromLink/topicFeed/:topicName'
          },
          MemberProfile: 'people/:id',
          PostDetails: 'post/:id',
          PostEditor: 'post/edit/:id',
          UserSettings: 'settings/:section?',
        }
      }
    }
  },
  // AuthNavigator: 'login'
}

const linking = {
  prefixes: [
    'http://hylo.com',
    'http://www.hylo.com',
    'https://hylo.com',
    'https://www.hylo.com',
    'hyloapp://'
  ],
  config
}

export default linking
