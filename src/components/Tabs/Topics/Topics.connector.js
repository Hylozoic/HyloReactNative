import { connect } from 'react-redux'
import getCurrentCommunity from '../../../store/selectors/getCurrentCommunity'

export function mapStateToProps (state, props) {
  const community = getCurrentCommunity(state, props)
  const topics = [
    {
      id: 1,
      name: 'climatechange',
      unreadCount: 2,
      subscribed: false
    },
    {
      id: 2,
      name: 'protectedspecies',
      unreadCount: 1,
      subscribed: false
    },
    {
      id: 3,
      name: 'reefs',
      unreadCount: 0,
      subscribed: true
    },
    {
      id: 4,
      name: 'fishing',
      unreadCount: 0,
      subscribed: false
    },
    {
      id: 5,
      name: 'organics',
      unreadCount: 0,
      subscribed: false
    },
    {
      id: 6,
      name: 'news',
      unreadCount: 0,
      subscribed: true
    },
    {
      id: 7,
      name: 'announcements',
      unreadCount: 0,
      subscribed: false
    }
  ]

  return {
    community,
    topics
  }
}

export default connect(mapStateToProps)
