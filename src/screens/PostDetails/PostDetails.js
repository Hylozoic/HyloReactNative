/* eslint-disable camelcase */
import React from 'react'
import { Linking, View, Text, TouchableOpacity, Alert, Button as ReactButton } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { get, isEmpty, find } from 'lodash/fp'
import Comments from 'components/Comments'
import PostBody from 'components/PostCard/PostBody'
import PostCommunities from 'components/PostCard/PostCommunities'
import PostImage from 'components/PostCard/PostImage'
import PostFooter from 'components/PostCard/PostFooter'
import PostHeader from 'components/PostCard/PostHeader'
import ProjectMembersSummary from 'components/ProjectMembersSummary'
import LoadingScreen from 'screens/LoadingScreen'
import Button from 'components/Button'
import SocketSubscriber from 'components/SocketSubscriber'
import { FileLabel } from 'screens/PostEditor/FileSelector'
import Icon from 'components/Icon'
import InlineEditor, { toHtml } from 'components/InlineEditor'
import KeyboardAccessoryView from 'components/KeyboardAccessoryView'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import styles from './PostDetails.styles'
import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory'

export function PostCardForDetails ({
  post,
  currentUser,
  editPost,
  isProject,
  joinProject,
  leaveProject,
  showMember,
  showTopic,
  goToMembers,
  goToCommunity
}) {
  const slug = get('communities.0.slug', post)
  const isMember = find(member => member.id === currentUser.id, post.members)
  const location = post.location || (post.locationObject && post.locationObject.fullText)

  return (
    <View style={styles.postCard}>
      <PostHeader
        creator={post.creator}
        date={post.createdAt}
        type={post.type}
        editPost={editPost}
        communities={post.communities}
        slug={slug}
        pinned={post.pinned}
        topics={post.topics}
        showTopic={showTopic}
        postId={post.id}
        showMember={showMember}
        goToCommunity={goToCommunity}
        announcement={post.announcement}
        closeOnDelete
      />
      <PostImage imageUrls={post.imageUrls} linked />
      <PostBody
        type={post.type}
        title={post.title}
        details={post.details}
        startTime={post.startTime}
        endTime={post.endTime}
        linkPreview={post.linkPreview}
        slug={slug}
        showMember={showMember}
        showTopic={showTopic}
      />
      {!isEmpty(post.fileUrls) && <Files urls={post.fileUrls} />}
      {isProject &&
        <ProjectMembersSummary
          members={post.members}
          onPress={goToMembers}
          dimension={34}
          style={styles.projectMembersContainer}
        />}
      {isProject && <JoinProjectButton
        style={styles.joinButton}
        leaving={isMember}
        onPress={isMember ? leaveProject : joinProject}
                    />}
      {!!location && (
        <View style={styles.infoRow}>
          <Icon style={styles.locationIcon} name='Location' />
          <Text style={styles.infoRowInfo} selectable>{location}</Text>
        </View>
      )}
      <PostCommunities
        communities={post.communities}
        includePublic={post.isPublic}
        slug={slug}
        style={[styles.infoRow]}
        goToCommunity={goToCommunity}
        shouldShowCommunities
      />
      <PostFooter
        style={styles.postFooter}
        id={post.id}
        currentUser={currentUser}
        commenters={post.commenters}
        commentsTotal={post.commentsTotal}
        votesTotal={post.votesTotal}
        myVote={post.myVote}
        showActivityLabel
      />
    </View>
  )
}
export default class PostDetails extends React.Component {
  state = {
    commentText: ''
  }

  commentsRef = React.createRef()

  componentDidMount () {
    this.props.fetchPost()
    this.props.navigation.setOptions({
      headerTitle: this.props.currentCommunity.name
    })
  }

  shouldComponentUpdate (nextProps) {
    return !!nextProps.isFocused
  }

  onShowTopic = (topicId) => this.props.showTopic(topicId, get('post.communities.0.id', this.props))

  handleCreateComment = (commentText) => {
    const commentTextAsHtml = toHtml(commentText)

    if (!isEmpty(commentTextAsHtml)) {
      this.setState(() => ({ submitting: true }))
      return this.props.createComment(commentTextAsHtml)
        .then(({ error }) => {
          if (error) {
            Alert.alert("Your comment couldn't be saved; please try again.")
            this.setState(() => ({ submitting: false }))
          } else {
            this.setState(() => ({ commentText: '', submitting: false }))
            // Scrolls to the last comment (the one that was created)
            this.commentsRef.current.scrollToEnd()
          }
        })
    }
  }

  handleCommentOnChange = (commentText) => {
    this.setState(() => ({ commentText }))
  }

  render () {
    const {
      post,
      currentUser,
      pending,
      showMember
    } = this.props
    const {
      commentText,
      submitting
    } = this.state

    if (!post || !post.creator || !post.title) return <LoadingScreen />

    const slug = get('communities.0.slug', post)
    const communityId = get('communities.0.id', post)
    const isMember = find(member => member.id === currentUser.id, post.members)
    const location = post.location || (post.locationObject && post.locationObject.fullText)

    return (<>
      <SafeAreaView style={styles.container}>
        {/* <KeyboardFriendlyView style={styles.container}> */}
          <Comments
            ref={this.commentsRef}
            header={(
              <PostCardForDetails
                {...this.props}
                showTopic={this.onShowTopic}
                isMember={isMember}
                location={location}
              />
            )}
            // footer={(
            //   currentUser && (
            //     <InlineEditor
            //       onChange={this.handleCommentOnChange}
            //       onSubmit={this.handleCreateComment}
            //       value={commentText}
            //       style={styles.inlineEditor}
            //       submitting={submitting}
            //       placeholder='Write a comment...'
            //       communityId={communityId}
            //     />
            //   )
            // )}
            postId={post.id}
            postPending={pending}
            showMember={showMember}
            showTopic={this.onShowTopic}
            slug={slug}
          />
          <SocketSubscriber type='post' id={post.id} />
        {/* </KeyboardFriendlyView> */}
        <KeyboardAccessoryView>
          <InlineEditor
                  onChange={this.handleCommentOnChange}
                  onSubmit={this.handleCreateComment}
                  value={commentText}
                  style={styles.inlineEditor}
                  submitting={submitting}
                  placeholder='Write a comment...'
                  communityId={communityId}
                />
        </KeyboardAccessoryView>
      </SafeAreaView>
    </>)
  }
}

export function Files ({ urls }) {
  return (
    <View style={styles.files}>
      {urls.map(url =>
        <TouchableOpacity key={url} onPress={openUrlFn(url)}>
          <FileLabel url={url} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const openUrlFn = url => () =>
  Linking.canOpenURL(url).then(ok => ok && Linking.openURL(url))

export function JoinProjectButton ({ style, onPress, leaving }) {
  const text = leaving ? 'Leave Project' : 'Join Project'
  return (
    <Button
      style={style}
      text={text}
      onPress={onPress}
    />
  )
}
