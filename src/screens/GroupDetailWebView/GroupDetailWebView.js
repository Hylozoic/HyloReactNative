import React, { useState, useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { useSelector } from 'react-redux'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import { navigateToLinkingPath } from 'navigation/linking'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import HyloWebView from 'screens/HyloWebView'
import { isModalScreen } from 'navigation/linking/helpers'
import presentGroup from 'store/presenters/presentGroup'
import getGroup from 'store/selectors/getGroup'

// Matches actual group paths (e.g. not /all or /public)
export const MATCHER_GROUP_SLUG = '[a-zA-Z0-9-]+$'
export const MATCHER_GROUP_ROOT_PATH = `/groups/${MATCHER_GROUP_SLUG}$`

// Matches special group paths (e.g. /all and /public)
export const MATCHER_GROUP_ALL_AND_PUBLIC_ROOT_PATH = `/(${ALL_GROUP_ID}|${PUBLIC_GROUP_ID})$`

export default function GroupDetailWebView ({ navigation, route }) {
  const webViewRef = useRef(null)
  // const group = useSelector(getCurrentGroup)
  const [path, setPath] = useState(route?.params?.path)

  const isModal = isModalScreen(route?.name)
  const groupSlug = route.params.groupSlug
  console.log('!!! groupSlug', groupSlug)
  const group = useSelector(state => presentGroup(getGroup(state, { slug: groupSlug })))

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: group?.name
      })
      // if ([ALL_GROUP_ID, PUBLIC_GROUP_ID].includes(group?.slug)) {
      //   setPath(() => `${group?.slug}/map`)
      // } else {
      //   setPath(() => `groups/${group?.slug}/map`)
      // }
      // Re-enables swipeEnabled on DrawerNavigator when screen blurs
      // return () => navigation.getParent()?.getParent()?.setOptions({ swipeEnabled: true })
    }, [group?.name, navigation])
  )

  // const onMessage = event => {
  //   const { pathname, search } = JSON.parse(event.nativeEvent.data)

  //   // Matches: `groups/my-awesome-group/members/<member-id>` or `/all|pubic/members/<member-id>`
  //   // re-writes linking to go to "Member Details - Modal" in the "all" context
  //   if (pathname.match(/\/groups\/*.+\/members\/*.+$/)) {
  //     const memberModalPath = '/all/' + pathname.split('/').slice(3, 5).join('/')
  //     navigateToLinkingPath(memberModalPath)
  //   // Matches: `/groups/our-awesome-group/map/post/<post-id>`, `/(all|public)/post/<post-id>`
  //   } else if (pathname.match(/\/post|\/members/)) {
  //     navigateToLinkingPath(pathname)
  //   // Matches: `/groups/our-awesome-group`
  //   // re-writes linking to go to "Group Detail - Modal"
  //   } else if (pathname.match(new RegExp(MATCHER_GROUP_ROOT_PATH))) {
  //     navigateToLinkingPath(pathname + '/detail')
  //   // Matches: `/all`, `/public`
  //   // re-writes linking to remain on map, reloading it in the target context
  //   } else if (pathname.match(new RegExp(MATCHER_GROUP_ALL_AND_PUBLIC_ROOT_PATH))) {
  //     navigateToLinkingPath(pathname + '/map')
  //   } else {
  //     // This captures saved search view calls, may capture too much
  //     navigateToLinkingPath(pathname + search)
  //   }
  // }

  return (
    <HyloWebView
      ref={webViewRef}
      path={`groups/${groupSlug}/about`}
      // onMessage={onMessage}
      // Required for emulator with the map but may be disadventageous for actual
      // devices as this has the effect of disabling hardware acceleration.
      androidLayerType='software'
    />
  )
}
