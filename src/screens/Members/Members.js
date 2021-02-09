import React from 'react'
import { View, Text, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { get, pick } from 'lodash/fp'
import styles from './Members.styles'
import Button from 'components/Button'
import MemberList from 'components/MemberList'
import { bannerlinearGradientColors } from 'style/colors'

export default class Members extends React.Component {
  goToInvitePeople = () => this.props.navigation.navigate('Group Settings', { screen: 'Invite Members' })

  shouldComponentUpdate (nextProps) {
    // TODO: test if children render...
    return nextProps.isFocused
  }

  render () {
    const { group, network, canModerate } = this.props
    const showInviteButton = !network &&
      (get('allowGroupInvites', group) || canModerate)

    return (
      <View style={styles.container}>
        <MemberList
          isServerSearch
          {...pick([
            'isFocused',
            'hasMore',
            'members',
            'pending',
            'slug',
            'search',
            'sortKeys',
            'sortBy',
            'setSort',
            'setSearch',
            'fetchMembers',
            'showMember',
            'fetchMoreMembers'], this.props)}
        >
          <Banner
            group={group}
            network={network}
            handleInviteOnPress={this.goToInvitePeople}
            showInviteButton={showInviteButton}
          />
        </MemberList>
      </View>
    )
  }
}

export function Banner ({ group, network, showInviteButton, handleInviteOnPress }) {
  let bannerUrl, name

  if (network) {
    ({ bannerUrl, name } = network)
  } else if (group) {
    ({ bannerUrl, name } = group)
  } else {
    return null
  }

  return (
    <View style={styles.bannerContainer}>
      <Image source={{ uri: bannerUrl }} style={styles.image} />
      <LinearGradient style={styles.gradient} colors={bannerlinearGradientColors} />
      <View style={styles.titleRow}>
        <Text style={styles.name}>{name}</Text>
      </View>
      {showInviteButton && (
        <Button
          text='Invite'
          style={styles.inviteButton}
          iconName='Invite'
          onPress={handleInviteOnPress}
        />
      )}
    </View>
  )
}
