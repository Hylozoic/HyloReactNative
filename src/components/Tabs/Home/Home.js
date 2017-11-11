import React from 'react'

import Feed from '../../Feed'
import Header from '../Header'
import Loading from '../../Loading'

export default class Home extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return Header(navigation, screenProps.currentTabName)
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  render () {
    const { communityId, currentUser, isFocused, navigation } = this.props
    if (!currentUser) return <Loading style={{flex: 1}} />
    return <Feed
      communityId={communityId}
      isFocused={isFocused}
      navigation={navigation}
      screenProps={this.props.screenProps} />
  }
}
