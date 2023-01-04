import React from 'react'
import { View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { find, get } from 'lodash/fp'
import { LocationHelpers } from 'hylo-shared'
import { DEFAULT_APP_HOST } from 'navigation/linking'
import { openURL } from 'hooks/useOpenURL'
import useChangeToGroup from 'hooks/useChangeToGroup'
import useGoToMember from 'hooks/useGoToMember'
import useGoToTopic from 'hooks/useGoToTopic'
import getMe from 'store/selectors/getMe'
import joinProjectAction from 'store/actions/joinProject'
import leaveProjectAction from 'store/actions/leaveProject'
import respondToEventAction from 'store/actions/respondToEvent'
import Button from 'components/Button'
import Files from 'components/Files'
import Icon from 'components/Icon'
import ImageAttachments from 'components/ImageAttachments'
import PostBody from 'components/PostCard/PostBody'
import PostFooter from 'components/PostCard/PostFooter'
import PostGroups from 'components/PostCard/PostGroups'
import PostHeader from 'components/PostCard/PostHeader'
import ProjectMembersSummary from 'components/ProjectMembersSummary'
import Topics from 'components/Topics'
import styles from 'components/PostCard/PostCard.styles'
import { SvgUri } from 'react-native-svg'

export default function PostCardForDetails ({ post, showGroups = true }) {
  const dispatch = useDispatch()
  const navigation = useNavigation
  const currentUser = useSelector(getMe)
  const changeToGroup = useChangeToGroup()
  const goToMember = useGoToMember()
  const goToTopic = useGoToTopic()

  const projectManagementToolMatch = post.projectManagementLink &&
    post.projectManagementLink.match(/asana|trello|airtable|clickup|confluence|teamwork|notion|wrike|zoho/)
  const projectManagementLinkSvgUri = projectManagementToolMatch &&
    `${DEFAULT_APP_HOST}/assets/pm-tools/${projectManagementToolMatch[0]}.svg`

  const donationServiceMatch = post.donationsLink &&
    post.donationsLink.match(/cash|clover|gofundme|opencollective|paypal|squareup|venmo/)
  const donationServiceSvgUri = donationServiceMatch &&
    `${DEFAULT_APP_HOST}/assets/payment-services/${donationServiceMatch[0]}.svg`

  const handleRespondToEvent = response => dispatch(respondToEventAction(post.id, response))
  const joinProject = () => dispatch(joinProjectAction(post.id))
  const leaveProject = () => dispatch(leaveProjectAction(post.id))
  const editPost = () => navigation.navigate('Edit Post', { id: post.id })
  const openProjectMembersModal = () => navigation.navigate('Project Members', { id: post.id, members: get('members', post) })

  const isProject = get('type', post) === 'project'
  const isProjectMember = find(member => member.id === currentUser.id, post.members)
  const locationText = LocationHelpers.generalLocationString(post.locationObject, post.location)
  const images = post.imageUrls && post.imageUrls.map(uri => ({ uri }))

  return (
    <View style={styles.detailsContainer}>
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
        style={{ paddingVertical: 14 }}
        title={post.title}
        type={post.type}
      />
      {!images && (
        <Topics
          topics={post.topics}
          onPress={t => goToTopic(t.name)}
          style={styles.topics}
        />
      )}
      {images && (
        <ImageAttachments
          creator={post.creator}
          images={images}
          style={styles.images}
          title={post.title}
        >
          <Topics
            topics={post.topics}
            onPress={t => goToTopic(t.name)}
            style={[styles.topics, styles.topicsOnImage]}
          />
        </ImageAttachments>
      )}
      {!!locationText && (
        <View style={styles.locationRow}>
          <Icon style={styles.locationIcon} name='Location' />
          <Text style={styles.locationText} selectable>{locationText}</Text>
        </View>
      )}
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
      <Files urls={post.fileUrls} style={styles.files} />
      {isProject && (
        <ProjectMembersSummary
          dimension={34}
          members={post.members}
          onPress={openProjectMembersModal}
          style={styles.projectMembersContainer}
        />
      )}
      {isProject && post.projectManagementLink && (
        <View style={styles.donationsLink}>
          {projectManagementLinkSvgUri && (
            <>
              <Text>
                This project is being managed on
              </Text>
              <View style={{ flex: 1, paddingLeft: 5 }}><SvgUri width='50' uri={projectManagementLinkSvgUri} /></View>
            </>
          )}
          {!projectManagementLinkSvgUri && (
            <Text>View project management tool</Text>
          )}
          <Button
            style={{ width: 80, height: 25, fontSize: 11 }}
            onPress={() => openURL(post.projectManagementLink)}
            text='View tasks'
          />
        </View>
      )}
      {post.donationsLink && (
        <View style={styles.donationsLink}>
          {donationServiceSvgUri && (
            <>
              <Text>
                Support this project on
              </Text>
              <View style={{ flex: 1, paddingLeft: 5 }}><SvgUri width='50' uri={donationServiceSvgUri} /></View>
            </>
          )}
          {!donationServiceSvgUri && (
            <Text>
              Support this project
            </Text>
          )}
          <Button
            style={{ width: 80, height: 25, fontSize: 11 }}
            onPress={() => openURL(post.donationsLink)}
            text='Contribute'
          />
        </View>
      )}
      {isProject && (
        <JoinProjectButton
          leaving={isProjectMember}
          onPress={isProjectMember ? leaveProject : joinProject}
          style={styles.projectJoinButton}
        />
      )}
      {showGroups && (
        <PostGroups
          goToGroup={changeToGroup}
          groups={post.groups}
          includePublic={post.isPublic}
          style={[styles.groups]}
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
