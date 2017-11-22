import { connect } from 'react-redux'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import { getEntryUrl } from '../SessionCheck/SessionCheck.store'
import { resetToRoute } from 'util/navigation'
import convertEntryUrl from './convertEntryUrl'
import { get } from 'lodash/fp'

function mapStateToProps (state, props) {
  return {
    entryUrl: getEntryUrl(state)
  }
}

const mapDispatchToProps = {fetchCurrentUser}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigateToPath } = ownProps
  return {
    ...ownProps,
    ...stateProps,
    fetchCurrentUserAndRedirect: () =>
      dispatchProps.fetchCurrentUser().then(({ error, payload }) =>
        !error && redirect({
          navigation: ownProps.navigation,
          currentUser: payload.data.me,
          entryUrl: stateProps.entryUrl,
          navigateToPath
        })),

    // for use by EntryLinkHandler (has its own user data & different navigator)
    redirectNow: ({ currentUser, navigation, entryUrl }) =>
      redirect({
        navigation: navigation || ownProps.navigation,
        currentUser,
        entryUrl: entryUrl || stateProps.entryUrl,
        navigateToPath
      })
  }
}

function redirect ({ navigation, currentUser, entryUrl, navigateToPath }) {
  if (get('settings.signupInProgress', currentUser)) {
    resetToRoute(navigation, 'SignupFlow1')
  } else if (entryUrl) {
    let internalPath = convertEntryUrl(entryUrl, !!currentUser)
    console.log(`convertEntryUrl: ${entryUrl} => ${internalPath}`)
    if (internalPath) {
      navigateToPath(internalPath)
    } else {
      resetToRoute(navigation, 'Main')
    }
  } else {
    resetToRoute(navigation, 'Main')
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
