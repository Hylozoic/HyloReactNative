import React, { useEffect } from 'react'
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash/fp'
import { humanDate } from 'hylo-utils/text'
import getGroup from 'store/selectors/getGroup'
import fetchGroupSettings from 'store/actions/fetchGroupSettings'
import { FETCH_GROUP_SETTINGS } from 'store/constants'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import {
  getPendingInvites,
  expireInvitation,
  resendInvitation,
  reinviteAll
} from 'screens/InvitePeople/InvitePeople.store'
import Button from 'components/Button'
import Loading from 'components/Loading'
import { caribbeanGreen, white, capeCod40, rhino20 } from 'style/colors'

export default function PendingInvites () {
  const dispatch = useDispatch()
  const groupId = useSelector(getCurrentGroupId)
  const group = useSelector(state => getGroup(state, { id: groupId }))
  const pending = useSelector(state => state.pending[FETCH_GROUP_SETTINGS])

  const invites = useSelector(state => getPendingInvites(state, { groupId: group.id }))

  useEffect(() => { dispatch(fetchGroupSettings()) }, [groupId])

  if (pending) return <Loading />

  return (
    <ScrollView style={styles.container}>
      {!isEmpty(invites) && (
        <Button text='Resend All' onPress={() => groupId && dispatch(reinviteAll(groupId))} style={styles.resendAllButton} />
      )}
      {isEmpty(invites) ? (
        <Text style={styles.emptyList}>No pending invites</Text>
      ) : (
        invites.map((invite, i) => (
          <PendingInviteRow
            invite={invite} key={i} first={i === 0}
            expireInvitation={invitationToken => dispatch(expireInvitation(invitationToken))}
            resendInvitation={invitationToken => dispatch(resendInvitation(invitationToken))}
          />
        )
      ))}
    </ScrollView>
  )
}

export function PendingInviteRow ({ invite, first, expireInvitation, resendInvitation }) {
  const { id, email, lastSentAt } = invite

  return (
    <View style={styles.rowContainer}>
      <View style={styles.nameRow}>
        <Text style={styles.pendingInviteEmail}>{email}</Text>
      </View>
      <View style={styles.actionRow}>
        <Text style={styles.timeAgoText}>{humanDate(lastSentAt)}</Text>
        <View style={styles.actionItems}>
          <TouchableOpacity
            onPress={() => expireInvitation(id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.expireText}>Expire</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={invite.resent}
            onPress={() => !invite.resent && resendInvitation(id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.resendText}>{invite.resent ? 'Sent' : 'Resend'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = {
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: capeCod40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: capeCod40,
    paddingLeft: 20,
    paddingRight: 20
  },
  pendingInviteEmail: {
    marginBottom: 18,
    marginTop: 18,
    fontSize: 16,
    backgroundColor: white,
    borderColor: caribbeanGreen,
    color: caribbeanGreen
  },
  expireText: {
    fontSize: 16,
    color: 'red'
  },
  resendText: {
    fontSize: 16,
    color: caribbeanGreen,
    marginLeft: 20
  },
  emptyList: {
    paddingVertical: 10
  },
  nameRow: {},
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowContainer: {
    paddingBottom: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: capeCod40,
  },
  actionItems: {
    flexDirection: 'row',
  },
  timeAgoText: {
    color: rhino20
  },
  resendAllButton: {
    marginBottom: 18,
    marginTop: 18,
    fontSize: 16,
    height: 36,
    backgroundColor: white,
    borderColor: caribbeanGreen,
    color: caribbeanGreen
  }
}
