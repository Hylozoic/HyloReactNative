import React from 'react'

import Feed from '../../Feed'
import Header from '../Header'
import Loading from '../../Loading'

export default class Home extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return Header(navigation, screenProps.currentTabName)
  }

  componentDidMount () {
    this.props.navigation.navigate('PostEditor', {communityId: '9'})
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  render () {
    const { communityId, currentUser, navigation, networkId } = this.props
    if (!currentUser) return <Loading style={{flex: 1}} />
    return <Feed
      communityId={communityId}
      navigation={navigation}
      networkId={networkId}
      screenProps={this.props.screenProps} />
  }
}
