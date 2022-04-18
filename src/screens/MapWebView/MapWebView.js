import React, { useState, useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { useSelector } from 'react-redux'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import { navigateToLinkingPath } from 'navigation/linking'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import HyloWebView from 'screens/HyloWebView'

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

  const onMessage = event => {
    const { url } = JSON.parse(event.nativeEvent.data)

    // Matches: `groups/my-awesome-group/members/<member-id>` or `/all|pubic/members/<member-id>`
    // re-writes linking to go to "Member Details - Modal" in the "all" context
    if (url.match(/\/groups\/*.+\/members\/*.+$/)) {
      const memberModalPath = '/all/' + url.split('/').slice(3, 5).join('/')
      navigateToLinkingPath(memberModalPath)
    // Matches: `/groups/our-awesome-group/map/post/<post-id>`, `/(all|public)/post/<post-id>`
    } else if (url.match(/\/post|\/members/)) {
      navigateToLinkingPath(url)
    // Matches: `/groups/our-awesome-group`
    // re-writes linking to go to "Group Detail - Modal"
    } else if (url.match(new RegExp(MATCHER_GROUP_ROOT_PATH))) {
      navigateToLinkingPath(url + '/detail')
    // Matches: `/all`, `/public`
    // re-writes linking to remain on map, reloading it in the target context
    } else if (url.match(new RegExp(MATCHER_GROUP_ALL_AND_PUBLIC_ROOT_PATH))) {
      navigateToLinkingPath(url + '/map')
    } else {
      // This captures saved search view calls, may capture too much
      navigateToLinkingPath(url)
    }
  }

  return (
    <HyloWebView
      ref={webViewRef}
      path={path}
      onMessage={onMessage}
      // Required for emulator with the map but may be disadventageous for actual
      // devices as this has the effect of disabling hardware acceleration.
      androidLayerType='software'
    />
  )
}
