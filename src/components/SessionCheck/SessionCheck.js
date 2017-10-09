import React from 'react'
import PropTypes from 'prop-types'
import { View, Linking } from 'react-native'
import { has } from 'lodash/fp'
import { urlPrefix } from 'util/platform'
import mixins from '../../style/mixins'
import Loading from '../Loading'
import LoginNavigator from '../LoginNavigator'
import SocketListener from '../SocketListener'
import RootNavigator from '../RootNavigator'

const tabNames = ['Home', 'Members', 'Topics']

export default class SessionCheck extends React.Component {
  static propTypes = {
    loggedIn: PropTypes.bool,
    pending: PropTypes.any,
    currentUser: PropTypes.object,
    entryURL: PropTypes.string,
    checkSession: PropTypes.func.isRequired,
    initOneSignal: PropTypes.func.isRequired,
    setEntryURL: PropTypes.func.isRequired,
    resetEntryURL: PropTypes.func.isRequired,
    fetchCurrentUser: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {currentTabName: 'Home'}
  }

  // This method is very coupled to the nesting structure for navigators in
  // RootNavigator/index.js
  // it wraps the root navigator so that its screens get a currentTabName
  // value in their screenProps, which they can use to determine which tab is
  // visible.
  //
  // Even though this only pertains to the tab navigator, it must wrap the top-
  // level navigator, because you can't set onNavigationStateChange on non-top-
  // level navigators.
  //
  // It is placed onNavigationStateChange on the top-level navigator,
  // because it uses a prop for listening to navigation change events
  // that can only be assigned to a top-level navigator
  //
  _handleChange = (prevState, newState) => {
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

  componentDidMount (nextProps) {
    const { initOneSignal, checkSession, setEntryURL } = this.props
    checkSession()
    initOneSignal()
    // Universal Linking - set entryURL when app is closed (initial) or woken up
    Linking.getInitialURL().then(setEntryURL)
    Linking.addEventListener('url', ({ url }) => setEntryURL(url))
  }

  componentWillUpdate (nextProps) {
    const { pending, loggedIn, currentUser, fetchCurrentUser } = nextProps
    if (!pending && loggedIn && !currentUser) {
      fetchCurrentUser()
    }
  }

  componentDidUpdate (prevProps) {
    const { entryURL, resetEntryURL, currentUser, loggedIn } = this.props
    if (loggedIn && (prevProps.currentUser !== currentUser)) {
      if (entryURL) {
        this.loggedInNavigator._handleOpenURL(entryURL)
        resetEntryURL()
      }
    }
  }

  componentWillUnmount () {
    // Universal Linking - remove url listener
    Linking.removeEventListener('url', this._handleOpenURL)
  }

  render () {
    const { pending, loggedIn, currentUser } = this.props
    if (!pending) {
      if (!loggedIn) return <LoginNavigator />
      if (currentUser) {
        return <View style={{flex: 1}}>
          <RootNavigator
            uriPrefix={urlPrefix}
            onNavigationStateChange={this._handleChange}
            screenProps={this.state}
            ref={nav => { this.loggedInNavigator = nav }} />
          <SocketListener />
        </View>
      }
    }
    return <Loading style={mixins.allCentered} />
  }
}
