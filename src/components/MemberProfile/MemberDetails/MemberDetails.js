import React from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import Icon from '../../Icon'
import StarIcon from '../../StarIcon'
import Loading from '../../Loading'
import { MemberHeader } from '../MemberProfile'
import styles from './MemberDetails.styles'

export default class MemberDetail extends React.Component {
  componentDidMount () {
    this.props.fetchPerson()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchPerson()
    }
  }

  render () {
    const { person, goToCommunity } = this.props

    if (!person) return <Loading />

    return <ScrollView contentContainerStyle={styles.container}>
      <MemberHeader person={person} />
      <MemberBio person={person} />
      <MemberSkills person={person} />
      <MemberCommunities person={person} goToCommunity={goToCommunity} />
    </ScrollView>
  }
}

export function MemberBio ({ person: { bio } }) {
  return <View style={styles.bioContainer}>
    <Text style={styles.sectionLabel}>About Me</Text>
    <Text style={styles.bio}>{bio}</Text>
  </View>
}

export function MemberSkills ({ person: { skills } }) {
  return <View style={styles.skillsContainer}>
    <Text style={styles.sectionLabel}>My Skills</Text>
    <View style={styles.skills}>{skills.map(skill =>
      <Text style={styles.skill} key={skill.id}>{skill.name.toUpperCase()}</Text>)}</View>
  </View>
}

export function MemberCommunities ({ person: { memberships }, goToCommunity }) {
  return <View style={styles.communitiesContainer}>
    <Text style={styles.sectionLabel}>My Hylo Communities</Text>
    {memberships.map(membership =>
      <CommunityRow membership={membership} key={membership.id} goToCommunity={goToCommunity} />)}
  </View>
}

export function CommunityRow ({ membership, goToCommunity }) {
  const { community, hasModeratorRole } = membership
  const memberCount = '2.4k'
  return <View style={styles.communityRow}>
    {hasModeratorRole && <StarIcon style={styles.starIcon} />}
    <TouchableOpacity onPress={() => goToCommunity(community.id)}>
      <Text style={styles.communityName}>{community.name}</Text>
    </TouchableOpacity>
    <Text style={styles.memberCount}>{memberCount}</Text>
    <Icon name='Members' style={styles.memberIcon} />
  </View>
}
