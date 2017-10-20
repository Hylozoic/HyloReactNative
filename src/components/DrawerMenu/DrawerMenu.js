import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, Text, TouchableOpacity, View, SectionList } from 'react-native'
import AllFeedsIcon from '../AllFeedsIcon'
import styles from './DrawerMenu.styles'

export default class DrawerMenu extends Component {
  // FIXME: I don't think this function is used anywhere
  resetToTop () {
    // hack to fix apparent scroll bug: https://github.com/facebook/react-native/issues/1831
    this.listView.scrollTo({x: 0, y: 1})
    this.listView.scrollTo({x: 0, y: 0})
  }

  render () {
    const {
      name, avatarUrl, goToCommunity, goToMyProfile, showSettings,
      networks, communities
    } = this.props

    const listSections = [
      {
        data: networks,
        label: 'Networked Communities',
        renderItem: ({ item }) => <NetworkRow network={item} goToCommunity={goToCommunity} />,
        keyExtractor: item => 'n' + item.id
      },
      {
        data: communities,
        label: 'Independent Communities',
        renderItem: ({ item }) => <CommunityRow community={item} goToCommunity={goToCommunity} />,
        keyExtractor: item => 'c' + item.id
      }
    ]

    return <View style={styles.parent}>
      <SectionList contentContainerStyle={styles.menu}
        renderSectionHeader={SectionHeader}
        sections={listSections}
        />
      <View style={styles.footer}>
        <TouchableOpacity onPress={goToMyProfile} style={styles.avatar}>
          <Image source={{uri: avatarUrl}}
            style={styles.avatar} />
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
  state = {
    expanded: false
  }

  render () {
    const { network } = this.props
    return <Text>{network.name}</Text>
  }
}

export function CommunityRow ({ community, goToCommunity }) {
  const all = community.id === 'all'
  return <View style={styles.communityRow}>
    <TouchableOpacity onPress={() => goToCommunity(community)} style={styles.communityRowTouchable}>
      {all
        ? <AllFeedsIcon style={styles.allFeedsIcon} />
        : <Image source={{uri: community.avatarUrl}} style={styles.communityAvatar} />}
      <Text style={[styles.text, styles.communityRowText]} ellipsizeMode='tail'
        numberOfLines={1}>
        {community.name}
      </Text>
    </TouchableOpacity>
  </View>
}
