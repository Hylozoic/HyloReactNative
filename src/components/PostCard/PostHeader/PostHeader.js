import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Avatar from '../../Avatar'
import Icon from '../../Icon'
import { rhino30, rhino50, caribbeanGreen } from 'style/colors'
import { humanDate } from 'hylo-utils/text'
import PopupMenuButton from '../../PopupMenuButton'
import { filter, isEmpty } from 'lodash/fp'
import FlagContent from '../../FlagContent'

export default class PostHeader extends PureComponent {
  state = {
    flaggingVisible: false
  }

  static defaultProps = {
    creator: {},
    flaggingVisible: false
  }

  render () {
    const {
      creator: {avatarUrl, name, tagline, id},
      date,
      type,
      communities,
      postId,
      slug,
      showCommunity,
      editPost,
      showMember,
      canFlag,
      goToCommunity,
      removePost,
      deletePost
    } = this.props

    const { flaggingVisible } = this.state

    let context

    if (showCommunity) {
      const community = communities[0]
      context = {
        label: community.name,
        onPress: () => goToCommunity(community.id)
      }
    }

    // Used to generate a link to this post from the backend.
    const linkData = {
      slug,
      id: postId,
      type: 'post'
    }

    let flagPost
    if (canFlag) {
      flagPost = () => {
        this.setState({flaggingVisible: true})
      }
    }

    return <View style={styles.container}>
      <View style={styles.avatarSpacing}>
        <TouchableOpacity onPress={() => showMember(id)}>
          {avatarUrl && <Avatar avatarUrl={avatarUrl} />}
        </TouchableOpacity>
      </View>
      <View style={styles.meta}>
        <TouchableOpacity onPress={() => showMember(id)}>
          {name && <Text style={styles.username}>{name}</Text>}
          {!!tagline && <Text style={styles.metaText}>{tagline}</Text>}
        </TouchableOpacity>
        <View style={styles.dateRow}>
          <Text style={styles.metaText}>{humanDate(date)}</Text>
          {!!context && <Text style={styles.spacer}>•</Text>}
          {!!context && <TouchableOpacity onPress={context.onPress}>
            <Text style={styles.contextLabel}>{context.label}</Text>
          </TouchableOpacity>}
        </View>

      </View>
      <View style={styles.upperRight}>
        {type && <PostLabel type={type} />}
        <PostMenu {...{editPost, deletePost, flagPost, removePost}} />
        {flaggingVisible && <FlagContent type='post'
          linkData={linkData}
          onClose={() => this.setState({flaggingVisible: false})} />
        }
      </View>
    </View>
  }
}

export function PostMenu ({deletePost, editPost, flagPost, removePost}) {
  // If the function is defined, than it's a valid action
  const flagLabel = 'Flag This Post'
  const deleteLabel = 'Delete This Post'
  const removeLabel = 'Remove Post From Community'

  const actions = filter(x => x[1], [
    [deleteLabel, deletePost],
    [flagLabel, flagPost],
    [removeLabel, removePost],
    ['Edit This Post', editPost]
  ])

  if (isEmpty(actions)) return null

  const onSelect = index => actions[index][1]()

  const destructiveButtonIndex = (actions[0][0] === deleteLabel || actions[0][0] === flagLabel || actions[0][0] === removeLabel) ? 0 : -1

  return <PopupMenuButton actions={actions.map(x => x[0])}
    hitSlop={{top: 20, bottom: 10, left: 10, right: 15}}
    onSelect={onSelect}
    destructiveButtonIndex={destructiveButtonIndex}>
    <Icon name='More' style={styles.menuIcon} />
  </PopupMenuButton>
}

export function PostLabel ({ type }) {
  const boxStyle = [labelStyles.box, labelStyles[type].box]
  const textStyle = [labelStyles.text, labelStyles[type].text]
  return <View style={boxStyle}>
    <Text style={textStyle}>
      {type.toUpperCase()}
    </Text>
  </View>
}

const styles = {
  container: {
    flexDirection: 'row',
    marginBottom: 10
  },
  meta: {
    paddingTop: 7 + 9,
    paddingRight: 7,
    flex: 1
  },
  avatarSpacing: {
    paddingTop: 7 + 9,
    paddingLeft: 7 + 5,
    paddingRight: 7
  },
  username: {
    fontSize: 14,
    color: '#363D3C',
    fontFamily: 'Circular-Bold'
  },
  dateRow: {
    flexDirection: 'row'
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
  upperRight: {
    paddingTop: 14,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  menuIcon: {
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 5,
    color: rhino50
  }
}

const labelStyles = {
  box: {
    borderRadius: 4,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    marginTop: 1
  },
  text: {
    fontSize: 10,
    fontFamily: 'Circular-Bold',
    letterSpacing: 0.8
  },
  request: {
    box: {
      backgroundColor: '#FFEFDA'
    },
    text: {
      color: '#FF9711'
    }
  },
  discussion: {
    box: {
      backgroundColor: '#D9ECF8'
    },
    text: {
      color: '#40A1DD'
    }
  },
  offer: {
    box: {
      backgroundColor: '#D3F5E6'
    },
    text: {
      color: '#05C570'
    }
  },
  project: {
    box: {
      backgroundColor: '#F1DFEE'
    },
    text: {
      color: '#BB60A8'
    }
  },
  event: {
    box: {
      backgroundColor: '#EAE6FA'
    },
    text: {
      color: '#9883E5'
    }
  }
}
