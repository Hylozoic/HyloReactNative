import React, { useMemo } from 'react'
import { View } from 'react-native'
import RootNavigator from 'navigation'
// import DeepLinkHandler from 'navigation/DeepLinkHandler'
import LoadingModal from '../LoadingModal'
import VersionCheck from '../VersionCheck'

export default function RootView ({
  loading,
  signedIn,
  setupSessionWithRetry,
  openedPushNotification
}) {
  useMemo(() => { setupSessionWithRetry() }, [])

  if (loading) return <LoadingModal />

  // TODO: Deeplink handling using openedPushNotification

  return <View style={{flex: 1}}>
    <VersionCheck />
    <RootNavigator isSignedIn={signedIn} />
  </View>
}
