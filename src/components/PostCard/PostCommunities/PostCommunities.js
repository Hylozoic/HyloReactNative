import React, { Component } from 'react'
import { get, isEmpty, chunk } from 'lodash/fp'
import Icon from '../../Icon'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { DEFAULT_AVATAR } from '../../../store/models/Community'
import {
  capeCod10, rhino30, caribbeanGreen
} from '../../../style/colors'

export default class PostCommunities extends Component {
  static defaultState = {
    expanded: false
  }

  constructor (props) {
    super(props)
    this.state = PostCommunities.defaultState
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { communities, slug, goToCommunity } = this.props

    // don't show if there are no communities or this isn't cross posted

    if (isEmpty(communities) || (communities.length === 1 && get('0.slug', communities) === slug)) return null

    const { expanded } = this.state

    const content = expanded
      ? <View style={styles.expandedSection}>
        <View style={styles.row}>
          <Text style={styles.reminderText}>Posted In: </Text>
          <TouchableOpacity onPress={this.toggleExpanded} style={styles.arrowButton}>
            <Icon name='ArrowUp' style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
        {chunk(2, communities).map(pair => <CommunityRow communities={pair} key={pair[0].id} goToCommunity={goToCommunity} />)}
      </View>
      : <View style={styles.row}>
        <Text style={styles.reminderText}>Posted In: </Text>
        <CommunityList communities={communities} expandFunc={this.toggleExpanded} goToCommunity={goToCommunity} />
        <TouchableOpacity onPress={this.toggleExpanded} style={styles.arrowButton}>
          <Icon name='ArrowDown' style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

    return <View style={[styles.communities, expanded && styles.expanded]}>
      {content}
    </View>
  }
}

export function CommunityList ({communities, goToCommunity, expandFunc}) {
  const moreCommunities = communities.length > 1
  const othersText = n => n === 1 ? '1 other' : `${n} others`
  return <View style={[styles.communityList, styles.row]}>
    <TouchableOpacity onPress={() => goToCommunity(communities[0].id)} style={{flex: -1}}><Text style={styles.linkText} numberOfLines={1}>{communities[0].name}</Text></TouchableOpacity>
    {moreCommunities && <View style={[styles.row, {flex: 0}]}>
      <Text style={[styles.reminderText]}> and </Text>
      <TouchableOpacity onPress={expandFunc}><Text style={styles.linkText}>{othersText(communities.length - 1)}</Text></TouchableOpacity>
    </View>}
  </View>
}

export function CommunityRow ({ communities, goToCommunity }) {
  return <View style={[styles.communityRow, styles.row]}>
    {communities.map(community => <CommunityCell key={community.id} community={community} goToCommunity={goToCommunity} />)}
  </View>
}

export function CommunityCell ({ community, goToCommunity }) {
  const { name, avatarUrl } = community
  const imageSource = {uri: avatarUrl || DEFAULT_AVATAR}

  return <TouchableOpacity style={[styles.communityCell, styles.row]} onPress={() => goToCommunity(community.id)}>
    <Image source={imageSource} style={styles.communityAvatar} />}
    <Text style={[styles.linkText, styles.communityCell]} numberOfLines={1}>{name}</Text>
  </TouchableOpacity>
}

const styles = {
  communities: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: capeCod10,
    paddingHorizontal: 12
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  communityList: {
    height: 40,
    justifyContent: 'flex-start'
  },
  arrowButton: {
    marginLeft: 'auto'
  },
  arrowIcon: {
    color: rhino30,
    fontSize: 18
  },
  reminderText: {
    color: rhino30,
    fontSize: 13,
    fontFamily: 'Circular-Book'
  },
  linkText: {
    color: caribbeanGreen,
    fontSize: 13,
    fontFamily: 'Circular-Book'
  },
  expandedSection: {
    paddingTop: 11,
    paddingBottom: 5
  },
  communityRow: {
    paddingVertical: 8
  },
  communityCell: {
    paddingRight: 15
  },
  communityAvatar: {
    height: 20,
    width: 20,
    borderRadius: 4,
    marginRight: 9
  }
}
