import React from 'react'
import { View, Text, Platform } from 'react-native'
import { PROPOSAL_STATUS_COMPLETED } from 'store/models/Post'

const QuorumBar = ({ totalVoters, quorum, actualVoters, proposalStatus }) => {
  const votersForQuorum = Math.ceil((quorum / 100) * totalVoters)
  const actualVotersWidth = (actualVoters / totalVoters) * 100
  const quorumReached = actualVoters >= votersForQuorum

  let quorumStatus = quorumReached ? 'Quorum reached' : 'Quorum'
  if (proposalStatus === PROPOSAL_STATUS_COMPLETED && !quorumReached) quorumStatus = 'Quorum not reached'
  const bigQuorum = quorum > 90
  return (
    <View style={styles.voteProgressContainer}>
      <View style={[styles.actualVoters, { width: `${actualVotersWidth}%` }]}>
        <Text style={styles.quorumText}>{quorumStatus}</Text>
      </View>
      <View style={[styles.quorumBar, { width: `${quorum}%` }]}>
        <Text style={[styles.quorumNumber, bigQuorum && styles.bigQuorum, quorumReached && styles.quorumReached]}>{quorum}%</Text>
      </View>
      <View style={styles.totalVotersBar} />
    </View>
  )
}
const styles = {
  voteProgressContainer: {
    position: 'relative',
    height: 16,
    width: '100%',
    backgroundColor: '#C0C5CD75',
    borderRadius: 5
  },
  votersBar: {
    position: 'relative',
    height: '100%',
    width: '100%'
  },
  totalVotersBar: {
    position: 'absolute',
    height: '100%',
    zIndex: 1,
    borderRadius: 5,
    backgroundColor: '#C0C5CD75'
  },
  actualVoters: {
    position: 'absolute',
    height: '100%',
    zIndex: 3,
    borderRadius: 5,
    backgroundColor: '#0074D8'
  },
  quorumBar: {
    position: 'absolute',
    borderRadius: 5,
    height: '100%',
    zIndex: 2,
    backgroundColor: '#808C9B'
  },
  quorumText: {
    position: 'absolute',
    textTransform: 'uppercase',
    top: Platform.OS === 'ios' ? 2 : 1,
    left: 8,
    color: 'white',
    fontSize: 10,
    width: 200
  },
  quorumNumber: {
    position: 'absolute',
    textTransform: 'uppercase',
    top: Platform.OS === 'ios' ? 0 : -1,
    color: 'red',
    fontSize: 12,
    right: -28
  },
  bigQuorum: {
    right: 10,
    color: 'white',
    fontSize: 12
  },
  quorumReached: {
    color: '#0074D8'
  }
}

export default QuorumBar
