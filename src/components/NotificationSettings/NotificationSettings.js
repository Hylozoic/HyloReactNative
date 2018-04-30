import React from 'react'
import { Image, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import Loading from '../Loading'
import Icon from '../Icon'
import styles from './NotificationSettings.styles'
// import { any, values, isNil } from 'lodash/fp'
import header from 'util/header'
const allCommunitiesLogo = require('../../assets/All_Communities.png')

export default class NotificationSettings extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return header(navigation, {
      title: 'Notification Settings',
      options: {
        headerBackTitle: null
      }
    })
  }

  updateAllCommunities = changes => {
    const { memberships, updateMembershipSettings } = this.props
    memberships.map(m => updateMembershipSettings(m.community.id, changes))
  }

  updateAllCommunitiesAlert = changes => {
    const key = ('sendEmail' in changes) ? 'sendEmail' : 'sendPushNotifications'

    const type = key === 'sendEmail' ? 'Email' : 'Push Notifications'
    const onOrOff = changes[key] ? 'ON' : 'OFF'
    const numCommunities = this.props.memberships.length

    return Alert.alert(
      `You wish to turn ${onOrOff} ${type} for all communities?`,
      `This will affect ${numCommunities} ${numCommunities === 1 ? 'community' : 'communities'}`,
      [
        {text: `Turn ${onOrOff}`, onPress: () => this.updateAllCommunities(changes)},
        {text: 'Cancel', style: 'cancel'}
      ])
  }

  render () {
    const { settings, allCommunitiesSettings, memberships, updateMembershipSettings } = this.props
    if (!settings) return <Loading />

    return <ScrollView contentContainerStyle={styles.scrollContainer}>
      <AllCommunitiesSettingsRow
        settings={allCommunitiesSettings}
        updateAllCommunities={this.updateAllCommunitiesAlert} />
      {memberships.map(membership => <MembershipSettingsRow
        key={membership.id}
        membership={membership}
        updateMembershipSettings={changes => updateMembershipSettings(membership.community.id, changes)} />)}
    </ScrollView>
  }
}

export function AllCommunitiesSettingsRow ({ settings, updateAllCommunities }) {
  return <SettingsRow
    imageSrc={allCommunitiesLogo}
    name='All Communities'
    settings={settings}
    update={updateAllCommunities} />
}

export function MembershipSettingsRow ({ membership, updateMembershipSettings }) {
  return <SettingsRow
    imageUrl={membership.community.avatarUrl}
    name={membership.community.name}
    settings={membership.settings}
    update={updateMembershipSettings} />
}

export class SettingsRow extends React.Component {
  state = {
    expanded: true
  }

  toggleExpand = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { imageUrl, imageSrc, name, settings, update } = this.props
    const { expanded } = this.state

    const source = imageSrc || {uri: imageUrl}

    return <View style={styles.settingsRow}>
      <View style={styles.nameRow}>
        <Image source={source} style={styles.communityAvatar} />
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <TouchableOpacity onPress={this.toggleExpand} style={styles.arrowWrapper}>
          {expanded ? <Icon name='ArrowUp' style={styles.arrowIcon} /> : <Icon name='ArrowDown' style={styles.arrowIcon} />}
        </TouchableOpacity>
      </View>
      {expanded && <View style={styles.iconRow}>
        <SettingsIcon settingKey='sendPushNotifications' name='PushNotification' settings={settings} update={update} />
        <SettingsIcon settingKey='sendEmail' name='EmailNotification' settings={settings} update={update} />
      </View>}
    </View>
  }
}

export function SettingsIcon ({ settingKey, name, update, settings }) {
  return <TouchableOpacity onPress={() => update({[settingKey]: !settings[settingKey]})}>
    <Icon name={name} style={[styles.icon, settings[settingKey] && styles.highlightIcon]} />
  </TouchableOpacity>
}
