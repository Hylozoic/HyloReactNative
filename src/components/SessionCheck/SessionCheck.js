import URL from 'url'
import React from 'react'
import PropTypes from 'prop-types'
import { View, Linking } from 'react-native'
import mixins from '../../style/mixins'
import Loading from '../Loading'
import LoginNavigator from '../LoginNavigator'
import SocketListener from '../SocketListener'
import RootNavigator from '../RootNavigator'

export const INTERNAL_ROUTE_URI_PREFIX = 'internalRouting://'

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
      currentTabName: 'Home'
    }
  }

  componentWillMount () {
    // Universal Linking - set entryURL when app is closed (initial) or woken up
    Linking.getInitialURL().then(url => this._handleSetEntryURL(url))
    Linking.addEventListener('url', ({ url }) => this._handleSetEntryURL(url))
  }

  componentDidMount () {
    const { initOneSignal, checkSession } = this.props
    checkSession()
    initOneSignal()
  }

  componentWillUpdate (nextProps) {
    const { pending, loggedIn, currentUser, fetchCurrentUser } = nextProps
    if (!pending && loggedIn && !currentUser) fetchCurrentUser()
  }

  componentDidUpdate (prevProps) {
    const { loading, entryURL, resetEntryURL, currentUser, loggedIn } = this.props
    const loadingCompleteEvent = !loading && loading !== prevProps.loading
    const entryURLChangeEvent = entryURL !== prevProps.entryURL
    const currentUserLoadedEvent = loggedIn && (currentUser !== prevProps.currentUser)
    const shouldForwardToEntryURL = (
      (loadingCompleteEvent && !loggedIn) ||
      (entryURLChangeEvent && !loading) ||
      currentUserLoadedEvent
    )
    if (entryURL && shouldForwardToEntryURL) {
      this.navigator._handleOpenURL(entryURL)
    }
    if (entryURL && currentUserLoadedEvent) {
      // NOTE: For now this is going to try and route for ALL entry URLs
      // it the case of CheckInvitation / JoinCommunity this will be fine
      // if there are other overlapping routes between LoginNavigator
      // and RootNavigator in which the LoginNavigator route was the final
      // destination this could cause an unexpected behaviour.
      resetEntryURL()
    }
  }

  componentWillUnmount () {
    // Universal Linking - remove url listener
    Linking.removeEventListener('url', this._setEntryURL)
  }

  // NOTE: The combination of the obscuring INTERNAL_ROUTE_URI_PREFIX constant
  // and the event handler here is a work around for issues in the
  // StackNavigator/StackRouter handling of these same events, especially
  // when not using a single root StackNavigator but a switching double rooted
  // one as we've done below. This system gives us a place to do our
  // own handling of URLs and most importantly to stop them from being handled
  // entirely in some cases.
  _handleSetEntryURL = (appURL) => {
    const { path } = URL.parse(appURL)
    if (path) {
      const interalRoutingURL = INTERNAL_ROUTE_URI_PREFIX + path.slice(1)
      this.props.setEntryURL(interalRoutingURL)
    }
  }

  render () {
    const { loading, loggedIn, currentUser } = this.props
    if (!loading) {
      if (!loggedIn) {
        return <LoginNavigator uriPrefix={INTERNAL_ROUTE_URI_PREFIX}
          ref={nav => { this.navigator = nav }} />
      }
      if (currentUser) {
        return <View style={{flex: 1}}>
          <RootNavigator
            uriPrefix={INTERNAL_ROUTE_URI_PREFIX}
            screenProps={this.state}
            ref={nav => { this.navigator = nav && nav.getWrappedInstance() }} />
          <SocketListener />
        </View>
      }
    }
    return <Loading style={mixins.allCentered} />
  }
}
