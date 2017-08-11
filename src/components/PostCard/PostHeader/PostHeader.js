import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Avatar from '../../Avatar'
import Icon from '../../Icon'
import { rhino30, rhino50 } from '../../../style/colors'
// import { humanDate } from 'hylo-utils/text'
import PopupMenuButton from '../../PopupMenuButton'
import { filter, isEmpty } from 'lodash/fp'

export default function PostHeader ({
  creator: { avatarUrl, name, tagline, id },
  date,
  type,
  communities,
  close,
  slug,
  showCommunity,
  editPost,
  deletePost,
  showMember
}) {
  // TODO: person name and avatar should link to={personUrl(creator.id, slug)}
  // TODO: date should use humanDate, but importing hylo-utils needs fixing

  return <View style={styles.container}>
    <View style={styles.avatarSpacing}>
      <TouchableOpacity onPress={() => showMember(id)}>
        <Avatar avatarUrl={avatarUrl} />
      </TouchableOpacity>
    </View>
    <View style={styles.meta}>
      <TouchableOpacity onPress={() => showMember(id)}>
        <Text style={styles.username}>{name}</Text>
        {!!tagline && <Text style={styles.metaText}>{tagline}</Text>}
      </TouchableOpacity>
      <Text style={styles.metaText}>10 mins ago</Text>
    </View>
    <View style={styles.upperRight}>
      {type && <PostLabel type={type} />}
      <PostMenu {...{editPost, deletePost}} />
    </View>
  </View>
}

function PostMenu ({ deletePost, editPost }) {
  const actions = filter(x => x[1], [
    ['Delete this post', deletePost],
    ['Edit this post', editPost]
  ])

  if (isEmpty(actions)) return null

  const onSelect = index => actions[index][1]()
  const destructiveButtonIndex = actions[0][0] === 'Delete this post' ? 0 : -1

  return <PopupMenuButton actions={actions.map(x => x[0])} onSelect={onSelect}
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
  metaText: {
    fontSize: 12,
    color: rhino30,
    fontFamily: 'Circular-Book'
  },
  upperRight: {
    paddingTop: 19,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  menuIcon: {
    fontSize: 20,
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
