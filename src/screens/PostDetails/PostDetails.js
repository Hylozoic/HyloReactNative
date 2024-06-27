import React, { useEffect, useState } from 'react'
import { View, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash/fp'
import { AnalyticsEvents } from 'hylo-shared'
import useGoToMember from 'hooks/useGoToMember'
import useIsModalScreen from 'hooks/useIsModalScreen'
import useRouteParams from 'hooks/useRouteParams'
import fetchPostAction from 'store/actions/fetchPost'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { getPresentedPost } from 'store/selectors/getPost'
import { KeyboardAccessoryCommentEditor } from 'components/CommentEditor/CommentEditor'
import Comments from 'components/Comments'
import Loading from 'components/Loading'
import PostCardForDetails from 'components/PostCard/PostCardForDetails'
import SocketSubscriber from 'components/SocketSubscriber'
import { white } from 'style/colors'
import trackAnalyticsEvent from 'store/actions/trackAnalyticsEvent'

export default function PostDetails () {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { id: postId } = useRouteParams()
  const post = useSelector(state => getPresentedPost(state, { postId, forGroupId: currentGroup?.id }))
  const currentGroup = useSelector(getCurrentGroup)
  const commentsRef = React.useRef()
  const isModalScreen = useIsModalScreen()
  const goToMember = useGoToMember()

  const [selectedComment, setSelectedComment] = useState(null)
  const groupId = get('groups.0.id', post)

  const fetchPost = () => dispatch(fetchPostAction(postId))

  const setHeader = () => {
    !isModalScreen && navigation.setOptions({ title: currentGroup?.name })
  }
  const clearSelectedComment = () => {
    setSelectedComment(null)
    commentsRef.current && commentsRef.current.clearHighlightedComment()
  }

  const scrollToSelectedComment = () => {
    commentsRef.current && commentsRef.current.scrollToComment(selectedComment)
  }

  useEffect(() => {
    if (!post) return
    dispatch(trackAnalyticsEvent(AnalyticsEvents.POST_OPENED, {
      postId: post.id,
      groupId: post.groups.map(g => g.id),
      isPublic: post.isPublic,
      topics: post.topics?.map(t => t.name),
      type: post.type
    }))
  }, [post])

  useEffect(() => {
    (async function () {
      try {
        const response = await fetchPost()

        if (!response?.payload?.getData()) {
          throw new Error('not found')
        }
      } catch (e) {
        Alert.alert(
          t("Sorry, we couldn't find that post"),
          t("It may have been removed, or you don't have permission to view it"),
          [{ text: t('Ok'), onPress: () => navigation.replace('Feed')}]
        )
      }

      setHeader()
    })()
  }, [])

  useEffect(() => { setHeader() }, [currentGroup?.slug])

  const renderPostDetails = panHandlers => {
    const firstGroupSlug = get('groups.0.slug', post)
    const showGroups = isModalScreen || post?.groups.find(g => g.slug !== currentGroup?.slug)

    return (
      <Comments
        ref={commentsRef}
        postId={post.id}
        header={(
          <PostCardForDetails
            post={post}
            showGroups={showGroups}
          />
        )}
        onSelect={setSelectedComment}
        slug={firstGroupSlug}
        showMember={goToMember}
        panHandlers={panHandlers}
      />
    )
  }

  if (!post?.creator) return <Loading />

  return (
    <View style={styles.container}>
      <KeyboardAccessoryCommentEditor
        renderScrollable={renderPostDetails}
        isModal={isModalScreen}
        post={post}
        groupId={groupId}
        replyingTo={selectedComment}
        scrollToReplyingTo={scrollToSelectedComment}
        clearReplyingTo={clearSelectedComment}
      />
      <SocketSubscriber type='post' id={post.id} />
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: white
  }
}
