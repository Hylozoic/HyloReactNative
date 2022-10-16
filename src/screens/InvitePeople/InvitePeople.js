import React, { useEffect, useState } from 'react'
import { Text, View, TextInput, ScrollView } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { isEmpty, compact } from 'lodash/fp'
import { isIOS } from 'util/platform'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import fetchGroupSettings from 'store/actions/fetchGroupSettings'
import {
  regenerateAccessCode,
  CREATE_INVITATIONS,
  createInvitations
} from './InvitePeople.store'
import { FETCH_GROUP_SETTINGS } from 'store/constants'
import getGroup from 'store/selectors/getGroup'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
// Components
import KeyboardSpacer from 'react-native-keyboard-spacer'
import Button from 'components/Button'
import Loading from 'components/Loading'
import styles from './InvitePeople.styles'

export function parseEmailList (emails) {
  return compact((emails || '').split(/,|\n/).map(email => {
    const trimmed = email.trim()
    // use only the email portion of a "Joe Bloggs <joe@bloggs.org>" line
    const match = trimmed.match(/.*<(.*)>/)
    return match ? match[1] : trimmed
  }))
}

export default function InvitePeople ({ navigation }) {
  const dispatch = useDispatch()
  const groupId = useSelector(getCurrentGroupId)
  const group = useSelector(state => getGroup(state, { id: groupId }))
  const pending = useSelector(state => state.pending[FETCH_GROUP_SETTINGS])
  const pendingCreate = useSelector(state => state.pending[CREATE_INVITATIONS])
  const inviteLink = 'https://www.hylo.com' + group?.invitePath
  const [emails, setEmails] = useState('')
  const [emailBodyText, setEmailBodyText] = useState(
    `Hey! Here's an invite to the ${group?.name} group on Hylo.`
  )
  const [successMessage, setSuccessMessage] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)

  const copyToClipboard = () => {
    setCopied(true)
    Clipboard.setString(inviteLink)
    setTimeout(() => { setCopied(false) }, 3000)
  }

  const resetLink = () => {
    // TODO should have some sort of confirmation here perhaps?
    dispatch(regenerateAccessCode(groupId))
  }

  const sendInvite = async () => {
    if (sending) return

    setSending(true)

    const response = await dispatch(createInvitations(groupId, parseEmailList(emails), emailBodyText))
    const { invitations } = response.payload.data.createInvitation
    const badEmails = invitations.filter(email => email.error).map(e => e.email)

    const numBad = badEmails.length
    let errorMessage
    if (numBad === 1) {
      errorMessage = 'The address below is invalid.'
    } else if (numBad > 1) {
      errorMessage = `The ${numBad} addresses below are invalid.`
    }

    const numGood = invitations.length - badEmails.length
    const successMessage = numGood > 0
      ? `Sent ${numGood} ${numGood === 1 ? 'email' : 'emails'}.`
      : null

    setEmails(badEmails.join('\n'))
    setErrorMessage(errorMessage)
    setSuccessMessage(successMessage)
    setSending(false)
  } 

  const disableSendBtn = !!(isEmpty(emails) || pendingCreate || sending)

  useEffect(() => { dispatch(fetchGroupSettings()) }, [groupId])

  if (pending) return <Loading />

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.joinGroupText}>Anyone with this link can join the group:</Text>
        {inviteLink && <Text style={styles.joinGroupLink}>{inviteLink}</Text>}
        {!inviteLink && <Text>No link has been set yet</Text>}

        <View style={styles.linkButtonRow}>
          <Button text='Reset Link' onPress={resetLink} style={styles.resetLinkButton} />
          <Button text={copied ? 'Copied' : 'Copy Link'} onPress={copyToClipboard} style={styles.copyLinkButton} />
        </View>

        {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

        <TextInput
          value={emails}
          placeholder='Type email addresses'
          onChangeText={text => setEmails(text)}
          autoCapitalize='none'
          autoComplete='email'
          autoCorrect={false}
          style={styles.textInput}
          underlineColorAndroid='transparent'
        />
        <TextInput
          value={emailBodyText}
          multiline
          textAlignVertical='top'
          numberOfLines={5}
          underlineColorAndroid='transparent'
          style={styles.textInput}
          onChangeText={text => setEmailBodyText(text)}
        />
        <View style={styles.emailButtonsRow}>
          <Button
            text='Pending Invites'
            onPress={() => navigation.navigate('Pending Invites')}
            style={styles.pendingInviteButton}
          />
          <Button
            text='Send Invite'
            disabled={disableSendBtn}
            onPress={sendInvite}
            style={styles.sendInviteButton}
          />
        </View>
        {isIOS && <KeyboardSpacer />}
      </ScrollView>
    </View>
  )
}
