import React, { useCallback, useRef, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { WebViewMessageTypes } from 'hylo-shared'
import { navigateToLinkingPath } from 'navigation/linking'
import HyloWebView, { parseWebViewMessage } from 'screens/HyloWebView'
import { useDispatch } from 'react-redux'
import fetchGroupModerators from 'store/actions/fetchGroupModerators'
import fetchGroupDetails from 'store/actions/fetchGroupDetails'
// import fetchCurrentUser from 'store/actions/fetchCurrentUser'

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

  const joinGroup = async groupToJoinSlug => {
    // TODO: This fixes some things but takes too long. Look into reducers so that
    // Membership update propogates everywhere, including in Feed if currently on this
    // group.
    // await dispatch(fetchCurrentUser())
    await dispatch(fetchGroupDetails({ slug: groupToJoinSlug }))
    navigateToLinkingPath(`/groups/${groupToJoinSlug}`)
  }

  const handleMessage = message => {
    const { type, data } = parseWebViewMessage(message)

    switch (type) {
      case WebViewMessageTypes.JOINED_GROUP: {
        const { groupSlug } = data

        return joinGroup(groupSlug)
      }
      case WebViewMessageTypes.NAVIGATION: {
        const { pathname, search } = data

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
  }

  return (
    <HyloWebView
      ref={webViewRef}
      path={`groups/${groupSlug}/about`}
      onMessage={handleMessage}
    />
  )
}
