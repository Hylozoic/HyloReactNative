import React from 'react'
import PropTypes from 'prop-types'
import { Image, Text, TouchableOpacity, View, SectionList } from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import styles from './DrawerMenu.styles'
import SocketListener from 'components/SocketListener'
import Button from 'components/Button'
import Icon from 'components/Icon'
import { isEmpty } from 'lodash/fp'

export default class DrawerMenu extends React.PureComponent {
  onGoToGroup = (group) => this.props.goToGroup(group)
  onGoToNetwork = (network) => this.props.goToNetwork(network)

  render () {
    const {
      name, avatarUrl, goToMyProfile,
      showSettings, networks, groups, currentContext,
      currentNetworkId, currentGroupId, canModerateCurrentGroup,
      goToCreateGroup, goToGroupSettingsMenu
    } = this.props

    const listSections = [
      {
        data: networks,
        label: 'Networked Groups',
        renderItem: ({ item }) => (
          <NetworkRow
            network={item}
            goToGroup={this.onGoToGroup}
            goToNetwork={this.onGoToNetwork}
            currentNetworkId={currentNetworkId}
            currentGroupId={!currentNetworkId && currentGroupId}
          />
        ),
        keyExtractor: item => 'n' + item.id
      },
      {
        data: groups,
        label: 'Independent Groups',
        renderItem: ({ item }) => (
          <GroupRow
            group={item}
            goToGroup={this.onGoToGroup}
            currentGroupId={!currentNetworkId && currentGroupId}
            addPadding
          />
        ),
        keyExtractor: item => 'c' + item.id
      }
    ]

    return (
      <View style={styles.parent}>
        {currentContext && (
          <View style={styles.header}>
            <Image source={{ uri: currentContext.avatarUrl }} style={styles.headerAvatar} />
            <Text style={styles.headerText}>{currentContext.name}</Text>
            {canModerateCurrentGroup && (
              <TouchableOpacity
                onPress={goToGroupSettingsMenu}
                hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }}
                style={styles.headerSettingsButton}
              >
                <Icon style={styles.headerSettingsButtonIcon} name='Settings' />
                <Text style={styles.headerSettingsButtonText}>Settings</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <SectionList
          renderSectionHeader={SectionHeader}
          sections={listSections}
          stickySectionHeadersEnabled={false}
        />
        <Button text='Create a Group' onPress={goToCreateGroup} style={styles.createGroupButton} />
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
  groups: PropTypes.array,
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
    const expanded = props.network.groups.reduce((acc, group) =>
      acc || !!group.newPostCount,
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
    const { network, goToGroup, currentGroupId } = this.props
    const { expanded, seeAllExpanded } = this.state
    const { avatarUrl, name, groups, nonMemberGroups } = network
    const expandable = !isEmpty(groups)
    const moreGroups = !isEmpty(nonMemberGroups)
    return (
      <View style={[styles.networkRow, expanded ? styles.networkRowExpanded : styles.networkRowCollapsed]}>
        <TouchableOpacity onPress={this.openNetwork} style={[styles.rowTouchable, styles.networkRowTouchable]}>
          {avatarUrl && <Image source={{ uri: avatarUrl }} style={styles.networkAvatar} />}
          <Text style={styles.networkRowText} ellipsizeMode='tail' numberOfLines={1}>
            {name}
          </Text>
          {expandable && (
            <TouchableOpacity onPress={this.toggleExpanded} style={styles.networkOpenWrapper}>
              <EntypoIcon style={styles.networkOpenIcon} name={expanded ? 'chevron-down' : 'chevron-right'} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {expanded && expandable && (
          <View style={styles.networkGroups}>
            {groups.map(c => <GroupRow
              key={c.id}
              group={c}
              goToGroup={goToGroup}
              currentGroupId={currentGroupId}
                                  />)}
            {seeAllExpanded && moreGroups && nonMemberGroups.map(c => (
              <GroupRow
                key={c.id}
                group={c}
                goToGroup={goToGroup}
                currentGroupId={currentGroupId}
                isMember={false}
                                                                                  />
            ))}
            {moreGroups && (
              <TouchableOpacity onPress={this.toggleSeeAll}>
                <Text style={styles.seeAll}>{seeAllExpanded ? 'See less' : 'See all'}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    )
  }
}

export function GroupRow ({ group, goToGroup, currentGroupId, addPadding, isMember = true }) {
  const { id, avatarUrl, name } = group
  const newPostCount = Math.min(99, group.newPostCount)
  const highlight = id === currentGroupId
  return (
    <View style={[styles.groupRow, addPadding && styles.defaultPadding]}>
      <TouchableOpacity onPress={() => goToGroup(group)} style={styles.rowTouchable}>
        {!!avatarUrl &&
          <Image source={{ uri: avatarUrl }} style={styles.groupAvatar} />}
        <Text
          style={[styles.groupRowText, highlight && styles.highlight, isMember && styles.isMember]} ellipsizeMode='tail'
          numberOfLines={1}
        >
          {name}
        </Text>
        {!!newPostCount && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{newPostCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}
