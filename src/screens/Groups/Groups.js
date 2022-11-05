import { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { View, Text, SectionList, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import { modalScreenName } from 'navigation/linking/helpers'
import useChangeToGroup from 'hooks/useChangeToGroup'
import { visibilityIcon, accessibilityIcon } from 'store/models/Group'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import getMemberships from 'store/selectors/getMemberships'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'
import fetchGraphQL from 'store/actions/fetchGraphQL'
import { MeMembershipsMemberCountQuery } from './Groups.graphql.js'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import styles from './Groups.styles'

export default function Groups () {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const currentGroup = useSelector(getCurrentGroup)
  const queryProps = { groupSlug: currentGroup.slug }
  const memberships = useSelector(getMemberships)
  const joinRequests = useSelector(getMyJoinRequests)
  const childGroups = useSelector(state => getChildGroups(state, queryProps).map(g => {
    g.memberStatus = memberships.find(m => m.group.id === g.id)
      ? 'member'
      : joinRequests.find(jr => jr.group.id === g.id)
        ? 'requested'
        : 'not'
    return g
  }))
  const parentGroups = useSelector(state => getParentGroups(state, queryProps).map(g => {
    g.memberStatus = memberships.find(m => m.group.id === g.id)
      ? 'member'
      : joinRequests.find(jr => jr.group.id === g.id)
        ? 'requested'
        : 'not'
    return g
  }))
  const [loading, setLoading] = useState(true)
  const changeToGroup = useChangeToGroup()
  const goToGroupDetail = groupSlug =>
    navigation.navigate(modalScreenName('Group Detail'), { groupSlug })

  useFocusEffect(() => {
    navigation.setOptions({ title: currentGroup.name })
  })

  useEffect(() => {
    const asyncFunc = async () => {
      setLoading(true)

      await dispatch(fetchGraphQL({
        // See note in Groups.graphql.js re. memberCount query
        query: MeMembershipsMemberCountQuery,
        variables: { id: currentGroup.id },
        meta: {
          afterInteractions: true,
          extractModel: 'Me'
        }
      }))

      setLoading(false)
    }
    asyncFunc()
  }, [currentGroup?.id])

  if (loading) return <Loading />

  const listSections = []
  const renderItem = ({ item }) => (
    <GroupRow
      group={item}
      goToGroup={changeToGroup}
      goToGroupDetail={goToGroupDetail}
      addPadding
    />
  )
  const keyExtractor = item => 'g' + item.id

  if (parentGroups.length > 0) {
    listSections.push({
      title: `${currentGroup.name} is a part of ${parentGroups.length} Group(s)`,
      data: parentGroups,
      renderItem,
      keyExtractor
    })
  }

  if (childGroups.length > 0) {
    listSections.push({
      title: `${childGroups.length} Group(s) are a part of ${currentGroup.name}`,
      data: childGroups,
      renderItem,
      keyExtractor
    })
  }

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  )

  return (
    <SectionList
      style={styles.container}
      sections={listSections}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={renderSectionHeader}
    />
  )
}

export function GroupRow ({ group, goToGroup, goToGroupDetail }) {
  const { avatarUrl, description, name, memberCount, childGroups } = group
  const childGroupsCount = childGroups?.count()
  const isMember = useSelector(getMemberships).find(m => m.group.id === group.id) || false
  const onPressFunc = isMember ? goToGroup : goToGroupDetail
  const statusText = group.memberStatus === 'member'
    ? 'Member'
    : group.memberStatus === 'requested'
      ? 'Membership Requested'
      : 'Not a Member'

  return (
    <TouchableOpacity onPress={() => onPressFunc(group?.slug)} style={styles.groupRow}>
      {!!avatarUrl && (
        <FastImage source={{ uri: avatarUrl }} style={styles.groupAvatar} />
      )}
      <View style={styles.groupRowRight}>
        <Text style={styles.groupRowText} ellipsizeMode='tail' numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.groupStatus}>
          <Icon style={styles.groupStatusIcon} name={visibilityIcon(group.visibility)} />
          <Icon style={styles.groupStatusIcon} name={accessibilityIcon(group.accessibility)} />
          <Text style={styles.groupStatusText}>{statusText}</Text>
        </View>
        <Text style={[styles.groupRowCounts]}>
          {memberCount} Members {childGroupsCount > 0 ? ` | ${childGroupsCount} Groups` : ''}
        </Text>
        {!!description && (
          <Text style={[styles.groupRowDescription]} ellipsizeMode='tail' numberOfLines={1}>{description}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}
