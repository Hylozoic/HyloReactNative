import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/fp'
import { LoadingScreen } from '../Loading'
import { NavigationActions } from 'react-navigation'

export default class SessionCheck extends React.Component {
  static propTypes = {
    loggedIn: PropTypes.bool,
    pending: PropTypes.any,
    currentUser: PropTypes.object,
    entryURL: PropTypes.string,
    checkSession: PropTypes.func.isRequired,
    setEntryURL: PropTypes.func.isRequired,
    resetEntryURL: PropTypes.func.isRequired,
    fetchCurrentUser: PropTypes.func.isRequired
  }

  componentDidMount () {
    const retry = ({ error }) => error && setTimeout(checkAndRetry, 1000)
    const checkAndRetry = () => this.props.checkSession().then(retry)
    checkAndRetry()
  }

  componentWillUpdate (nextProps) {
    const { pending, loggedIn, currentUser, fetchCurrentUser } = nextProps
    if (!pending && loggedIn && !currentUser) fetchCurrentUser()
  }

  componentDidUpdate (prevProps) {
    const {
      loading,
      entryURL,
      resetEntryURL,
      currentUser,
      loggedIn,
      signupInProgress,
      signupStep1Complete,
      navigation
    } = this.props

    // if (prevProps.loggedIn === undefined && loggedIn) {
    //   navigation.navigate('Main')
    // }
    //
    // if (prevProps.loggedIn === undefined && loggedIn === false) {
    //   navigation.navigate('Login')
    // }

    // -------

    const loadingCompleteEvent = !loading && prevProps.loading
    const entryURLChangeEvent = entryURL !== prevProps.entryURL
    const currentUserLoadedEvent = get('id', currentUser) !== get('id', prevProps.currentUser)
    const signUpCompleteEvent = !signupInProgress && prevProps.signupInProgress
    const shouldForwardToEntryURL = (
      (loadingCompleteEvent && !loggedIn) ||
      (entryURLChangeEvent && !loading) ||
      currentUserLoadedEvent ||
      signUpCompleteEvent
    )

    if (currentUserLoadedEvent && signupInProgress) {
      const routeName = signupStep1Complete ? 'SignupFlow2' : 'SignupFlow1'
      navigation.navigate(routeName)
    }

    if (entryURL && shouldForwardToEntryURL) {
      console.log('should forward')
      // this.navigator._handleOpenURL(entryURL)
    }

    if (entryURL && currentUserLoadedEvent) {
      // NOTE: For now this is going to try and route for ALL entry URLs
      // it the case of CheckInvitation / JoinCommunity this will be fine
      // if there are other overlapping routes between LoginNavigator
      // and RootNavigator in which the LoginNavigator route was the final
      // destination this could cause an unexpected behaviour.
      resetEntryURL()
    }

    if (!entryURL && currentUserLoadedEvent) {
      navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Main'})]
      }))
    }
  }

  render () {
    return <LoadingScreen />
  }
}
