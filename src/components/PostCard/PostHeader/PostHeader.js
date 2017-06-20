import React from 'react'
import { View, Text } from 'react-native'
import Avatar from '../../Avatar'
// import { humanDate } from 'hylo-utils/text'

export default function PostHeader ({
  creator,
  date,
  type,
  communities,
  close,
  slug,
  showCommunity,
  editPost,
  deletePost
}) {
  // TODO: person name and avatar should link to={personUrl(creator.id, slug)}
  // TODO: date should use humanDate, but importing hylo-utils needs fixing
  return <View style={styles.container}>
    <View style={styles.avatarSpacing}>
      <Avatar avatarUrl={creator.avatarUrl} />
    </View>
    <View style={styles.meta}>
      <Text style={styles.username}>{creator.name}</Text>
      {creator.tagline && <Text style={styles.metaText}>{creator.tagline}</Text>}
      <Text style={styles.metaText}>10 mins ago</Text>
    </View>
    <View style={styles.upperRight}>
      {type && <PostLabel type={type} />}
    </View>
  </View>
}

export function PostLabel ({ type }) {
  const containerStyle = {
    ...styles.labels.container,
    ...styles.labels[type].container
  }
  const textStyle = {
    ...styles.labels.text,
    ...styles.labels[type].text
  }
  return <View style={containerStyle}>
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
    fontFamily: 'Circular-Book'
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(54, 61, 60, 0.3)'
  },
  upperRight: {
    paddingTop: 20,
    paddingRight: 6
  },
  labels: {
    container: {
      borderRadius: 2,
      paddingTop: 3,
      paddingBottom: 3,
      paddingLeft: 6,
      paddingRight: 6
    },
    text: {
      fontSize: 10
    },
    request: {
      container: {
        backgroundColor: '#FFEFDA'
      },
      text: {
        color: '#FF9711'
      }
    },
    discussion: {
      container: {
        backgroundColor: '#D9ECF8'
      },
      text: {
        color: '#40A1DD'
      }
    },
    offer: {
      container: {
        backgroundColor: '#D3F5E6'
      },
      text: {
        color: '#05C570'
      }
    },
    project: {
      container: {
        backgroundColor: '#F1DFEE'
      },
      text: {
        color: '#BB60A8'
      }
    },
    event: {
      container: {
        backgroundColor: '#EAE6FA'
      },
      text: {
        color: '#9883E5'
      }
    }
  }
}
