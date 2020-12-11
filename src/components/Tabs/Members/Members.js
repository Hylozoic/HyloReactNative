import React from 'react'
import {
  View, Text, Image
} from 'react-native'
import { get, pick } from 'lodash/fp'

import { DEFAULT_BANNER } from '../../../store/models/Community'
import LinearGradient from 'react-native-linear-gradient'
import styles from './Members.styles'
import Button from '../../Button'
import { bannerlinearGradientColors } from 'style/colors'
import MemberList from '../../MemberList'

export default class Members extends React.Component {
  goToInvitePeople = () => this.props.navigation.navigate('InvitePeople')

  shouldComponentUpdate (nextProps) {
    // TODO: test if children render...
    return nextProps.isFocused
  }

  render () {
    let {
      community,
      network,
      canModerate,
      isAll
    } = this.props

    const showInviteButton = get('allowCommunityInvites', community) || canModerate
    // sort of a hack since members need to be even since it's rows of 2.  fixes flexbox

    return <View style={styles.container}>
      <MemberList isServerSearch
        {...pick([
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
        <Banner community={community} network={network} all={isAll} />
        {showInviteButton && <Button
          text='Invite People'
          style={styles.button}
          iconName={'Invite'}
          onPress={this.goToInvitePeople} />}
      </MemberList>
    </View>
  }
}

export function Banner ({ community, network, all }) {
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

  return <View style={styles.bannerContainer}>
    <Image source={{uri: bannerUrl}} style={styles.image} />
    <LinearGradient style={styles.gradient} colors={bannerlinearGradientColors} />
    <View style={styles.titleRow}>
      <Text style={styles.name}>{name}</Text>
    </View>
  </View>
}
