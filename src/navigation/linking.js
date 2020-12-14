import { MAIN_ROUTE_NAME } from 'navigation/util/routing'

/* configuration for matching screens with paths */
const config = {
  screens: {
    DrawerHome: {
      screens: {
        MemberProfile: 'people/:id',
        PostDetails: 'post/:id',
        PostEditor: 'post/edit/:id',
        UserSettings: 'settings/:section?',
        // TODO: I don't see a great reason that this is still a constant
        [MAIN_ROUTE_NAME]: {
          screens: {
            Members: 'people',
            Feed: 'feed/:communityId',
            TopicFeed: 'c/:communitySlugFromLink/topicFeed/:topicName'
          }
        }
      }
    }
  }
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
