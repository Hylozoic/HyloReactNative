import React from 'react'
import { View, Text, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { get, pick } from 'lodash/fp'
import styles from './Members.styles'
import Button from 'components/Button'
import MemberList from 'components/MemberList'
import { bannerlinearGradientColors } from 'style/colors'

export default class Members extends React.Component {
  goToInvitePeople = () => this.props.navigation.navigate('Community Settings', { screen: 'Invite Members' })

  shouldComponentUpdate (nextProps) {
    // TODO: test if children render...
    return nextProps.isFocused
  }

  render () {
    const { community, network, canModerate } = this.props
    const showInviteButton = !network &&
      (get('allowCommunityInvites', community) || canModerate)

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
            community={community}
            network={network}
            handleInviteOnPress={this.goToInvitePeople}
            showInviteButton={showInviteButton}
          />
        </MemberList>
      </View>
    )
  }
}

export function Banner ({ community, network, showInviteButton, handleInviteOnPress }) {
  let bannerUrl, name

  if (network) {
    ({ bannerUrl, name } = network)
  } else if (community) {
    ({ bannerUrl, name } = community)
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
