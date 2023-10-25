import React, { useRef, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { URL } from 'react-native-url-polyfill'
import { WebViewMessageTypes } from 'hylo-shared'
import { DEFAULT_APP_HOST } from 'navigation/linking'
import { openURL } from 'hooks/useOpenURL'
import useIsModalScreen, { modalScreenName } from 'hooks/useIsModalScreen'
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
  const groupSlug = route?.params?.groupSlug
  const currentGroup = useSelector(state => getGroup(state, { slug: groupSlug }))
  const [path, setPath] = useState()
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
    if (groupSlug) {
      setPath(`/groups/${groupSlug}/explore`)
      dispatch(fetchGroupModerators({ slug: groupSlug }))
    }
  }, [groupSlug])

  const joinGroup = async groupToJoinSlug => {
    // Re-fetching CurrentUser fixes some things, but takes too long. Look into reducers
    // such that the Membership update propagates everywhere, including in Feed if
    // currently on this group:
    // await dispatch(fetchCurrentUser())
    await dispatch(fetchGroupDetails({ slug: groupToJoinSlug }))

    openURL(`/groups/${groupToJoinSlug}`)
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

      switch (type) {
        case 'post': {
          navigation.navigate('Post Details', { id })
          break
        }
        case 'members': {
          navigation.navigate('Member', { id })
          break
        }
      }
    },
    '/groups/:groupSlug': ({ routeParams }) => {
      navigation.navigate(modalScreenName('Group Explore'), routeParams)
    },
    '(.*)': () => {
      openURL(pathname + search)
    }
  })

  if (!groupSlug) return null

  return (
    <HyloWebView
      ref={webViewRef}
      path={path}
      handledWebRoutes={handledWebRoutes}
      nativeRouteHandler={nativeRouteHandler}
      messageHandler={messageHandler}
      // TODO: Consider adding this to the `HyloWebView` standard API
      onNavigationStateChange={({ url, canGoBack: providedCanGoBack }) => {
        const { pathname } = new URL(url, DEFAULT_APP_HOST)

        // NOTE: Currently ignores possible changes to querystring (`search`)
        setCanGoBack(providedCanGoBack && pathname !== path)
      }}
    />
  )
}
