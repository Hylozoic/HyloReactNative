import React from 'react'
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native'
import { get, filter, isEmpty } from 'lodash/fp'
import { humanDate } from 'hylo-utils/text'
import {
  rhino30,
  rhino50,
  caribbeanGreen,
  prim,
  fuchsiaPink,
  mangoYellow,
  havelockBlue,
  westSide,
  jade,
  fakeAlpha
} from 'style/colors'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import PopupMenuButton from 'components/PopupMenuButton'
import FlagContent from 'components/FlagContent'

export default class PostHeader extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      creator: {},
      flaggingVisible: false
    }
  }

  handleEditPost = () => {
    this.props.editPost(this.props.postId)
  }

  handleShowMember = () => {
    this.props.showMember && this.props.showMember(this.props.creator.id)
  }

  topicKeyExtractor = item => item.id

  renderTopic = ({ item }) => (
    <TouchableOpacity onPress={() => this.props.showTopic && this.props.showTopic(item.name)}>
      <Text style={styles.topicLabel}>#{item.name}</Text>
    </TouchableOpacity>
  )

  render () {
    const {
      creator: { avatarUrl, name, tagline },
      date,
      type,
      postId,
      slug,
      canFlag,
      removePost,
      deletePost,
      deletePostAndClose,
      closeOnDelete,
      pinned,
      pinPost,
      topics,
      announcement,
      canEdit,
      hideMenu,
      hideDateRow,
      smallAvatar
    } = this.props
    const { flaggingVisible } = this.state
    const showTopics = !isEmpty(topics)
    // Used to generate a link to this post from the backend.
    const linkData = {
      slug,
      id: postId,
      type: 'post'
    }

    let flagPost
    if (canFlag) {
      flagPost = () => {
        this.setState({ flaggingVisible: true })
      }
    }

    const deletePostWithConfirm = deletePost
      ? () => Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this post?',
          [
            {
              text: 'Yes',
              onPress: () => closeOnDelete
                ? deletePostAndClose()
                : deletePost()
            },
            { text: 'Cancel', style: 'cancel' }
          ]
        )
      : null

    const removePostWithConfirm = removePost
      ? () => Alert.alert(
          'Confirm Removal',
          'Are you sure you want to remove this post from this group?',
          [
            { text: 'Yes', onPress: () => removePost() },
            { text: 'Cancel', style: 'cancel' }
          ])
      : null

    return (
      <View style={styles.container}>
        <View style={styles.avatarSpacing}>
          <TouchableOpacity onPress={this.handleShowMember}>
            {!!avatarUrl && <Avatar avatarUrl={avatarUrl} dimension={smallAvatar && 20} />}
          </TouchableOpacity>
        </View>
        <View style={styles.meta}>
          <TouchableOpacity onPress={this.handleShowMember}>
            {name && <Text style={styles.username}>{name}</Text>}
            {!!tagline && <Text style={styles.metaText}>{tagline}</Text>}
          </TouchableOpacity>
          {!hideDateRow && (
            <View style={styles.dateRow}>
              <Text style={styles.metaText}>{humanDate(date)}</Text>
              {!!showTopics && (
                <FlatList
                  data={topics}
                  style={styles.topicList}
                  horizontal
                  keyExtractor={this.topicKeyExtractor}
                  showsHorizontalScrollIndicator={false}
                  renderItem={this.renderTopic}
                />
              )}
            </View>
          )}
        </View>
        <View style={styles.upperRight}>
          {pinned && <Icon name='Pin' style={styles.pinIcon} />}
          {announcement && <Icon name='Announcement' style={styles.announcementIcon} />}
          {type && <PostLabel type={type} />}
          {!hideMenu && (
            <PostMenu
              removePost={removePostWithConfirm}
              deletePost={deletePostWithConfirm}
              editPost={canEdit && this.handleEditPost}
              flagPost={flagPost}
              pinPost={pinPost}
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
  }
}

export function PostMenu ({ deletePost, editPost, flagPost, removePost, pinPost, pinned }) {
  // If the function is defined, than it's a valid action
  const flagLabel = 'Flag This Post'
  const deleteLabel = 'Delete This Post'
  const removeLabel = 'Remove Post From Group'
  const pinLabel = pinned ? 'Unpin' : 'Pin'

  const actions = filter(x => x[1], [
    [deleteLabel, deletePost],
    [flagLabel, flagPost],
    [removeLabel, removePost],
    ['Edit This Post', editPost],
    [pinLabel, pinPost]
  ])

  if (isEmpty(actions)) return null

  const destructiveLabels = [flagLabel, deleteLabel, removeLabel]
  const destructiveButtonIndex = destructiveLabels.includes(actions[0][0]) ? 0 : -1

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
      backgroundColor: fakeAlpha(havelockBlue, 0.2)
    },
    text: {
      color: havelockBlue
    }
  },
  event: {
    box: {
      backgroundColor: 'rgba(254, 72, 80, .2)'
    },
    text: {
      color: 'rgba(254, 72, 80, 1)'
    }
  },
  offer: {
    box: {
      backgroundColor: fakeAlpha(jade, 0.2)
    },
    text: {
      color: jade
    }
  },
  resource: {
    box: {
      backgroundColor: fakeAlpha(mangoYellow, 0.2)
    },
    text: {
      color: mangoYellow
    }
  },
  project: {
    box: {
      backgroundColor: fakeAlpha(westSide, 0.2)
    },
    text: {
      color: westSide
    }
  },
  request: {
    box: {
      backgroundColor: prim
    },
    text: {
      color: fuchsiaPink
    }
  }
}
