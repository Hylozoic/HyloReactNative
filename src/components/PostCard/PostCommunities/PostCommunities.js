import React from 'react'
import { isEmpty } from 'lodash/fp'
import Icon from '../../Icon'
import CommunitiesList from '../../CommunitiesList'
import { Text, View, TouchableOpacity } from 'react-native'
import {
  capeCod10, rhino30, caribbeanGreen
} from '../../../style/colors'

export default class PostCommunities extends React.PureComponent {
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
    const { communities, goToCommunity, shouldShowCommunities, style } = this.props
    const { expanded } = this.state

    // don't show if there are no communities or there is exactly 1 community and the flag isn't set
    if (isEmpty(communities) || (communities.length === 1 && !shouldShowCommunities)) {
      return null
    }

    const content =
      <View style={styles.row}>
        <Text style={styles.reminderText}>Posted In: </Text>
        <CommunitiesListSummary communities={communities} expandFunc={this.toggleExpanded} goToCommunity={goToCommunity} />
        <TouchableOpacity onPress={this.toggleExpanded} style={styles.arrowButton}>
          <Icon name='ArrowDown' style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    const expandedContent =
      <React.Fragment>
        <View style={styles.row}>
          <Text style={styles.reminderText}>Posted In: </Text>
          <TouchableOpacity onPress={this.toggleExpanded} style={styles.arrowButton}>
            <Icon name='ArrowUp' style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
        <CommunitiesList communities={communities} onPress={goToCommunity} />
      </React.Fragment>

    return <View style={[style, expanded && styles.expanded]}>
      {expanded ? expandedContent : content}
    </View>
  }
}

export function CommunitiesListSummary ({communities, goToCommunity, expandFunc}) {
  const moreCommunities = communities.length > 1
  const othersText = n => n === 1 ? '1 other' : `${n} others`
  return <View style={[styles.communityList, styles.row]}>
    <TouchableOpacity onPress={() => goToCommunity && goToCommunity(communities[0].id)} style={{flex: -1}}><Text style={styles.linkText} numberOfLines={1}>{communities[0].name}</Text></TouchableOpacity>
    {moreCommunities && <View style={[styles.row, {flex: 0}]}>
      <Text style={[styles.reminderText]}> and </Text>
      <TouchableOpacity onPress={expandFunc}><Text style={styles.linkText}>{othersText(communities.length - 1)}</Text></TouchableOpacity>
    </View>}
  </View>
}

const styles = {
  expanded: {
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  communityList: {
    justifyContent: 'flex-start'
  },
  linkText: {
    color: caribbeanGreen,
    fontSize: 13,
    fontFamily: 'Circular-Book'
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
  }
}
