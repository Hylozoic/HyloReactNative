import React from 'react'

import Feed from '../../Feed'
import Header from '../Header'
import { updateBadges } from 'util/header'
import Loading from '../../Loading'

export default class Home extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return Header(navigation, screenProps.currentTabName)
  }

  componentDidMount () {
    const { currentUser, navigation, screenProps } = this.props
    if (screenProps.currentTabName === 'Home') {
      updateBadges(navigation, currentUser)
    }
  }

  componentDidUpdate (prevProps) {
    const { currentUser, navigation, screenProps } = this.props
    if (screenProps.currentTabName === 'Home') {
      updateBadges(navigation, currentUser, prevProps.currentUser)
    }
  }

  render () {
    const { navigation, communityId, currentUser } = this.props
    if (!currentUser) return <Loading style={{flex: 1}} />
    return <Feed navigation={navigation} communityId={communityId} />
  }
}
