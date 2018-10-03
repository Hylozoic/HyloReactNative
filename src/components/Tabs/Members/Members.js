import React from 'react'
import {
  View, Text, TouchableOpacity, Image
} from 'react-native'
import { get } from 'lodash/fp'

import { DEFAULT_BANNER } from '../../../store/models/Community'
import Header from '../Header'
import LinearGradient from 'react-native-linear-gradient'
import styles from './Members.styles'
import Button from '../../Button'
import { bannerlinearGradientColors } from 'style/colors'
import MemberList from '../../MemberList'

export default class Members extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) =>
    Header(navigation, screenProps.currentTabName)

  goToInvitePeople = () => this.props.navigation.navigate({routeName: 'InvitePeople', key: 'InvitePeople'})

  shouldComponentUpdate (nextProps) {
    // TODO: test if children render...
    return nextProps.isFocused
  }

  render () {
    let {
      community, canModerate, network, subject, isAll
    } = this.props

    const showInviteButton = get('allowCommunityInvites', community) || canModerate
    // sort of a hack since members need to be even since it's rows of 2.  fixes flexbox

    return <View style={styles.container}>
      <MemberList subject={subject} screenProps={this.props.screenProps}>
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
