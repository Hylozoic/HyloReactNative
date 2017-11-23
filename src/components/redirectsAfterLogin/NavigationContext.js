// This component adds a method to the Redux context so that any descendant can
// trigger deep-linking handling by calling `this.context.navigateToPath()`.
//
// Descendants can be wrapped in the HOC `redirectsAfterLogin` to get a function
// in their props named `fetchCurrentUserAndRedirect`, which does what it sounds
// like it does.

import React from 'react'
import { func } from 'prop-types'
import { View } from 'react-native'
import DeepLinkHandler from '../DeepLinkHandler'
import RootNavigator from '../RootNavigator'

const INTERNAL_ROUTE_URI_PREFIX = 'hylo://'

export default class NavigationContext extends React.Component {
  state = {
    navigateToPath: url =>
      console.log(`navigator not ready to handle ${url}`)
  }

  static childContextTypes = {
    navigateToPath: func
  }

  getChildContext () {
    return {
      navigateToPath: this.state.navigateToPath
    }
  }

  setup = ref => {
    if (!ref) return
    this.navigator = ref.getWrappedInstance()
    this.setState({
      navigateToPath: path => {
        const url = INTERNAL_ROUTE_URI_PREFIX + path
        return this.navigator._handleOpenURL({url})
      }
    })
  }

  render () {
    return <View style={{flex: 1}}>
      <RootNavigator ref={this.setup} uriPrefix={INTERNAL_ROUTE_URI_PREFIX} />
      <DeepLinkHandler navigator={this.navigator} />
    </View>
  }
}
