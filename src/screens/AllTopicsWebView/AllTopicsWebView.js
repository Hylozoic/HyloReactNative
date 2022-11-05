import React from 'react'
import { useSelector } from 'react-redux'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { navigateToLinkingPath } from 'navigation/linking'
import HyloWebView from 'screens/HyloWebView'

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
      nativeRouteHandler={nativeRouteHandler}
      path={path}
    />
  )
}
