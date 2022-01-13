import React, { useState, useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { useSelector } from 'react-redux'
import { Linking } from 'react-native'
import urlParser from 'url'
import { navigateToLinkingPathInApp } from 'navigation/linking/custom'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import HyloWebView from 'screens/HyloWebView'

export default function MapWebView ({ navigation }) {
  const webViewRef = useRef(null)
  const group = useSelector(getCurrentGroup)
  const [path, setPath] = useState()

  useFocusEffect(
    useCallback(() => {
      console.log('!!! group.slug', group?.slug)
      navigation.setOptions({
        title: group?.name
      })
      if ([ALL_GROUP_ID, PUBLIC_GROUP_ID].includes(group?.slug)) {
        setPath(() => `${group?.slug}/map`)
      } else {
        setPath(() => `groups/${group?.slug}/map`)
      }
    }, [group?.slug])
  )

  // TODO: Using state for this seems to be working fine and generally better
  // for catching changes on the group.slug when the map hasn't been reloaded.
  // May be unnecessary though and then I'd go back to this:
  // let path
  // if ([ALL_GROUP_ID, PUBLIC_GROUP_ID].includes(group?.slug)) {
  //   path = `${group?.slug}/map`
  // } else {
  //   path = `groups/${group?.slug}/map`
  // }

  return (
    <HyloWebView
      ref={webViewRef}
      path={path}
      onNavigationStateChange={({ url }) => {
        if (url.match(/post|members/)) {
          // This works, but custom linking will reset history to
          // default nav state unloading the map:
          // Linking.openURL('hyloapp://groups/all')
          navigateToLinkingPathInApp(url)
          webViewRef.current?.stopLoading()
          webViewRef.current?.goBack()
        } else if (url.match(/groups\/[a-zA-Z]+$|all$|public$/)) {
          // This works fine here too:
          // Linking.openURL(`hyloapp://${urlParser.parse(url).path}`)
          navigateToLinkingPathInApp(url, true)
          webViewRef.current?.stopLoading()
          webViewRef.current?.goBack()
        } else {
          webViewRef.current?.goBack()
        }
      }}
      // Required for emulator with the map but may be disadventageous for actual
      // devices as this has the effect of disabling hardware acceleration.
      androidLayerType='software'
    />
  )
}

// TODO: May still use this if I make an ammendment to the Web code for mobileLayoutView:
// onMessage={event => {
//   const url = event.nativeEvent.url
//   if (url.match(/post/)) {
//     console.log('!!!! event', url)
//     navigateToLinkingPathPlain(url, navigation)
//   }
// }}

// TODO: May be able to utilize the white list to block some loading...?
// originWhitelist={[ process.env.HYLO_WEB_BASE_URL, 'hyloapp://*' ]}
