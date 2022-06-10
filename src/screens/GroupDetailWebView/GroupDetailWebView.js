import React, { useCallback, useRef, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { navigateToLinkingPath } from 'navigation/linking'
import HyloWebView from 'screens/HyloWebView'
import { useDispatch } from 'react-redux'
import fetchGroupModerators from 'store/actions/fetchGroupModerators'

// TODO: Move into hylo-shared and use in related code here and on Web
export const JOINED_GROUP = 'JOINED_GROUP'

export default function GroupDetailWebView ({ navigation, route }) {
  const dispatch = useDispatch()
  const webViewRef = useRef(null)
  const groupSlug = route.params.groupSlug

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: groupSlug
      })
    }, [groupSlug, navigation])
  )

  // Fetch moderators for "Opportunities to Connect" / Message to all moderators feature
  useEffect(() => {
    dispatch(fetchGroupModerators({ slug: groupSlug }))
  }, [])

  const onMessage = message => {
    const { eventName, groupSlug: joinedGroupSlug, pathname, search } = JSON.parse(message.nativeEvent.data)

    switch (eventName) {
      case JOINED_GROUP: {
        navigateToLinkingPath(`/groups/${joinedGroupSlug}`)
        return
      }
    }

    if (pathname) {
      // Matches: `groups/my-awesome-group/members/<member-id>` or `/all|pubic/members/<member-id>`
      // re-writes linking to go to "Member Details - Modal" in the "all" context
      if (pathname.match(/\/groups\/*.+\/members\/*.+$/)) {
        const memberModalPath = '/' + pathname.split('/').slice(3, 5).join('/')

        navigateToLinkingPath(memberModalPath)
      // Matches: `/groups/our-awesome-group/map/post/<post-id>`, `/(all|public)/post/<post-id>`
      } else if (pathname.match(/\/post|\/members/)) {
        const postModalPath = '/' + pathname.split('/').slice(3, 5).join('/')

        navigateToLinkingPath(postModalPath)
      // "Opportunities to Connect" / Message to moderators
      } else if (pathname.match(/\/messages\/new$/)) {
        navigateToLinkingPath(pathname + search)
      }
    }
  }

  return (
    <HyloWebView
      ref={webViewRef}
      path={`groups/${groupSlug}/about`}
      onMessage={onMessage}
    />
  )
}
