// A higher-order component for wrapping the root navigator so that its screens
// get a currentTabName value in their screenProps, which they can use to
// determine which tab is visible.
//
// Even though this only pertains to the tab navigator, it must wrap the top-
// level navigator, because you can't set onNavigationStateChange on non-top-
// level navigators.

import React from 'react'
import { has } from 'lodash/fp'

const tabNames = ['Home', 'Members', 'Topics']

export default function trackCurrentTab (Component) {
  return class extends React.Component {
    constructor (props) {
      super(props)
      this.state = {currentTabName: 'Home'}
    }

    getWrappedInstance () {
      return this.wrappedInstance
    }

    // this method is very coupled to the nesting structure for navigators in
    // RootNavigator/index.js
    handleChange = (prevState, newState) => {
      const stackNav = newState.routes[newState.index]
      if (!has('index', stackNav)) return

      const drawerNav = stackNav.routes[stackNav.index]
      if (!has('index', drawerNav)) return

      const tabNav = drawerNav.routes[drawerNav.index]
      if (!has('index', tabNav)) return

      const route = tabNav.routes[tabNav.index]
      if (!route || !tabNames.includes(route.routeName)) return

      if (route.routeName !== this.state.currentTabName) {
        this.setState({currentTabName: route.routeName})
      }
    }

    render () {
      return <Component
        ref={wrappedInst => { this.wrappedInstance = wrappedInst }}
        {...this.props}
        onNavigationStateChange={this.handleChange}
        screenProps={this.state}
      />
    }
  }
}
