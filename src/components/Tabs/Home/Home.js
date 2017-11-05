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
    console.log("home", this.props.isFocused, nextProps.isFocused)

    // Update only once after the screen disappears
    if (this.props.isFocused && !nextProps.isFocused) {
      return true
    }

    // Don't update if the screen is not focused
    if (!this.props.isFocused && !nextProps.isFocused) {
      return false
    }

    // Update the screen if its re-enter
    return !this.props.isFocused && nextProps.isFocused
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

export default withNavigationFocus(Home, 'Home')
