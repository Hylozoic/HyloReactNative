import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { slice, uniqBy } from 'lodash/fp'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import {
  caribbeanGreen, rhino30, rhino80, slateGrey80
} from 'style/colors'
import { string, array, number, func } from 'prop-types'

export default class PostFooter extends React.PureComponent {
  static propTypes = {
    id: string,
    commenters: array,
    commentersTotal: number,
    votesTotal: number,
    vote: func
  }

  render () {
    const {
      style,
      commenters,
      commentsTotal,
      votesTotal,
      myVote,
      vote,
      showActivityLabel
    } = this.props
    const voteStyle = myVote ? styles.votes.active : styles.votes.inactive
    const commentsText = commentsTotal
      ? `${commentsTotal} comment${commentsTotal === 1 ? '' : 's'}`
      : 'No comments'

    return (
      <View style={[styles.container, style]}>
        {showActivityLabel && <Text style={styles.activityLabel}>Activity</Text>}
        <View style={styles.comments}>
          {slice(0, 3, uniqBy('id', commenters)).map((c, index) => {
            return (
              <Avatar
                key={index}
                avatarUrl={c.avatarUrl}
                size='small'
                hasBorder
                hasOverlap={index > 0}
                zIndex={3 - index}
              />
            )
          })}
          <Text style={styles.commentsText}>{commentsText}</Text>
        </View>
        <TouchableOpacity style={styles.votes.container} onPress={vote}>
          <Icon name='ArrowUp' style={[styles.votes.icon, voteStyle]} />
          <Text style={[styles.votes.text, voteStyle]}>{votesTotal}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = {
  container: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12
  },
  activityLabel: {
    color: rhino80,
    fontSize: 18,
    fontFamily: 'Circular-Book',
    marginRight: 8
  },
  comments: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentsText: {
    paddingLeft: 6,
    color: rhino30,
    fontSize: 13,
    fontFamily: 'Circular-Book'
  },
  votes: {
    container: {
      paddingRight: 14,
      paddingLeft: 14,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center'
    },
    icon: {
      fontSize: 18,
      marginRight: 4
    },
    text: {
      fontSize: 14
    },
    active: {
      color: caribbeanGreen,
      fontFamily: 'Circular-Bold'
    },
    inactive: {
      color: slateGrey80,
      fontFamily: 'Circular-Book'
    }
  }
}
