import React, { useRef } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { navigateToLinkingPathInApp } from 'navigation/linking/custom'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import HyloWebView from 'screens/HyloWebView'

export default function MapWebView ({ navigation }) {
  const webViewRef = useRef(null)
  const group = useSelector(getCurrentGroup)

  useFocusEffect(() => {
    navigation.setOptions({
      title: group?.name
    })
  })

  let path
  if ([ALL_GROUP_ID, PUBLIC_GROUP_ID].includes(group?.slug)) {
    path = `${group?.slug}/map`
  } else {
    path = `groups/${group?.slug}/map`
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <HyloWebView
        ref={webViewRef}
        path={path}
        onNavigationStateChange={({ url }) => {
          // TODO: Probably want to inject all of the below as logic in
          //       a callback from consuming component
          if (url.match(/post/)) {
            // NOTE: This works, but due to custom linking setup resetting
            // to default state will unload map:
            // Linking.openURL('hyloapp://groups/all')
            navigateToLinkingPathInApp(url)
            webViewRef.current?.goBack()
            // webViewRef.current?.stopLoading()
            return false
          } else {
            webViewRef.current?.goBack()
            return false
          }
        }}
        // Required for emulator, but may be disadventageous for actual
        // devices as this has the effect of disabling hardware acceleration.
        androidLayerType='software'
      />
    </SafeAreaView>
  )
}

// onMessage={event => {
//   const url = event.nativeEvent.url
//   if (url.match(/post/)) {
//     console.log('!!!! event', url)
//     navigateToLinkingPathPlain(url, navigation)
//   }
// }}
// originWhitelist={[ process.env.HYLO_WEB_BASE_URL, 'hyloapp://*' ]}
