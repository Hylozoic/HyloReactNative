import React, { useState, useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import { navigateToLinkingPath } from 'navigation/linking'
import HyloWebView from 'screens/HyloWebView'

// Matches actual group paths (e.g. not /all or /public)
export const MATCHER_GROUP_SLUG = '[a-zA-Z0-9-]+$'
export const MATCHER_GROUP_ROOT_PATH = `/groups/${MATCHER_GROUP_SLUG}$`

// Matches special group paths (e.g. /all and /public)
export const MATCHER_GROUP_ALL_AND_PUBLIC_ROOT_PATH = `/(${ALL_GROUP_ID}|${PUBLIC_GROUP_ID})$`

export default function GroupDetailWebView ({ navigation, route }) {
  const webViewRef = useRef(null)
  // const group = useSelector(getCurrentGroup)
  const groupSlug = route.params.groupSlug
  const [path, setPath] = useState(`groups/${groupSlug}/about`)
  // const group = useSelector(state => presentGroup(getGroup(state, { slug: groupSlug })))

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: groupSlug
      })
    }, [groupSlug, navigation])
  )

  const onMessage = message => {
    const { eventName, groupSlug, pathname, search } = JSON.parse(message.nativeEvent.data)

    switch (eventName) {
      case 'JOIN_GROUP': {
        navigateToLinkingPath(`/groups/${groupSlug}`)
        return
      }
    }

    if (pathname) {
      // Matches: `groups/my-awesome-group/members/<member-id>` or `/all|pubic/members/<member-id>`
      // re-writes linking to go to "Member Details - Modal" in the "all" context
      if (pathname.match(/\/groups\/*.+\/members\/*.+$/)) {
        const memberModalPath = '/' + pathname.split('/').slice(3, 5).join('/')
        console.log('!!!! memberModalPath', memberModalPath)
        navigateToLinkingPath(memberModalPath)
      // Matches: `/groups/our-awesome-group/map/post/<post-id>`, `/(all|public)/post/<post-id>`
      } else if (pathname.match(/\/post|\/members/)) {
        const postModalPath = '/' + pathname.split('/').slice(3, 5).join('/')
        console.log('!!!! postModalPath', postModalPath)
        navigateToLinkingPath(postModalPath)
      } else {
        console.log('!!!! uncaptured click to', pathname, search)
      }
      // navigateToLinkingPath(pathname + search)
    }
  }

  return (
    <HyloWebView
      ref={webViewRef}
      path={path}
      onMessage={onMessage}
    />
  )
}
