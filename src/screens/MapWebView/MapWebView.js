import React, { useState, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { openURL } from 'hooks/useOpenURL'
import { modalScreenName } from 'hooks/useIsModalScreen'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import HyloWebView from 'components/HyloWebView'

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
        setPath(() => `/${group?.slug}/map`)
      } else {
        setPath(() => `/groups/${group?.slug}/map`)
      }
      // Re-enables swipeEnabled on DrawerNavigator when screen blurs
      return () => navigation.getParent()?.getParent()?.setOptions({ swipeEnabled: true })
    }, [group?.slug])
  )

  const handledWebRoutes = [
    // To keep saved search retrieval from resetting group context in the App:
    '(.*)/map',
    '(.*)/map/create'
  ]
  const nativeRouteHandler = () => ({
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
    '(.*)/group/:groupSlug([a-zA-Z0-9-]+)': ({ routeParams }) => {
      const { groupSlug } = routeParams

      navigation.navigate(modalScreenName('Group Explore'), { groupSlug })
    },
    // TODO: This is probably best here but currently doing the below as a test case of `openURL`
    // '(.*)/create/post': ({ routeParams }) => {
    //   const { newPostType } = routeParams

    //   webViewRef?.current?.goBack()
    //   navigation.navigate('Edit Post', { type: newPostType })
    // },
    '(.*)': ({ pathname, search }) => {
      openURL(pathname + search)
    }
  })

  return (
    <HyloWebView
      /*

        Required for emulator with the map but may be disadvantageous for actual
        devices as this has the effect of disabling hardware acceleration:

        ref. https://github.com/react-native-webview/react-native-webview/issues/575#issuecomment-800997520

        * Map still may not render on some older Android OS versions / devices
          adding a check for Android API version here and switching value
          to 'software' for API < 28'ish API may fix those cases.

      */
      handledWebRoutes={handledWebRoutes}
      androidLayerType='hardware'
      nativeRouteHandler={nativeRouteHandler}
      path={path}
      ref={webViewRef}
    />
  )
}
