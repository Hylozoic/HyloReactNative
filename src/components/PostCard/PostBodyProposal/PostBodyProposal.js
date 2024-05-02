import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
// import ReactTooltip from 'react-native-tooltip'
import { PROPOSAL_STATUS_CASUAL, PROPOSAL_STATUS_COMPLETED, PROPOSAL_STATUS_DISCUSSION, PROPOSAL_STATUS_VOTING, PROPOSAL_TYPE_MULTI_UNRESTRICTED, PROPOSAL_TYPE_SINGLE } from 'store/models/Post'
import { addProposalVote, removeProposalVote, swapProposalVote } from 'store/actions/proposals'
import QuorumBar from 'components/QuorumBar/QuorumBar'
import Avatar from 'components/Avatar'
// import RoundImageRow from 'components/RoundImageRow'

const calcNumberOfVoters = (votes) => {
  return votes.reduce((acc, vote) => {
    if (!acc.includes(vote.user.id)) {
      acc.push(vote.user.id)
    }
    return acc
  }, []).length
}

const calcNumberOfPossibleVoters = (groups) => {
  return groups.reduce((acc, group) => {
    return acc + group.memberCount
  }, 0)
}

const calcHighestVotedOptions = (votes) => {
  const tally = {}

  votes.forEach(vote => {
    if (tally[vote.optionId]) {
      tally[vote.optionId]++
    } else {
      tally[vote.optionId] = 1
    }
  })

  let maxTally = 0
  for (const optionId in tally) {
    if (tally[optionId] > maxTally) {
      maxTally = tally[optionId]
    }
  }

  const highestVotedOptions = []
  for (const optionId in tally) {
    if (tally[optionId] === maxTally) {
      highestVotedOptions.push(optionId)
    }
  }

  return highestVotedOptions
}

const isVotingOpen = (proposalStatus) => proposalStatus === PROPOSAL_STATUS_VOTING || proposalStatus === PROPOSAL_STATUS_CASUAL

export default function PostBodyProposal ({
  currentUser,
  proposalStatus,
  proposalType,
  proposalOptions,
  proposalVotes,
  isAnonymousVote,
  startTime,
  quorum,
  endTime,
  groups,
  id
}) {
  const dispatch = useDispatch()

  const proposalOptionsArray = useMemo(() => proposalOptions?.items || [], [proposalOptions])
  const proposalVotesArray = useMemo(() => proposalVotes?.items || [], [proposalVotes])

  const currentUserVotes = useMemo(() => proposalVotesArray.filter(vote => vote?.user?.id === currentUser.id), [proposalVotesArray, currentUser.id])
  const currentUserVotesOptionIds = useMemo(() => currentUserVotes.map(vote => vote.optionId), [currentUserVotes])
  const proposalVoterCount = useMemo(() => calcNumberOfVoters(proposalVotesArray), [proposalVotesArray])
  const numberOfPossibleVoters = useMemo(() => calcNumberOfPossibleVoters(groups), [groups])
  const highestVotedOptions = useMemo(() => calcHighestVotedOptions(proposalVotesArray, proposalOptionsArray), [proposalVotesArray, proposalOptionsArray])

  function handleVote (optionId) {
    if (proposalType === PROPOSAL_TYPE_SINGLE) {
      if (currentUserVotesOptionIds.includes(optionId)) {
        dispatch(removeProposalVote({ optionId, postId: id }))
      } else if (currentUserVotesOptionIds.length === 0) {
        dispatch(addProposalVote({ optionId, postId: id }))
      } else {
        const removeOptionId = currentUserVotesOptionIds[0]
        dispatch(swapProposalVote({ postId: id, addOptionId: optionId, removeOptionId }))
      }
    }
    if (proposalType === PROPOSAL_TYPE_MULTI_UNRESTRICTED) {
      if (currentUserVotesOptionIds.includes(optionId)) {
        dispatch(removeProposalVote({ optionId, postId: id }))
      } else {
        dispatch(addProposalVote({ optionId, postId: id }))
      }
    }
  }

  return (
    <View style={[styles.proposalBodyContainer, proposalStatus === PROPOSAL_STATUS_DISCUSSION && styles.discussion, proposalStatus === PROPOSAL_STATUS_VOTING && styles.voting, proposalStatus === PROPOSAL_STATUS_CASUAL && styles.casual, proposalStatus === PROPOSAL_STATUS_COMPLETED && styles.completed]}>
      <View style={styles.proposalStatus}>
        <Text style={[proposalStatus === PROPOSAL_STATUS_DISCUSSION && styles.discussion, proposalStatus === PROPOSAL_STATUS_VOTING && styles.voting, proposalStatus === PROPOSAL_STATUS_CASUAL && styles.casual, proposalStatus === PROPOSAL_STATUS_COMPLETED && styles.completed]}>
          {proposalStatus === PROPOSAL_STATUS_DISCUSSION && 'Discussion in progress'}
          {proposalStatus === PROPOSAL_STATUS_VOTING && 'Voting open'}
          {proposalStatus === PROPOSAL_STATUS_COMPLETED && 'Voting ended'}
          {proposalStatus === PROPOSAL_STATUS_CASUAL && 'Voting open'}
        </Text>
      </View>
      <View style={styles.proposalTiming}>
        <Text style={[proposalStatus === PROPOSAL_STATUS_DISCUSSION && styles.discussion, proposalStatus === PROPOSAL_STATUS_VOTING && styles.voting, proposalStatus === PROPOSAL_STATUS_CASUAL && styles.casual, proposalStatus === PROPOSAL_STATUS_COMPLETED && styles.completed]}>
          {!startTime && 'Open timeframe'}
          {startTime && proposalStatus !== PROPOSAL_STATUS_COMPLETED && `${new Date(startTime).toLocaleDateString()} - ${new Date(endTime).toLocaleDateString()}`}
          {startTime && proposalStatus === PROPOSAL_STATUS_COMPLETED && `${new Date(endTime).toLocaleDateString()}`}
        </Text>
      </View>
      {proposalOptionsArray && proposalOptionsArray.map((option, i) => {
        const optionVotes = proposalVotesArray.filter(vote => vote.optionId === option.id)
        const voterNames = isAnonymousVote ? [] : optionVotes.map(vote => vote.user.name)
        const avatarUrls = optionVotes.map(vote => vote.user.avatarUrl)
        return (
          <TouchableOpacity key={`${option.id}+${currentUserVotesOptionIds.includes(option.id)}`} style={[styles.proposalOption, proposalStatus === PROPOSAL_STATUS_COMPLETED && styles.completed, proposalStatus === PROPOSAL_STATUS_DISCUSSION && styles.discussion, proposalStatus === PROPOSAL_STATUS_VOTING && styles.voting, proposalStatus === PROPOSAL_STATUS_CASUAL && styles.casual, currentUserVotesOptionIds.includes(option.id) && styles.selected, proposalStatus === PROPOSAL_STATUS_COMPLETED && styles.completed, proposalStatus === PROPOSAL_STATUS_COMPLETED && highestVotedOptions.includes(option.id) && styles.highestVote]} onPress={isVotingOpen(proposalStatus) ? () => handleVote(option.id) : () => {}}>
            <View style={styles.proposalOptionTextContainer}>
              <View style={styles.proposalOptionEmoji}>
                <Text>
                  {option.emoji}
                </Text>
              </View>
              <View style={styles.proposalOptionText}>
                <Text style={[proposalStatus === PROPOSAL_STATUS_COMPLETED && styles.completed, proposalStatus === PROPOSAL_STATUS_DISCUSSION && styles.discussion, proposalStatus === PROPOSAL_STATUS_VOTING && styles.voting, proposalStatus === PROPOSAL_STATUS_CASUAL && styles.casual, proposalStatus === PROPOSAL_STATUS_COMPLETED && styles.completed, currentUserVotesOptionIds.includes(option.id) && styles.selected, proposalStatus === PROPOSAL_STATUS_COMPLETED && highestVotedOptions.includes(option.id) && styles.highestVote]}>
                  {option.text}
                </Text>
              </View>
            </View>
            <View style={styles.proposalOptionVotesContainer} data-tip={voterNames.join('\n')} data-for='voters-tt'>
              <View style={styles.proposalOptionVoteCount}>
                <Text style={[proposalStatus === PROPOSAL_STATUS_COMPLETED && styles.completed, proposalStatus === PROPOSAL_STATUS_DISCUSSION && styles.discussion, proposalStatus === PROPOSAL_STATUS_VOTING && styles.voting, proposalStatus === PROPOSAL_STATUS_CASUAL && styles.casual, proposalStatus === PROPOSAL_STATUS_COMPLETED && styles.completed, currentUserVotesOptionIds.includes(option.id) && styles.selected, proposalStatus === PROPOSAL_STATUS_COMPLETED && highestVotedOptions.includes(option.id) && styles.highestVote]}>
                  {optionVotes.length}
                </Text>
              </View>
              {!isAnonymousVote &&
                <View style={styles.proposalOptionVoteAvatars}>
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
                </View>}
            </View>
          </TouchableOpacity>
        )
      })}
      {quorum && <QuorumBar totalVoters={numberOfPossibleVoters} quorum={quorum} actualVoters={proposalVoterCount} proposalStatus={proposalStatus} />}
    </View>
  )
}

const styles = {
  casual: {
    borderColor: '#0DC39F',
    color: '#0DC39F'
  },
  voting: {
    borderColor: '#0DC39F',
    color: '#0DC39F'
  },
  completed: {
    borderColor: '#C0C5CD',
    color: '#C0C5CD',
    cursor: 'default'
  },
  selected: {
    backgroundColor: '#0DC39F',
    color: 'white'
  },
  highestVote: {
    backgroundColor: '#0074D8',
    color: 'white',
    cursor: 'default'
  },
  people: {
    whiteSpace: 'nowrap'
  },
  proposalBodyContainer: {
    borderStyle: 'dashed',
    position: 'relative',
    borderWidth: 1,
    borderRadius: 10,
    display: 'flex',
    margin: 8,
    flexDirection: 'column',
    gap: 8,
    padding: 12,
    paddingTop: 24
  },
  proposalStatus: {
    position: 'absolute',
    top: -16,
    left: 12,
    padding: 6,
    backgroundColor: 'white'
  },
  proposalTiming: {
    position: 'absolute',
    top: -16,
    right: 6,
    padding: 6,
    backgroundColor: 'white'
  },
  proposalOption: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  discussion: {
    borderColor: '#C0C5CD',
    color: '#C0C5CD',
    cursor: 'default'
  },
  proposalOptionEmoji: {
    fontSize: 24
  },
  proposalOptionTextContainer: {
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    margin: 5,
    fontSize: 18
  },
  proposalOptionVoteCount: {
    fontSize: 12
  },
  proposalOptionVotesContainer: {
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    margin: 5
  }
}
