import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import getRouteParam from 'store/selectors/getRouteParam'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import HyloWebView from 'components/HyloWebView'

export default function ChatRoom () {
  const navigation = useNavigation()
  const route = useRoute()
  const currentGroup = useSelector(getCurrentGroup)
  const topicName = getRouteParam('topicName', route)
  const path = `/groups/${currentGroup.slug}/topics/${topicName}`

  // const nativeRouteHandler = () => ({
  //   '(.*)/topics/:topicName': ({ routeParams: { topicName } }) => {
  //     navigation.navigate('Feed', { topicName })
  //   }
  // })

  useEffect(() => {
    navigation.setOptions({ headerTitle: currentGroup?.name })
  }, [currentGroup?.name])

  return (
    <HyloWebView
      // nativeRouteHandler={nativeRouteHandler}
      path={path}
    />
  )
}
