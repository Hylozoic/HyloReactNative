import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { modalScreenName } from 'hooks/useIsModalScreen'
import useRouteParams from 'hooks/useRouteParams'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import HyloWebView from 'components/HyloWebView'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import GroupWelcomeCheck from 'components/GroupWelcomeCheck'

export default function ChatRoom () {
  const navigation = useNavigation()
  const route = useRoute()
  const currentGroup = useSelector(getCurrentGroup)
  const { topicName } = useRouteParams()
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
    '(.*)/post/:postId/edit': ({ routeParams }) => {
      navigation.navigate('Edit Post', { id: routeParams.postId })
    },
    '(.*)/group/:groupSlug([a-zA-Z0-9-]+)': ({ routeParams }) => {
      navigation.navigate(modalScreenName('Group Explore'), routeParams)
    }
  })

  useEffect(() => {
    navigation.setOptions({ headerTitle: currentGroup?.name })
  }, [currentGroup?.name])

  return (
    <KeyboardFriendlyView style={{ flex: 1 }}>
      <GroupWelcomeCheck groupId={currentGroup?.id} />
      <HyloWebView
        handledWebRoutes={handledWebRoutes}
        nativeRouteHandler={nativeRouteHandler}
        path={path}
        route={route}
      />
    </KeyboardFriendlyView>
  )
}
