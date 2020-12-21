import React, { useMemo } from 'react'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import routing from 'routing'
import Loading from 'components/Loading'
import AuthNavigator from 'navigation/AuthNavigator'
import AppWithDrawerNavigator from 'navigation/AppWithDrawerNavigator'

export default function RootView ({
  loading,
  signedIn,
  signupInProgress,
  loadCurrentUserSession,
  openedPushNotification
}) {
  // TODO: Loading twice. Deternube what to memoize on to make sure
  // this loads only once
  useMemo(() => { loadCurrentUserSession() }, [signedIn])

  if (loading && !signupInProgress) {
    return (
      <View style={styles.loadingContainer}>
        <Loading style={styles.loading} />
      </View>
    )
  }

  // TODO: Deeplink handling using openedPushNotification
  return (
    <View style={styles.rootContainer}>
      <NavigationContainer linking={routing}>
        {signedIn && !signupInProgress
          ? <AppWithDrawerNavigator />
          : <AuthNavigator signupInProgress={signupInProgress} />}
      </NavigationContainer>
    </View>
  )
}

const styles = {
  rootContainer: {
    flex: 1
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    marginBottom: 15
  }
}