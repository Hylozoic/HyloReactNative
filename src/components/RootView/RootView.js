import React, { useMemo } from 'react'
import { View } from 'react-native'
import Loading from '../Loading'
import RootNavigator from 'navigation'
// import DeepLinkHandler from 'navigation/DeepLinkHandler'
import VersionCheck from '../VersionCheck'

export default function RootView ({
  loading,
  signedIn,
  loadCurrentUserSession,
  openedPushNotification
}) {
  useMemo(() => { loadCurrentUserSession() }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading style={styles.loading} />
      </View>
    )
  }

  // TODO: Deeplink handling using openedPushNotification
  return (
    <View style={styles.rootContainer}>
      <VersionCheck />
      <RootNavigator isSignedIn={signedIn} />
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
