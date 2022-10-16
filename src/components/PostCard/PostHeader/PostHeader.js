import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TextHelpers } from 'hylo-shared'
import { get, filter, isEmpty } from 'lodash/fp'
import getMe from 'store/selectors/getMe'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import getCanModerate from 'store/selectors/getCanModerate'
import { POST_TYPES } from 'store/models/Post'
import { removePost, deletePost, pinPost } from './PostHeader.store'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import PopupMenuButton from 'components/PopupMenuButton'
import FlagContent from 'components/FlagContent'
import { rhino30, rhino50, caribbeanGreen } from 'style/colors'

export default React.memo(function PostHeader ({
  postId,
  creator,
  date,
  type,
  slug,
  showTopic,
  showMember,
  closeOnDelete,
  pinned,
  topics,
  announcement,
  hideMenu,
  hideDateRow,
  smallAvatar
}) {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const group = useSelector(getCurrentGroup)
  const currentUser = useSelector(getMe)
  const canModerate = useSelector(getCanModerate)
  const [flaggingVisible, setFlaggingVisible] = useState(false)

  const isCreator = currentUser && creator && currentUser.id === creator.id
  const canEdit = isCreator
  const canFlag = !isCreator

  const { avatarUrl, name, tagline } = creator

  const handleEditPost = canEdit
    ? () => navigation.navigate('Edit Post', { id: postId })
    : null

  const handleDeletePost = canEdit
    ? () => dispatch(deletePost(postId))
    : null

  const handleDeletePostAndClose = () => {
    if (canEdit) {
      dispatch(deletePost(postId))
      navigation.goBack()
    }
  }

  const handleRemovePost = !isCreator && canModerate
    ? () => dispatch(removePost(postId, slug))
    : null

  const handlePinPost = canModerate && group
    ? () => dispatch(pinPost(postId, group.id))
    : null

  const handleShowMember = () => showMember && showMember(creator.id)

  const topicKeyExtractor = item => item.id

  const renderTopic = ({ item }) => (
    <TouchableOpacity onPress={() => showTopic && showTopic(item.name)}>
      <Text style={styles.topicLabel}>#{item.name}</Text>
    </TouchableOpacity>
  )

  const showTopics = !isEmpty(topics)

  // Used to generate a link to this post from the backend.
  const linkData = {
    slug,
    id: postId,
    type: 'post'
  }

  const handleFlagPost = canFlag
    ? () => setFlaggingVisible(true)
    : null

  const deletePostWithConfirm = handleDeletePost
    ? () => Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this post?',
        [
          {
            text: 'Yes',
            onPress: () => closeOnDelete
              ? handleDeletePostAndClose()
              : handleDeletePost()
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      )
    : null

  const removePostWithConfirm = handleRemovePost
    ? () => Alert.alert(
        'Confirm Removal',
        'Are you sure you want to remove this post from this group?',
        [
          { text: 'Yes', onPress: () => handleRemovePost() },
          { text: 'Cancel', style: 'cancel' }
        ])
    : null

  return (
    <View style={styles.container}>
      <View style={styles.avatarSpacing}>
        <TouchableOpacity onPress={handleShowMember}>
          {!!avatarUrl && <Avatar avatarUrl={avatarUrl} dimension={smallAvatar && 20} />}
        </TouchableOpacity>
      </View>
      <View style={styles.meta}>
        <TouchableOpacity onPress={handleShowMember}>
          {name && (
            <Text style={styles.username}>{name}</Text>
          )}
          {!!tagline && (
            <Text style={styles.metaText}>{tagline}</Text>
          )}
        </TouchableOpacity>
        {!hideDateRow && (
          <View style={styles.dateRow}>
            <Text style={styles.metaText}>{TextHelpers.humanDate(date)}</Text>
            {!!showTopics && (
              <FlatList
                data={topics}
                style={styles.topicList}
                horizontal
                keyExtractor={topicKeyExtractor}
                showsHorizontalScrollIndicator={false}
                renderItem={renderTopic}
              />
            )}
          </View>
        )}
      </View>
      <View style={styles.upperRight}>
        {pinned && (
          <Icon name='Pin' style={styles.pinIcon} />
        )}
        {announcement && (
          <Icon name='Announcement' style={styles.announcementIcon} />
        )}
        {type && (
          <PostLabel type={type} />
        )}
        {!hideMenu && (
          <PostMenu
            removePost={removePostWithConfirm}
            deletePost={deletePostWithConfirm}
            editPost={handleEditPost}
            flagPost={handleFlagPost}
            pinPost={handlePinPost}
            pinned={pinned}
          />
        )}
        {flaggingVisible && (
          <FlagContent
            type='post'
            linkData={linkData}
            onClose={() => this.setState({ flaggingVisible: false })}
          />
        )}
      </View>
    </View>
  )
})

export function PostMenu ({ deletePost, editPost, flagPost, removePost, pinPost, pinned }) {
  // If the function is defined, than it's a valid action
  const flagLabel = 'Flag this Post'
  const deleteLabel = 'Delete this Post'
  const removeLabel = 'Remove Post From Group'
  const pinLabel = pinned ? 'Unpin' : 'Pin'

  const actions = filter(x => x[1], [
    [pinLabel, pinPost],
    ['Edit this Post', editPost],
    [flagLabel, flagPost],
    [removeLabel, removePost],
    [deleteLabel, deletePost]
  ])

  if (isEmpty(actions)) return null

  const destructiveLabels = [flagLabel, deleteLabel, removeLabel]
  const destructiveButtonIndex = destructiveLabels.includes(actions[actions.length - 1][0]) ? actions.length - 1 : -1

  return (
    <PopupMenuButton
      actions={actions}
      hitSlop={{ top: 20, bottom: 10, left: 10, right: 15 }}
      destructiveButtonIndex={destructiveButtonIndex}
    >
      <Icon name='More' style={styles.menuIcon} />
    </PopupMenuButton>
  )
}

export function PostLabel ({ type }) {
  // Prevent redboxing on missing type in styles object
  // TODO: is this the default style we want to use?
  const labelTypeStyle = get(type, labelStyles) || labelStyles.discussion
  const boxStyle = [labelStyles.box, labelTypeStyle.box]
  const textStyle = [labelStyles.text, labelTypeStyle.text]
  return (
    <View style={boxStyle}>
      <Text style={textStyle}>
        {type.toUpperCase()}
      </Text>
    </View>
  )
}

const styles = {
  container: {
    flexDirection: 'row',
    marginBottom: 10
  },
  meta: {
    paddingTop: 7 + 9,
    paddingRight: 7,
    flex: 1,
    justifyContent: 'space-around'
  },
  avatarSpacing: {
    paddingTop: 7 + 9,
    paddingLeft: 7 + 5,
    paddingRight: 7
  },
  avatarNudge: {
    paddingTop: 18
  },
  username: {
    fontSize: 14,
    color: '#363D3C',
    fontFamily: 'Circular-Bold'
  },
  usernameNudge: {
    top: 10
  },
  dateRow: {
    flexDirection: 'row',
    flex: 1
  },
  metaText: {
    fontSize: 12,
    color: rhino30,
    fontFamily: 'Circular-Book'
  },
  spacer: {
    fontSize: 12,
    color: rhino30,
    fontFamily: 'Circular-Book',
    marginHorizontal: 5
  },
  contextLabel: {
    fontSize: 12,
    fontFamily: 'Circular-Book',
    color: caribbeanGreen
  },
  topicList: {
    marginLeft: 4,
    flex: 1
  },
  topicLabel: {
    fontSize: 12,
    paddingRight: 5,
    flex: 1,
    fontFamily: 'Circular-Book',
    color: caribbeanGreen
  },
  upperRight: {
    position: 'absolute',
    paddingTop: 14,
    paddingRight: 6,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  pinIcon: {
    fontSize: 20,
    color: rhino50,
    marginRight: 10
  },
  menuIcon: {
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 5,
    color: rhino50
  },
  announcementIcon: {
    color: caribbeanGreen,
    fontSize: 20,
    alignItems: 'flex-end',
    marginRight: 2
  }
}

const labelStyles = {
  box: {
    borderRadius: 4,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    marginRight: 4,
    marginTop: 1
  },
  text: {
    fontSize: 10,
    fontFamily: 'Circular-Bold',
    letterSpacing: 0.8
  },
  discussion: {
    box: {
      backgroundColor: POST_TYPES.discussion.backgroundColor
    },
    text: {
      color: POST_TYPES.discussion.primaryColor
    }
  },
  event: {
    box: {
      backgroundColor: POST_TYPES.event.backgroundColor
    },
    text: {
      color: POST_TYPES.event.primaryColor
    }
  },
  offer: {
    box: {
      backgroundColor: POST_TYPES.offer.backgroundColor
    },
    text: {
      color: POST_TYPES.offer.primaryColor
    }
  },
  resource: {
    box: {
      backgroundColor: POST_TYPES.resource.backgroundColor
    },
    text: {
      color: POST_TYPES.resource.primaryColor
    }
  },
  project: {
    box: {
      backgroundColor: POST_TYPES.project.backgroundColor
    },
    text: {
      color: POST_TYPES.project.primaryColor
    }
  },
  request: {
    box: {
      backgroundColor: POST_TYPES.request.backgroundColor
    },
    text: {
      color: POST_TYPES.request.primaryColor
    }
  }
}
