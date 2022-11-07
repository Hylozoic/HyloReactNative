import React, { useRef, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { useNavigation, useRoute } from '@react-navigation/native'
import { WebViewMessageTypes } from 'hylo-shared'
import { navigateToLinkingPath } from 'navigation/linking'
import useIsModalScreen from 'hooks/useIsModalScreen'
import HyloWebView from 'components/HyloWebView'
import { useDispatch, useSelector } from 'react-redux'
import fetchGroupModerators from 'store/actions/fetchGroupModerators'
import fetchGroupDetails from 'store/actions/fetchGroupDetails'
import ModalHeaderTransparent from 'navigation/headers/ModalHeaderTransparent'
import getGroup from 'store/selectors/getGroup'

export default function GroupExploreWebView () {
  const dispatch = useDispatch()
  const route = useRoute()
  const navigation = useNavigation()
  const isModalScreen = useIsModalScreen()
  const webViewRef = useRef(null)
  const groupSlug = route.params.groupSlug
  const currentGroup = useSelector(state => getGroup(state, { slug: groupSlug }))
  const [canGoBack, setCanGoBack] = useState(false)

  useFocusEffect(
    () => {
      isModalScreen
        ? navigation.setOptions(ModalHeaderTransparent({ navigation }))
        : navigation.setOptions({
          title: currentGroup?.name,
          headerLeftOnPress:
            canGoBack ? webViewRef.current.goBack : navigation.goBack
        })
    }
  )

  // Fetch moderators for "Opportunities to Connect" / Message to all moderators feature
  useEffect(() => {
    dispatch(fetchGroupModerators({ slug: groupSlug }))
  }, [groupSlug])

  const joinGroup = async groupToJoinSlug => {
    // Re-fetching CurrentUser fixes some things, but takes too long. Look into reducers
    // such that the Membership update propagates everywhere, including in Feed if
    // currently on this group:
    // await dispatch(fetchCurrentUser())
    await dispatch(fetchGroupDetails({ slug: groupToJoinSlug }))

    navigateToLinkingPath(`/groups/${groupToJoinSlug}`)
  }

  const messageHandler = ({ type, data }) => {
    switch (type) {
      case WebViewMessageTypes.JOINED_GROUP: {
        const { groupSlug } = data

        return joinGroup(groupSlug)
      }
    }
  }

  const handledWebRoutes = [
    '(.*)/explore/group/(.*)'
  ]

  const nativeRouteHandler = ({ pathname, search }) => ({
    '(.*)/:type(post|members)/:id': ({ routeParams }) => {
      const { type, id } = routeParams
      const linkingPath = `${type}/${id}`

      navigateToLinkingPath(linkingPath + search)
    },
    '(.*)': () => {
      navigateToLinkingPath(pathname + search)
    }
  })

  return (
    <HyloWebView
      ref={webViewRef}
      path={`/groups/${groupSlug}/explore`}
      handledWebRoutes={handledWebRoutes}
      nativeRouteHandler={nativeRouteHandler}
      messageHandler={messageHandler}
      // TODO: Consider adding this to the `HyloWebView` standard API
      onNavigationStateChange={({ canGoBack: providedCanGoBack }) => {
        setCanGoBack(providedCanGoBack)
      }}
    />
  )
}
