import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { slice } from 'lodash/fp'
import Avatar from '../../Avatar'

const { string, array, number, func, object } = React.PropTypes

export default function PostFooter ({ id, currentUser, commenters, commentsTotal, votesTotal, myVote, vote }) {
  const voteStyle = myVote ? styles.votes.active : styles.votes.inactive

  return <View style={styles.container}>
    <View style={styles.comments}>
      {slice(0, 3, commenters).map((c, index) => {
        return <Avatar key={index}
          avatarUrl={c.avatarUrl}
          forFooter
          withBorder
          withOverlap={index > 0}
          zIndex={3 - index} />
      })}
      <Text style={styles.commentsText}>{`${commentsTotal} comment`}{commentsTotal === 1 ? '' : 's'}</Text>
    </View>
    <TouchableOpacity style={styles.votes.container}>
      <Text style={{...styles.votes.text, ...voteStyle}}>{votesTotal}</Text>
    </TouchableOpacity>
  </View>
}
PostFooter.propTypes = {
  id: string,
  commenters: array,
  commentersTotal: number,
  votesTotal: number,
  vote: func,
  currentUser: object
}

const styles = {
  container: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  comments: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  },
  commentsText: {
    paddingLeft: 6,
    color: '#363D3C',
    fontSize: 13
  },
  votes: {
    container: {
      paddingRight: 14,
      paddingLeft: 14,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center'
    },
    text: {
      fontSize: 14
    },
    active: {
      color: '#0DC3A0'
    },
    inactive: {
      color: '#8A94A3'
    }
  }
}
