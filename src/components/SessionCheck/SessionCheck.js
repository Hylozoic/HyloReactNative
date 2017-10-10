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
const URI_PREFIX_OVERRIDE = 'internalRouting://'

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
    this.state = {
      initialLoad: true,
      currentTabName: 'Home'
    }
  }

  componentDidMount () {
    const { initOneSignal, checkSession } = this.props
    checkSession()
    initOneSignal()
    // Universal Linking - set entryURL when app is closed (initial) or woken up
    Linking.getInitialURL().then(this._handleOpenURL)
    Linking.addEventListener('url', ({ url }) => this._handleOpenURL(url))
  }

  componentWillUpdate (nextProps) {
    const { pending, loggedIn, currentUser, fetchCurrentUser } = nextProps
    if (!pending && loggedIn && !currentUser) fetchCurrentUser()
  }

  componentDidUpdate (prevProps) {
    const { entryURL, resetEntryURL, currentUser, loggedIn } = this.props
    if (loggedIn && (currentUser !== prevProps.currentUser)) {
      if (entryURL) {
        resetEntryURL()
        this.navigator._handleOpenURL(entryURL)
      }
    }
  }

  componentWillUnmount () {
    // Universal Linking - remove url listener
    Linking.removeEventListener('url', this._handleOpenURL)
  }

  // NOTE: The combination of the obscuring URI_PREFIX_OVERRIDE constant
  // and the event handler here is a work around for issues in the
  // StackNavigator/StackRouter handling of these same events, especially
  // when not using a single root StackNavigator but a switching double rooted
  // one as we've done below. This system gives us a place to do our
  // own handling of URLs and most importantly to stop them from being handled
  // entirely in some cases.
  _handleOpenURL = (url) => {
    if (url) {
      const parsedURL = URI_PREFIX_OVERRIDE + url.split(urlPrefix)[1]
      this.props.setEntryURL(url)
      this.navigator && this.navigator._handleOpenURL(parsedURL)
    }
  }

  // NOTE: This method is very coupled to the nesting structure for navigators
  // in RootNavigator/index.js it wraps the root navigator so that its screens
  // get a currentTabName value in their screenProps, which they can use to
  // determine which tab is visible.
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

  render () {
    const { loading, loggedIn, currentUser } = this.props
    if (!loading) {
      if (!loggedIn) {
        return <LoginNavigator uriPrefix={URI_PREFIX_OVERRIDE} ref={nav => { this.navigator = nav }} />
      }
      if (currentUser) {
        return <View style={{flex: 1}}>
          <RootNavigator
            uriPrefix={URI_PREFIX_OVERRIDE}
            onNavigationStateChange={this._handleChange}
            screenProps={this.state}
            ref={nav => { this.navigator = nav }} />
          <SocketListener />
        </View>
      }
    }
    return <Loading style={mixins.allCentered} />
  }
}
