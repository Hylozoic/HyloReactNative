import React from 'react'
import { get } from 'lodash/fp'

import Feed from '../../Feed'
import Header from '../Header'
import Loading from '../../Loading'

export default class Home extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) =>
    Header(navigation, screenProps.currentTabName)

  componentDidMount () {
    const { currentUser, updateBadges } = this.props
    if (currentUser) updateBadges({
      hasUnreadMessages: !!currentUser.unseenThreadCount
    })
  }

  componentDidUpdate (prevProps) {
    const oldCount = get('unseenThreadCount', prevProps.currentUser)
    const newCount = get('unseenThreadCount', this.props.currentUser)
    if (oldCount !== newCount) this.props.updateBadges({
      hasUnreadMessages: !!newCount
    })
  }

  render () {
    const { navigation, communityId, currentUser } = this.props
    if (!currentUser) return <Loading style={{flex: 1}} />
    return <Feed navigation={navigation} communityId={communityId} />
  }
}
