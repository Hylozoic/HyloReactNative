import React, { useState } from 'react'
import { isEmpty } from 'lodash/fp'
import { Text, View, TouchableOpacity } from 'react-native'
import { PUBLIC_GROUP } from 'store/models/Group'
import GroupsList from 'components/GroupsList'
import Icon from 'components/Icon'
import { rhino30, caribbeanGreen, rhino40 } from 'style/colors'

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
      <TouchableOpacity onPress={toggleExpanded}>
        <View style={styles.row}>
          <Text style={styles.reminderText}>Posted In: </Text>
          {!expanded && (
            <GroupsListSummary
              expandFunc={toggleExpanded}
              groups={groups}
              goToGroup={goToGroup}
            />
          )}
          <Icon
            name={expanded ? 'ArrowUp' : 'ArrowDown'}
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>
      {expanded && (
        <GroupsList style={[style, { backgroundColor: 'transparent' }]} groups={groups} onPress={goToGroup} />
      )}
    </View>
  )
}

export function GroupsListSummary ({ groups, goToGroup, expandFunc }) {
  const moreGroups = groups.length > 1
  const othersText = n => (n === 1 ? '1 other' : `${n} others`)

  return (
    <View style={[styles.groupList, styles.row]}>
      <TouchableOpacity onPress={() => goToGroup && goToGroup(groups[0].slug)}>
        <Text style={styles.linkText} numberOfLines={1}>
          {groups[0].name}
        </Text>
      </TouchableOpacity>
      {moreGroups && (
        <View style={[styles.row]}>
          <Text style={styles.reminderText}> and {othersText(groups.length - 1)}</Text>
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
    flexDirection: 'row',
    alignItems: 'center'
  },
  groupList: {
    justifyContent: 'flex-start'
  },
  linkText: {
    color: caribbeanGreen,
    fontSize: 12,
    fontFamily: 'Circular-Book'
  },
  arrowIcon: {
    color: rhino40,
    marginLeft: 7,
    fontSize: 16
  },
  reminderText: {
    color: rhino40,
    fontSize: 12,
    fontFamily: 'Circular-Book'
  }
}
