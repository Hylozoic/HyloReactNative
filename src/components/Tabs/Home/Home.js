import React from 'react'
import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import Feed from '../../Feed'
import Header from '../Header'
import Loading from '../../Loading'

export class Home extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return Header(navigation, screenProps.currentTabName)
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
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

export default withNavigationFocus(Home)
