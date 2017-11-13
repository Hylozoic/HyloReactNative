import React from 'react'

import Feed from '../../Feed'
import Header from '../Header'
import Loading from '../../Loading'

export default class Home extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return Header(navigation, screenProps.currentTabName)
  }

  componentDidMount () {
    // this.props.navigation.navigate('MemberDetails', {id: 11204, editing: true})
    this.props.navigation.navigate('MemberProfile', {id: 11204})
  }

  render () {
    const { navigation, communityId, currentUser } = this.props
    if (!currentUser) return <Loading style={{flex: 1}} />
    return <Feed
      navigation={navigation}
      communityId={communityId}
      screenProps={this.props.screenProps} />
  }
}
