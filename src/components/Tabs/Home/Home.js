import React from 'react'

import Feed from '../../Feed'
import Header from '../Header'
import Loading from '../../Loading'

export default class Home extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return Header(navigation, screenProps.currentTabName)
  }

  render () {
    const { navigation, communityId, networkId, currentUser } = this.props
    if (!currentUser) return <Loading style={{flex: 1}} />
    return <Feed
      navigation={navigation}
      communityId={communityId}
      networkId={networkId}
      screenProps={this.props.screenProps} />
  }
}
