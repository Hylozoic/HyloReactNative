import React, { useEffect, useState } from 'react'
import { View, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash/fp'
import useGoToMember from 'hooks/useGoToMember'
import useIsModalScreen from 'hooks/useIsModalScreen'
import fetchPostAction from 'store/actions/fetchPost'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { getPresentedPost } from 'store/selectors/getPost'
import getRouteParam from 'store/selectors/getRouteParam'
import { KeyboardAccessoryCommentEditor } from 'components/CommentEditor/CommentEditor'
import Comments from 'components/Comments'
import Loading from 'components/Loading'
import PostCardForDetails from 'components/PostCard/PostCardForDetails'
import SocketSubscriber from 'components/SocketSubscriber'
import { white } from 'style/colors'

/*

TODO: Confirm that we're ok not checking for focus:

Confirm by testing for scenarios where many of this screen could be mounted
in the navigation stack at once. Modals are one possible case, but I don't
think there is currently much chances for that.

Relevant removed code from the class component:

const isFocused = useIsFocused()
shouldComponentUpdate (nextProps) { return !!nextProps.isFocused }

*/
export default function PostDetails () {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()
  const postId = getRouteParam('id', route)
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
  console.log(route, 'route')
  useEffect(() => {
    (async function () {
      try {
        const response = await fetchPost()

        if (!response?.payload?.getData()) {
          throw new Error('not found')
        }
      } catch (e) {
        Alert.alert(
          "Sorry, we couldn't find that post",
          "It may have been removed, or you don't have permission to view it",
          [{ text: 'Ok', onPress: () => navigation.replace('Feed')}]
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
        commentIdFromParams={route.params?.commentId}
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
        postId={post.id}
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
