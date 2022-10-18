import React, { useState, useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { useSelector } from 'react-redux'
import { WebViewMessageTypes } from 'hylo-shared'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import { navigateToLinkingPath } from 'navigation/linking'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import HyloWebView, { parseWebViewMessage } from 'screens/HyloWebView'

// Matches actual group paths (e.g. not /all or /public)
export const MATCHER_GROUP_SLUG = '[a-zA-Z0-9-]+$'
export const MATCHER_GROUP_ROOT_PATH = `/groups/${MATCHER_GROUP_SLUG}$`

// Matches special group paths (e.g. /all and /public)
export const MATCHER_GROUP_ALL_AND_PUBLIC_ROOT_PATH = `/(${ALL_GROUP_ID}|${PUBLIC_GROUP_ID})$`

export default function MapWebView ({ navigation }) {
  const webViewRef = useRef(null)
  const group = useSelector(getCurrentGroup)
  const [path, setPath] = useState()

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: group?.name,
        // Disables going back by pull right on this screen
        gestureEnabled: false
      })
      // Disables swipeEnabled on DrawerNavigator
      navigation.getParent()?.getParent()?.setOptions({ swipeEnabled: false })
      if ([ALL_GROUP_ID, PUBLIC_GROUP_ID].includes(group?.slug)) {
        setPath(() => `${group?.slug}/map`)
      } else {
        setPath(() => `groups/${group?.slug}/map`)
      }
      // Re-enables swipeEnabled on DrawerNavigator when screen blurs
      return () => navigation.getParent()?.getParent()?.setOptions({ swipeEnabled: true })
    }, [group?.slug])
  )

  const handleMessage = message => {
    const { type, data } = parseWebViewMessage(message)

    switch (type) {
      case WebViewMessageTypes.NAVIGATION: {
        const { pathname, search } = data
        // Matches: `groups/my-awesome-group/members/<member-id>` or `/all|pubic/members/<member-id>`
        // re-writes linking to go to "Member Details - Modal" in the "all" context
        if (pathname.match(/\/groups\/*.+\/members\/*.+$/)) {
          const memberModalPath = '/all/' + pathname.split('/').slice(3, 5).join('/')
          navigateToLinkingPath(memberModalPath)
        // Matches: `/groups/our-awesome-group/map/post/<post-id>`, `/(all|public)/post/<post-id>`
        } else if (pathname.match(/\/post|\/members/)) {
          navigateToLinkingPath(pathname)
        // Matches: `/groups/our-awesome-group`
        // re-writes linking to go to "Group Detail - Modal"
        } else if (pathname.match(new RegExp(MATCHER_GROUP_ROOT_PATH))) {
          navigateToLinkingPath(pathname + '/detail')
        // Matches: `/all`, `/public`
        // re-writes linking to remain on map, reloading it in the target context
        } else if (pathname.match(new RegExp(MATCHER_GROUP_ALL_AND_PUBLIC_ROOT_PATH))) {
          navigateToLinkingPath(pathname + '/map')
        } else {
          // This captures saved search view calls, may capture too much
          navigateToLinkingPath(pathname + search)
        }
      }
    }
  }

  return (
    <HyloWebView
      ref={webViewRef}
      path={path}
      onMessage={handleMessage}
      /*

        Required for emulator with the map but may be disadventageous for actual
        devices as this has the effect of disabling hardware acceleration:

        ref. https://github.com/react-native-webview/react-native-webview/issues/575#issuecomment-800997520

        * Map still may not render on some older Android OS versions / devices
          adding a check for Android API version here and switching value
          to 'software' for API < 28'ish API may fix those cases.

      */
      androidLayerType='hardware'
    />
  )
}
