import React from 'react'
import { isEmpty } from 'lodash/fp'
import Icon from 'components/Icon'
import GroupsList from 'components/GroupsList'
import { Text, View, TouchableOpacity } from 'react-native'
import { rhino30, caribbeanGreen } from 'style/colors'
import { PUBLIC_GROUP } from 'store/models/Group'

export default class PostGroups extends React.PureComponent {
  static defaultState = {
    expanded: false
  }

  constructor (props) {
    super(props)
    this.state = PostGroups.defaultState
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { groups: providedGroups, goToGroup, includePublic, shouldShowGroups, style } = this.props
    const { expanded } = this.state
    const groups = includePublic
      ? [...providedGroups, PUBLIC_GROUP]
      : providedGroups

    // don't show if there are no groups or there is exactly 1 group and the flag isn't set
    if (isEmpty(groups) || (groups.length === 1 && shouldShowGroups)) {
      return null
    }

    const content = (
      <View style={styles.row}>
        <Text style={styles.reminderText}>Posted In: </Text>
        <GroupsListSummary groups={groups} expandFunc={this.toggleExpanded} goToGroup={goToGroup} />
        <TouchableOpacity onPress={this.toggleExpanded} style={styles.arrowButton}>
          <Icon name='ArrowDown' style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    )
    const expandedContent = (
      <>
        <View style={styles.row}>
          <Text style={styles.reminderText}>Posted In: </Text>
          <TouchableOpacity onPress={this.toggleExpanded} style={styles.arrowButton}>
            <Icon name='ArrowUp' style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
        <GroupsList groups={groups} onPress={goToGroup} />
      </>
    )

    return (
      <View style={[style, expanded && styles.expanded]}>
        {expanded ? expandedContent : content}
      </View>
    )
  }
}

export function GroupsListSummary ({ groups, goToGroup, expandFunc }) {
  const moreGroups = groups.length > 1
  const othersText = n => n === 1 ? '1 other' : `${n} others`
  return (
    <View style={[styles.groupList, styles.row]}>
      <TouchableOpacity onPress={() => goToGroup && goToGroup(groups[0].id)} style={{ flex: -1 }}><Text style={styles.linkText} numberOfLines={1}>{groups[0].name}</Text></TouchableOpacity>
      {moreGroups && (
        <View style={[styles.row, { flex: 0 }]}>
          <Text style={[styles.reminderText]}> and </Text>
          <TouchableOpacity onPress={expandFunc}><Text style={styles.linkText}>{othersText(groups.length - 1)}</Text></TouchableOpacity>
        </View>
      )}
    </View>
  )
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
  groupList: {
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
