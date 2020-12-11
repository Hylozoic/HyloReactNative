import React from 'react'
import Feed from '../../Feed'
import Loading from '../../Loading'

export default class Home extends React.Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  render () {
    const { communityId, currentUser, route, navigation, networkId } = this.props
    if (!currentUser) return <Loading style={{flex: 1}} />

    return <Feed
      communityId={communityId}
      route={route}
      navigation={navigation}
      networkId={networkId} />
  }
}
