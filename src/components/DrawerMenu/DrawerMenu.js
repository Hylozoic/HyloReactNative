import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, Text, TouchableOpacity, View, SectionList } from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import styles from './DrawerMenu.styles'
import SocketListener from '../SocketListener'
import Button from '../Button'

import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
const allCommunitiesImage = require('../../assets/All_Communities2.png')

export default class DrawerMenu extends Component {
  // FIXME: I don't think this function is used anywhere
  resetToTop () {
    // hack to fix apparent scroll bug: https://github.com/facebook/react-native/issues/1831
    this.listView.scrollTo({x: 0, y: 1})
    this.listView.scrollTo({x: 0, y: 0})
  }

  render () {
    const {
      name, avatarUrl, goToCommunity, goToNetwork, goToMyProfile,
      showSettings, networks, communities,
      currentNetworkId, currentCommunityId,
      goToCreateCommunityName
    } = this.props

    const listSections = [
      {
        data: networks,
        label: 'Networked Communities',
        renderItem: ({ item }) => <NetworkRow
          network={item}
          goToCommunity={goToCommunity}
          goToNetwork={goToNetwork}
          currentNetworkId={currentNetworkId}
          currentCommunityId={!currentNetworkId && currentCommunityId} />,
        keyExtractor: item => 'n' + item.id
      },
      {
        data: communities,
        label: 'Independent Communities',
        renderItem: ({ item }) => <CommunityRow
          community={item}
          goToCommunity={goToCommunity}
          currentCommunityId={!currentNetworkId && currentCommunityId}
          addPadding />,
        keyExtractor: item => 'c' + item.id
      }
    ]

    return <View style={styles.parent}>
      <SectionList
        renderSectionHeader={SectionHeader}
        sections={listSections}
        stickySectionHeadersEnabled={false} />
      <Button text='Create a Community' onPress={goToCreateCommunityName} style={styles.createCommunityButton} />
      <View style={styles.footer}>
        <TouchableOpacity onPress={goToMyProfile} style={styles.avatar}>
          <Image source={{uri: avatarUrl}} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.footerContent}>
          <Text style={styles.footerTopText} numberOfLines={1}>
            Hello, {name}!
          </Text>
          <View style={styles.footerButtons}>
            <TextButton text='Settings' onPress={showSettings} />
          </View>
        </View>
      </View>
      {/* putting SocketListener here so it's only rendered after login */}
      <SocketListener />
    </View>
  }
}
DrawerMenu.propTypes = {
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  networks: PropTypes.array,
  communities: PropTypes.array,
  goToMyProfile: PropTypes.func.isRequired,
  showSettings: PropTypes.func.isRequired
}

export function TextButton ({ text, onPress }) {
  return <TouchableOpacity onPress={onPress} style={styles.footerButton}>
    <Text style={{color: 'white', fontSize: 14}}>{text}</Text>
  </TouchableOpacity>
}

export function SectionHeader ({ section }) {
  const { label } = section
  return <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{label.toUpperCase()}</Text>
  </View>
}

export class NetworkRow extends React.Component {
  constructor (props) {
    super(props)
    const expanded = props.network.communities.reduce((acc, community) =>
      acc || !!community.newPostCount,
      false)
    this.state = {
      expanded
    }
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { network, goToCommunity, goToNetwork, currentCommunityId } = this.props
    const { id, avatarUrl, name, communities } = network
    const isAll = id === ALL_COMMUNITIES_ID
    const imageSource = isAll
      ? allCommunitiesImage
      : {uri: avatarUrl}
    const openNetwork = () => goToNetwork(network)
    const expandable = communities && !!communities.length
    const { expanded } = this.state
    return <View style={[ styles.networkRow, expanded ? styles.networkRowExpanded : styles.networkRowCollapsed ]}>
      <TouchableOpacity onPress={openNetwork} style={[styles.rowTouchable, styles.networkRowTouchable]}>
        <Image source={imageSource} style={styles.networkAvatar} />
        <Text style={styles.networkRowText} ellipsizeMode='tail'
          numberOfLines={1}>
          {name}
        </Text>
        {expandable && <EntypoIcon onPress={this.toggleExpanded} style={styles.networkOpenIcon} name={expanded ? 'chevron-down' : 'chevron-right'} />}
      </TouchableOpacity>
      {expanded && expandable && <View style={styles.networkCommunities}>
        {communities.map(c => <CommunityRow
          key={c.id}
          community={c}
          goToCommunity={goToCommunity}
          currentCommunityId={currentCommunityId} />)}
      </View>}
    </View>
  }
}

export function CommunityRow ({ community, goToCommunity, currentCommunityId, addPadding }) {
  const { id, avatarUrl, name } = community
  const newPostCount = Math.min(99, community.newPostCount)
  const highlight = id === currentCommunityId
  return <View style={[styles.communityRow, addPadding && styles.defaultPadding]}>
    <TouchableOpacity onPress={() => goToCommunity(community)} style={styles.rowTouchable}>
      {!!avatarUrl &&
        <Image source={{uri: avatarUrl}} style={styles.communityAvatar} />}
      <Text style={[styles.communityRowText, highlight && styles.highlight]} ellipsizeMode='tail'
        numberOfLines={1}>
        {name}
      </Text>
      {!!newPostCount && <View style={styles.badge}>
        <Text style={styles.badgeText}>{newPostCount}</Text>
      </View>}
    </TouchableOpacity>
  </View>
}
