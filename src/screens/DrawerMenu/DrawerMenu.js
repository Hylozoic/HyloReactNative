import React from 'react'
import PropTypes from 'prop-types'
import { Image, Text, TouchableOpacity, View, SectionList } from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import styles from './DrawerMenu.styles'
import SocketListener from 'components/SocketListener'
import Button from 'components/Button'
import Icon from 'components/Icon'
import { isEmpty } from 'lodash/fp'
import { ALL_COMMUNITIES_ID } from 'store/models/Community'

const allCommunitiesImage = require('assets/All_Communities2.png')

export default class DrawerMenu extends React.PureComponent {
  onGoToCommunity = (community) => this.props.goToCommunity(community)
  onGoToNetwork = (network) => this.props.goToNetwork(network)

  render () {
    const {
      name, avatarUrl, goToMyProfile,
      showSettings, networks, communities, currentContext,
      currentNetworkId, currentCommunityId, canModerateCurrentCommunity,
      goToCreateCommunityName, goToCommunitySettingsMenu
    } = this.props

    const listSections = [
      {
        data: networks,
        label: 'Networked Communities',
        renderItem: ({ item }) => <NetworkRow
          network={item}
          goToCommunity={this.onGoToCommunity}
          goToNetwork={this.onGoToNetwork}
          currentNetworkId={currentNetworkId}
          currentCommunityId={!currentNetworkId && currentCommunityId}
                                  />,
        keyExtractor: item => 'n' + item.id
      },
      {
        data: communities,
        label: 'Independent Communities',
        renderItem: ({ item }) => <CommunityRow
          community={item}
          goToCommunity={this.onGoToCommunity}
          currentCommunityId={!currentNetworkId && currentCommunityId}
          addPadding
                                  />,
        keyExtractor: item => 'c' + item.id
      }
    ]

    const isAll = currentNetworkId && currentNetworkId === ALL_COMMUNITIES_ID

    return (
      <View style={styles.parent}>
        {!isAll && currentContext && <View style={styles.header}>
          <Image source={{ uri: currentContext.avatarUrl }} style={styles.headerAvatar} />
          <Text style={styles.headerText}>{currentContext.name}</Text>
          {canModerateCurrentCommunity && <TouchableOpacity onPress={goToCommunitySettingsMenu} hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }} style={styles.headerSettingsButton}>
            <Icon style={styles.headerSettingsButtonIcon} name='Settings' />
            <Text style={styles.headerSettingsButtonText}>Settings</Text>
          </TouchableOpacity>}
                                     </View>}
        <SectionList
          renderSectionHeader={SectionHeader}
          sections={listSections}
          stickySectionHeadersEnabled={false}
        />
        <Button text='Create a Community' onPress={goToCreateCommunityName} style={styles.createCommunityButton} />
        <View style={styles.footer}>
          <TouchableOpacity onPress={goToMyProfile} style={styles.avatar}>
            <Image source={avatarUrl ? { uri: avatarUrl } : null} style={styles.avatar} />
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
    )
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
  return (
    <TouchableOpacity onPress={onPress} style={styles.footerButton} hitSlop={{ top: 20, bottom: 10, left: 10, right: 15 }}>
      <Text style={{ color: 'white', fontSize: 14 }}>{text}</Text>
    </TouchableOpacity>
  )
}

export function SectionHeader ({ section }) {
  const { label } = section
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{label.toUpperCase()}</Text>
    </View>
  )
}

export class NetworkRow extends React.PureComponent {
  constructor (props) {
    super(props)
    const expanded = props.network.communities.reduce((acc, community) =>
      acc || !!community.newPostCount,
    false)
    this.state = {
      expanded,
      seeAllExpanded: false
    }
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  toggleSeeAll = () => {
    this.setState({
      seeAllExpanded: !this.state.seeAllExpanded
    })
  }

  openNetwork = () => this.props.goToNetwork(this.props.network)

  render () {
    const { network, goToCommunity, currentCommunityId } = this.props
    const { expanded, seeAllExpanded } = this.state
    const { id, avatarUrl, name, communities, nonMemberCommunities } = network
    const isAll = id === ALL_COMMUNITIES_ID
    const imageSource = isAll
      ? allCommunitiesImage
      : avatarUrl && { uri: avatarUrl }
    const expandable = !isEmpty(communities)
    const moreCommunities = !isEmpty(nonMemberCommunities)
    return (
      <View style={[styles.networkRow, expanded ? styles.networkRowExpanded : styles.networkRowCollapsed]}>
        <TouchableOpacity onPress={this.openNetwork} style={[styles.rowTouchable, styles.networkRowTouchable]}>
          {imageSource && <Image source={imageSource} style={styles.networkAvatar} />}
          <Text
            style={styles.networkRowText} ellipsizeMode='tail'
            numberOfLines={1}
          >
            {name}
          </Text>
          {expandable && <TouchableOpacity onPress={this.toggleExpanded} style={styles.networkOpenWrapper}><EntypoIcon style={styles.networkOpenIcon} name={expanded ? 'chevron-down' : 'chevron-right'} /></TouchableOpacity>}
        </TouchableOpacity>
        {expanded && expandable && <View style={styles.networkCommunities}>
          {communities.map(c => <CommunityRow
            key={c.id}
            community={c}
            goToCommunity={goToCommunity}
            currentCommunityId={currentCommunityId}
                                />)}
          {seeAllExpanded && moreCommunities && nonMemberCommunities.map(c => <CommunityRow
            key={c.id}
            community={c}
            goToCommunity={goToCommunity}
            currentCommunityId={currentCommunityId}
            isMember={false}
                                                                              />)}
          {moreCommunities && <TouchableOpacity onPress={this.toggleSeeAll}>
            <Text style={styles.seeAll}>{seeAllExpanded ? 'See less' : 'See all'}</Text>
          </TouchableOpacity>}
                                   </View>}
      </View>
    )
  }
}

export function CommunityRow ({ community, goToCommunity, currentCommunityId, addPadding, isMember = true }) {
  const { id, avatarUrl, name } = community
  const newPostCount = Math.min(99, community.newPostCount)
  const highlight = id === currentCommunityId
  return (
    <View style={[styles.communityRow, addPadding && styles.defaultPadding]}>
      <TouchableOpacity onPress={() => goToCommunity(community)} style={styles.rowTouchable}>
        {!!avatarUrl &&
          <Image source={{ uri: avatarUrl }} style={styles.communityAvatar} />}
        <Text
          style={[styles.communityRowText, highlight && styles.highlight, isMember && styles.isMember]} ellipsizeMode='tail'
          numberOfLines={1}
        >
          {name}
        </Text>
        {!!newPostCount && <View style={styles.badge}>
          <Text style={styles.badgeText}>{newPostCount}</Text>
        </View>}
      </TouchableOpacity>
    </View>
  )
}
