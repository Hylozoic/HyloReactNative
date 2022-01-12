import React, { useRef } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { useSelector } from 'react-redux'
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
    <HyloWebView
      ref={webViewRef}
      path={path}
      onNavigationStateChange={({ url }) => {
        // TODO: Considertying this back into the route matching somehow (a "map" property?)
        //       Also note some of these are modals which may not be reloading the map (good)
        //       And others are full context resets on the Home Navigator...
        if (url.match(/post|members|groups\/[a-zA-Z]+$|all$|public$/)) {
          // NOTE: This works, but due to custom linking setup resetting
          // to default state will unload map:
          // Linking.openURL('hyloapp://groups/all')
          webViewRef.current?.goBack()
          navigateToLinkingPathInApp(url)
          // webViewRef.current?.stopLoading()
          return false
        } else {
          webViewRef.current?.goBack()
          return false
        }
      }}
      // Required for emulator with the map but may be disadventageous for actual
      // devices as this has the effect of disabling hardware acceleration.
      androidLayerType='software'
    />
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
