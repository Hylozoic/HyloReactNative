import React from 'react'

import Feed from '../../Feed'
import Header from '../Header'
import Loading from '../../Loading'

export default class Home extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return Header(navigation, screenProps.currentTabName)
  }

  componentDidMount () {
    // this.props.navigation.navigate('MemberSkillEditor', {id: 11204})
    this.props.navigation.navigate('SignupFlow4')
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
