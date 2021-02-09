import React, { Component, PureComponent } from 'react'
import { Dimensions, Text, View, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native'
import Clipboard from '@react-native-group/clipboard'
import { TabView, TabBar } from 'react-native-tab-view'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Button from 'components/Button'
import { get, isEmpty, compact } from 'lodash/fp'
import { humanDate } from 'hylo-utils/text'
import styles from './InvitePeople.styles'
import { caribbeanGreen } from 'style/colors'
import Loading from 'components/Loading'

// https://github.com/react-native-group/react-native-tab-view/issues/547
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width
}

export const parseEmailList = emails =>
  compact((emails || '').split(/,|\n/).map(email => {
    const trimmed = email.trim()
    // use only the email portion of a "Joe Bloggs <joe@bloggs.org>" line
    const match = trimmed.match(/.*<(.*)>/)
    return match ? match[1] : trimmed
  }))

export default class InvitePeople extends Component {
  state = {
    index: 0,
    routes: [
      { key: '0', title: 'Send Invites' },
      { key: '1', title: 'Pending Invites' }
    ]
  }

  componentDidMount () {
    this.props.fetchGroupSettings()
  }

  componentDidUpdate (prevProps, prevState) {
    if (get('group.slug', prevProps) !== get('group.slug', this.props)) {
      this.props.fetchGroupSettings()
    }
  }

  _handleIndexChange = index =>
    this.setState({
      index
    })

  _renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />
  )

  _renderScene = ({ route }) => {
    if (this.props.pending) return <Loading />
    switch (route.key) {
      case '0':
        return (
          <SendInvitesPage
            inviteLink={this.props.inviteLink}
            pendingCreate={this.props.pendingCreate}
            groupName={this.props.group.name}
            groupId={this.props.group.id}
            groupMembersCanInvite={this.props.group.allowGroupInvites}
            createInvitations={this.props.createInvitations}
            regenerateAccessCode={this.props.regenerateAccessCode}
            allowGroupInvites={this.props.allowGroupInvites}
          />
        )
      case '1':
        return (
          <PendingInvitesPage
            invites={this.props.invites}
            expireInvitation={this.props.expireInvitation}
            resendInvitation={this.props.resendInvitation}
            reinviteAll={this.props.reinviteAll}
          />
        )
      default:
        return null
    }
  }

  render () {
    return (
      <TabView
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    )
  }
}

export class SendInvitesPage extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      emails: '',
      copied: false,
      inputText: `Hey! Here's an invite to the ${this.props.groupName} group on Hylo.`,
      groupMembersCanInvite: get('groupMembersCanInvite', props)
    }
  }

  copyToClipboard = () => {
    this.setState({ copied: true })
    Clipboard.setString(this.props.inviteLink)

    setTimeout(() => {
      this.setState({ copied: false })
    }, 3000)
  }

  resetLink = () => {
    // TODO should have some sort of confirmation here perhaps?
    this.props.regenerateAccessCode()
  }

  sendInvite = () => {
    const { createInvitations } = this.props
    const { emails, message, sending } = this.state

    if (sending) return

    this.setState({ sending: true })

    return createInvitations(parseEmailList(emails), message)
      .then(res => {
        const { invitations } = res.payload.data.createInvitation
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

        this.setState({
          emails: badEmails.join('\n'),
          errorMessage,
          successMessage,
          sending: false
        })
      })
  }

  toggleAllowGroupInvites = () => {
    const { groupMembersCanInvite } = this.state
    const { groupId } = this.props
    this.setState({ groupMembersCanInvite: !groupMembersCanInvite })
    this.props.allowGroupInvites(groupId, !groupMembersCanInvite)
      .then(({ error }) => {
        if (error) this.setState({ groupMembersCanInvite })
      })
  }

  render () {
    const {
      emails,
      inputText,
      copied,
      successMessage,
      errorMessage,
      sending,
      groupMembersCanInvite
    } = this.state

    const {
      inviteLink,
      pendingCreate
    } = this.props
    const disableSendBtn = !!(isEmpty(emails) || pendingCreate || sending)

    return (
      <ScrollView>
        <KeyboardFriendlyView style={styles.keyboardFriendlyContainer}>
          <View style={styles.container}>
            <View style={styles.allowGroupInvites}>
              <Text>Let anyone in this group send invites</Text>
              <View style={styles.allowGroupInvitesSwitch}>
                <Switch
                  onValueChange={this.toggleAllowGroupInvites}
                  value={groupMembersCanInvite}
                  trackColor={{ true: caribbeanGreen }}
                />
              </View>
            </View>
            <Text style={styles.joinGroupText}>Anyone with this link can join the group</Text>
            {inviteLink && <Text style={styles.joinGroupLink}>{inviteLink}</Text>}
            {!inviteLink && <Text>No link has been set yet</Text>}

            <View style={styles.buttonRow}>
              <Button text='Reset Link' onPress={this.resetLink} style={styles.resetLinkButton} />
              <Button text={copied ? 'Copied' : 'Copy Link'} onPress={this.copyToClipboard} style={styles.copyLinkButton} />
            </View>

            {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
            {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

            <TextInput
              value={emails}
              placeholder='Type email addresses'
              onChangeText={(text) => this.setState({ emails: text })}
              style={styles.textInput}
              underlineColorAndroid={styles.androidInvisibleUnderline}
            />
            <TextInput
              value={inputText}
              multiline
              numberOfLines={5}
              underlineColorAndroid={styles.androidInvisibleUnderline}
              style={styles.textInput}
              onChangeText={(text) => this.setState({ inputText: text })}
            />

            <Button
              text='Send Invite'
              disabled={disableSendBtn}
              onPress={this.sendInvite}
              style={styles.sendInviteButton}
            />

          </View>
        </KeyboardFriendlyView>
      </ScrollView>
    )
  }
}

export function PendingInvitesPage ({ invites, expireInvitation, resendInvitation, reinviteAll }) {
  return (
    <ScrollView style={styles.pendingInvitesList}>
      <Button text='Resend All' onPress={reinviteAll} style={styles.resendAllButton} />
      {isEmpty(invites)
        ? <Text style={styles.emptyList}>No pending invites</Text>
        : invites.map((invite, i) =>
          <PendingInviteRow
            invite={invite} key={i} first={i === 0}
            expireInvitation={expireInvitation}
            resendInvitation={resendInvitation}
          />)}
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
