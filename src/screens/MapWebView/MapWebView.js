import React, { useState, useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { useSelector } from 'react-redux'
import { navigateToLinkingPathInApp } from 'navigation/linking/custom'
import useGroupSelect from 'hooks/useGroupSelect'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import HyloWebView from 'screens/HyloWebView'

// TODO: Move these into common library (most likely navigation/linking/custom.js)
//  MATCHER_GROUP_SLUG currently excludes all and public (|\/all$|\/public)
export const MATCHER_GROUP_SLUG = '[a-zA-Z0-9\-]+$'
export const MATCHER_GROUP_URL = `\/groups\/${MATCHER_GROUP_SLUG}$`
export const MATCHER_ALL_AND_PUBLIC_GROUP_URL = `\/(all|public)$`

export default function MapWebView ({ navigation }) {
  const webViewRef = useRef(null)
  const group = useSelector(getCurrentGroup)
  const [path, setPath] = useState()

  // Going to the map will always switch currentGroup context
  useGroupSelect()

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: group?.name
      })
      if ([ALL_GROUP_ID, PUBLIC_GROUP_ID].includes(group?.slug)) {
        setPath(() => `${group?.slug}/map`)
      } else {
        setPath(() => `groups/${group?.slug}/map`)
      }
    }, [group?.slug])
  )

  const onMessage = event => {
    const  { url } = JSON.parse(event.nativeEvent.data)
    // Special case to re-write route for Member details in a group context:
    //   /groups/my-lovely-group/members/<member-id>
    // ...to go to context-free Member Detail modal:
    //   /all/member/<member-id>
    if (url?.match(/\/groups\/*.+\/members\/*.+$/)) {
      const memberModalPath = '/all/' + url.split('/').slice(3,5).join('/')
      navigateToLinkingPathInApp(memberModalPath)
    // Matches: /groups/our-awesome-group/map/post/<post-id>, /(all|public)/post/<post-id>
    } else if (url?.match(/\/post|\/members/)) {
      navigateToLinkingPathInApp(url)
    // Matches: /groups/our-awesome-group, /all, /public
    // re-writes linking to go to Group Detail modal
    } else if (url.match(new RegExp(MATCHER_GROUP_URL))) {
      navigateToLinkingPathInApp(url + '/detail')
    } else if (url.match(new RegExp(MATCHER_ALL_AND_PUBLIC_GROUP_URL))) {
      navigateToLinkingPathInApp(url + '/map')
    } else {
      // NOTE: Right now this captures saved search view calls, may capture too much?
      navigateToLinkingPathInApp(url)
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
