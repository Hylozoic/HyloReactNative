import React from 'react'
import { useSelector } from 'react-redux'
import { WebViewMessageTypes } from 'hylo-shared'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { navigateToLinkingPath } from 'navigation/linking'
import HyloWebView, { parseWebViewMessage } from 'screens/HyloWebView'

export default function AllTopicsWebView () {
  const currentGroup = useSelector(getCurrentGroup)
  const path = currentGroup?.slug === 'all'
    ? `/${currentGroup?.slug}/topics`
    : `/groups/${currentGroup?.slug}/topics`

  const nativeRouteHandler = ({ pathname, search }) => ({
    '(.*)': () => navigateToLinkingPath(pathname + search)
  })

  return (
    <HyloWebView
      hideKeyboardAccessoryView
      nativeRouteHandler={nativeRouteHandler}
      path={path}
    />
  )
}
