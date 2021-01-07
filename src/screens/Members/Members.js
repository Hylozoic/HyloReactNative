import React from 'react'
import {
  View, Text, Image
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { get, pick } from 'lodash/fp'
import { DEFAULT_BANNER } from 'store/models/Community'
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
    const {
      community,
      network,
      canModerate,
      isAll
    } = this.props

    const showInviteButton = get('allowCommunityInvites', community) || canModerate
    // sort of a hack since members need to be even since it's rows of 2.  fixes flexbox

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
          <Banner community={community} network={network} all={isAll} handleInviteOnPress={this.goToInvitePeople} showInviteButton={showInviteButton} />
        </MemberList>
      </View>
    )
  }
}

export function Banner ({ community, network, all, showInviteButton, handleInviteOnPress }) {
  let bannerUrl, name

  if (network) {
    ({ bannerUrl, name } = network)
  } else if (community) {
    ({ bannerUrl, name } = community)
  } else if (all) {
    name = 'All Communities'
    bannerUrl = DEFAULT_BANNER
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
