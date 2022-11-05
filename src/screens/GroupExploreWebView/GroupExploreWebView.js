import React, { useCallback, useRef, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { WebViewMessageTypes } from 'hylo-shared'
import { navigateToLinkingPath } from 'navigation/linking'
import HyloWebView from 'components/HyloWebView'
import { useDispatch } from 'react-redux'
import fetchGroupModerators from 'store/actions/fetchGroupModerators'
import fetchGroupDetails from 'store/actions/fetchGroupDetails'
import ModalHeaderTransparent from 'navigation/headers/ModalHeaderTransparent'
import { isModalScreen } from 'navigation/linking/helpers'

export default function GroupExploreWebView ({ navigation, route }) {
  const dispatch = useDispatch()
  const webViewRef = useRef(null)
  const groupSlug = route.params.groupSlug

  useFocusEffect(
    useCallback(() => {
      isModalScreen(route?.name)
        ? navigation.setOptions(ModalHeaderTransparent({ navigation }))
        : navigation.setOptions({ title: groupSlug })
    }, [groupSlug, navigation])
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
      onNavigationStateChange={(navState) => {
        if (navState.canGoBack) {
          navigation.setParams({
            headerLeftInfo: {
              title: '',
              onPress: () => webViewRef.current.goBack()
            }
          })
        } else {
          navigation.setParams({
            headerLeftInfo: null
          })
        }
      }}
    />
  )
}
