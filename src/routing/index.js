import { MAIN_ROUTE_NAME } from 'routing/helpers'

// invitation: route('/h/use-invitation'),
// accessLink: route('/c/:slug/join/:accessCode'),
// passwordResetTokenLogin: route('/noo/login/token'),
// post: route('/c/:slug/p/:id'),
// networkPost: route('/n/:slug/p/:id'),
// allCommunitiesPost: route('/all/p/:id'),
// thread: route('/t/:id'),
// allCommunities: route('/all'),
// membersIndex: route('/c/:communityName/members'),
// showTopic: route('/c/:communityName/:topicName'),
// showMember: route('/m/:memberId'),
// showCommunity: route('/c/:communitySlug'),
// showNetwork: route('/n/:networkSlug')


/* configuration for matching screens with paths */
const config = {
  screens: {
    DrawerHome: {
      screens: {
        MemberProfile: 'm/:id',
        PostDetails: 'p/:id',
        PostEditor: 'p/:id/edit',
        UserSettings: 'settings/:section?',
        Thread: '/t/:id',
        ThreadList: '/t',
        // TODO: I don't see a great reason that this is still a constant
        Main: {
          screens: {
            Feed: 'feed/:communityId',
            Members: 'members',
            TopicFeed: 'c/:communitySlug/topicFeed/:topicName'
          }
        }
      }
    }
  }
}

const routing = {
  prefixes: [
    'http://hylo.com',
    'http://www.hylo.com',
    'https://hylo.com',
    'https://www.hylo.com',
    'hyloapp://'
  ],
  config
}

export default routing
