import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { get, find, filter, isEmpty, sortBy } from 'lodash/fp'
import LinearGradient from 'react-native-linear-gradient'
import { RESPONSES } from 'store/models/EventInvitation'
import voteOnPost from 'store/actions/voteOnPost'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import { caribbeanGreen, rhino30, postCardLinearGradientColors, white } from 'style/colors'

export default function PostFooter ({
  commenters,
  commentersTotal,
  currentUser,
  eventInvitations,
  members,
  myVote,
  forDetails,
  style,
  type,
  votesTotal,
  postId
}) {
  const dispatch = useDispatch()

  const vote = () => dispatch(voteOnPost(postId, !myVote))

  const voteStyle = myVote
    ? styles.votes.active
    : styles.votes.inactive

  const eventAttendees = filter(ei => ei.response === RESPONSES.YES, eventInvitations)

  let peopleRowResult

  switch (type) {
    case 'project':
      peopleRowResult = peopleSetup(
        members,
        members.length,
        get('id', currentUser),
        {
          emptyMessage: 'No project members',
          phraseSingular: 'is a member',
          mePhraseSingular: 'are a member',
          pluralPhrase: 'are members'
        }
      )
      break
    case 'event':
      peopleRowResult = peopleSetup(
        eventAttendees,
        eventAttendees.length,
        get('id', currentUser),
        {
          emptyMessage: 'No one is attending yet',
          phraseSingular: 'is attending',
          mePhraseSingular: 'are attending',
          pluralPhrase: 'attending'
        }
      )
      break
    default:
      peopleRowResult = peopleSetup(
        commenters,
        commentersTotal,
        get('id', currentUser),
        {
          emptyMessage: 'Be the first to comment',
          phraseSingular: 'commented',
          mePhraseSingular: 'commented',
          pluralPhrase: 'commented'
        }
      )
  }

  const { caption, avatarUrls } = peopleRowResult

  return (
    <>
      <View style={styles.dashedBorder} />
      <LinearGradient style={[styles.container, style]} colors={postCardLinearGradientColors}>
        <View style={styles.comments}>
          {avatarUrls.slice(0, 3).map((avatarUrl, index) => {
            return (
              <Avatar
                key={index}
                avatarUrl={avatarUrl}
                size='small'
                hasBorder
                hasOverlap={index > 0}
                zIndex={3 - index}
              />
            )
          })}
          <Text style={[styles.commentsText, !isEmpty(avatarUrls) && styles.commentsTextWithAvatars]}>{caption}</Text>
        </View>
        <TouchableOpacity style={[styles.votes.container, voteStyle]} onPress={vote}>
          <Icon name='ArrowUp' style={[styles.votes.icon, voteStyle]} />
          <Text style={[styles.votes.text, voteStyle]}>{votesTotal}</Text>
        </TouchableOpacity>
      </LinearGradient>
      {forDetails && (
        <View style={styles.dashedBorder} />
      )}
    </>
  )
}

export const peopleSetup = (
  people,
  peopleTotal,
  excludePersonId,
  phrases = {
    emptyMessage: 'Be the first to comment',
    phraseSingular: 'commented',
    mePhraseSingular: 'commented',
    pluralPhrase: 'commented'
  }
) => {
  const currentUserIsMember = find(c => c.id === excludePersonId, people)
  const sortedPeople = currentUserIsMember && people.length === 2
    ? sortBy(c => c.id !== excludePersonId, people) // me first
    : sortBy(c => c.id === excludePersonId, people) // me last
  const firstName = person => person.id === excludePersonId ? 'You' : person.name.split(' ')[0]
  const {
    emptyMessage,
    phraseSingular,
    mePhraseSingular,
    pluralPhrase
  } = phrases
  let names = ''
  let phrase = pluralPhrase

  if (sortedPeople.length === 0) return { caption: emptyMessage, avatarUrls: [] }
  if (sortedPeople.length === 1) {
    phrase = currentUserIsMember ? mePhraseSingular : phraseSingular
    names = firstName(sortedPeople[0])
  } else if (sortedPeople.length === 2) {
    names = `${firstName(sortedPeople[0])} and ${firstName(sortedPeople[1])}`
  } else {
    names = `${firstName(sortedPeople[0])}, ${firstName(sortedPeople[1])} and ${peopleTotal - 2} other${peopleTotal - 2 > 1 ? 's' : ''}`
  }
  const caption = `${names} ${phrase}`
  const avatarUrls = people.map(p => p.avatarUrl)
  return { caption, avatarUrls }
}

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12
  },
  dashedBorder: {
    height: 1,
    width: '100%',
    borderRadius: 1,
    borderWidth: 1,
    borderColor: 'rgba(54, 61, 60, 0.1)',
    borderStyle: 'dashed'
  },
  comments: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentsText: {
    color: rhino30,
    fontSize: 13,
    fontFamily: 'Circular-Book'
  },
  commentsTextWithAvatars: {
    paddingLeft: 5
  },
  votes: {
    container: {
      paddingRight: 14,
      paddingLeft: 14,
      flexDirection: 'row',
      paddingVertical: 6,
      alignItems: 'center',
      height: '100%'
    },
    icon: {
      fontSize: 18,
      marginRight: 4
    },
    text: {
      fontSize: 12,
      fontFamily: 'Circular-Bold'
    },
    active: {
      backgroundColor: caribbeanGreen,
      color: white
    },
    inactive: {
      color: caribbeanGreen
    }
  }
}
