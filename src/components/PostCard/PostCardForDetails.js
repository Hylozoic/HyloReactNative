import React from 'react'
import { View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { find, get } from 'lodash/fp'
import useChangeToGroup from 'hooks/useChangeToGroup'
import getMe from 'store/selectors/getMe'
import joinProjectAction from 'store/actions/joinProject'
import leaveProjectAction from 'store/actions/leaveProject'
import respondToEventAction from 'store/actions/respondToEvent'
import Button from 'components/Button'
import Files from 'components/Files'
import Icon from 'components/Icon'
import PostBody from 'components/PostCard/PostBody'
import PostFooter from 'components/PostCard/PostFooter'
import PostGroups from 'components/PostCard/PostGroups'
import PostHeader from 'components/PostCard/PostHeader'
import ImageAttachments from 'components/ImageAttachments'
import ProjectMembersSummary from 'components/ProjectMembersSummary'
import styles from 'screens/PostDetails/PostDetails.styles'
import useGoToMember from 'hooks/useGoToMember'
import useGoToTopic from 'hooks/useGoToTopic'

export default function PostCardForDetails ({ post, showGroups = true }) {
  const dispatch = useDispatch()
  const navigation = useNavigation
  const currentUser = useSelector(getMe)
  const changeToGroup = useChangeToGroup()
  const goToMember = useGoToMember()
  const goToTopic = useGoToTopic()

  const handleRespondToEvent = response => dispatch(respondToEventAction(post.id, response))
  const joinProject = () => dispatch(joinProjectAction(post.id))
  const leaveProject = () => dispatch(leaveProjectAction(post.id))
  const editPost = () => navigation.navigate('Edit Post', { id: post.id })
  const openProjectMembersModal = () => navigation.navigate('Project Members', { id: post.id, members: get('members', post) })

  const isProject = get('type', post) === 'project'
  const isProjectMember = find(member => member.id === currentUser.id, post.members)
  const locationFullText = post.location || (post.locationObject && post.locationObject.fullText)
  const images = post.imageUrls && post.imageUrls.map(uri => ({ uri }))

  return (
    <View style={styles.postCard}>
      <PostHeader
        announcement={post.announcement}
        closeOnDelete
        creator={post.creator}
        date={post.createdAt}
        editPost={editPost}
        goToGroup={changeToGroup}
        groups={post.groups}
        pinned={post.pinned}
        postId={post.id}
        showMember={goToMember}
        showTopic={goToTopic}
        title={post.title}
        topics={post.topics}
        type={post.type}
      />
      <ImageAttachments
        creator={post.creator}
        images={images}
        linked
        title={post.title}
      />
      <PostBody
        details={post.details}
        endTime={post.endTime}
        linkPreview={post.linkPreview}
        linkPreviewFeatured={post.linkPreviewFeatured}
        myEventResponse={post.myEventResponse}
        respondToEvent={handleRespondToEvent}
        startTime={post.startTime}
        title={post.title}
        type={post.type}
      />
      <Files urls={post.fileUrls} style={{ marginBottom: 10 }} />
      {isProject && (
        <ProjectMembersSummary
          dimension={34}
          members={post.members}
          onPress={openProjectMembersModal}
          style={styles.projectMembersContainer}
        />
      )}
      {isProject && (
        <JoinProjectButton
          leaving={isProjectMember}
          onPress={isProjectMember ? leaveProject : joinProject}
          style={styles.projectJoinButton}
        />
      )}
      {!!locationFullText && (
        <View style={styles.infoRow}>
          <Icon style={styles.locationIcon} name='Location' />
          <Text style={styles.infoRowInfo} selectable>{locationFullText}</Text>
        </View>
      )}
      {showGroups && (
        <PostGroups
          goToGroup={changeToGroup}
          groups={post.groups}
          includePublic={post.isPublic}
          style={[styles.infoRow]}
        />
      )}
      <PostFooter
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        currentUser={currentUser}
        eventInvitations={post.eventInvitations}
        forDetails
        postId={post.id}
        members={post.members}
        myVote={post.myVote}
        style={styles.postFooter}
        type={post.type}
        votesTotal={post.votesTotal}
      />
    </View>
  )
}

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
