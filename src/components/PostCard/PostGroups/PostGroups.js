import React, { useState } from 'react'
import { isEmpty } from 'lodash/fp'
import { Text, View, TouchableOpacity } from 'react-native'
import { PUBLIC_GROUP } from 'store/models/Group'
import GroupsList from 'components/GroupsList'
import Icon from 'components/Icon'
import { rhino30, caribbeanGreen } from 'style/colors'

export default function PostGroups ({
  goToGroup,
  groups: providedGroups,
  includePublic,
  style
}) {
  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = () => setExpanded(!expanded)

  const groups = includePublic
    ? [...providedGroups, PUBLIC_GROUP]
    : providedGroups

  // don't show if there are no groups or there is exactly 1 group and the flag isn't set
  if (isEmpty(groups)) {
    return null
  }

  return (
    <View style={[style, expanded && styles.expanded]}>
      <View style={styles.row}>
        <Text style={styles.reminderText}>Posted In: </Text>
        {!expanded && (
          <GroupsListSummary
            expandFunc={toggleExpanded}
            groups={groups}
            goToGroup={goToGroup}
          />
        )}
        <TouchableOpacity onPress={toggleExpanded} style={styles.arrowButton}>
          <Icon
            name={expanded ? 'ArrowUp' : 'ArrowDown'}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>
      {expanded && <GroupsList groups={groups} onPress={goToGroup} />}
    </View>
  )
}

export function GroupsListSummary ({ groups, goToGroup, expandFunc }) {
  const moreGroups = groups.length > 1
  const othersText = n => (n === 1 ? '1 other' : `${n} others`)

  return (
    <View style={[styles.groupList, styles.row]}>
      <TouchableOpacity
        onPress={() => goToGroup && goToGroup(groups[0].slug)}
        style={{ flex: -1 }}
      >
        <Text style={styles.linkText} numberOfLines={1}>
          {groups[0].name}
        </Text>
      </TouchableOpacity>
      {moreGroups && (
        <View style={[styles.row, { flex: 0 }]}>
          <Text style={[styles.reminderText]}> and </Text>
          <TouchableOpacity onPress={expandFunc}>
            <Text style={styles.linkText}>{othersText(groups.length - 1)}</Text>
          </TouchableOpacity>
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
