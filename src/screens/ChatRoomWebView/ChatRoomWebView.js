import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { modalScreenName } from 'hooks/useIsModalScreen'
import { openURL } from 'hooks/useOpenURL'
import getRouteParam from 'store/selectors/getRouteParam'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import HyloWebView from 'components/HyloWebView'

export default function ChatRoom () {
  const navigation = useNavigation()
  const route = useRoute()
  const currentGroup = useSelector(getCurrentGroup)
  const topicName = getRouteParam('topicName', route)
  const path = `/groups/${currentGroup.slug}/topics/${topicName}`
  const handledWebRoutes = [
    `/groups/${currentGroup.slug}/topics/:topicName`
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
      navigation.navigate(modalScreenName('Group Explore'), routeParams)
    }
    // '(.*)/evo-uploads/(.*)': params => {
    //   console.log('!!!! params', params)
    // },
    // '(.*)': ({ pathname, search, ...rest }) => {
    //   console.log('!!!!~ rest', rest)
    //   // openURL(pathname + search)
    // }
  })

  useEffect(() => {
    navigation.setOptions({ headerTitle: currentGroup?.name })
  }, [currentGroup?.name])

  return (
    <HyloWebView
      handledWebRoutes={handledWebRoutes}
      nativeRouteHandler={nativeRouteHandler}
      path={path}
    />
  )
}
