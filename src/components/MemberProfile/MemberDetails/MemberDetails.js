import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import Icon from '../../Icon'
import Button from '../../Button'
import StarIcon from '../../StarIcon'
import Loading from '../../Loading'
import MemberHeader, { Control } from '../MemberHeader'
import styles from './MemberDetails.styles'
import { isEmpty } from 'lodash/fp'

export default class MemberDetails extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'About This Member'
  })

  constructor (props) {
    super(props)
    this.state = {
      editing: false,
      person: props.person
    }
  }

  componentDidMount () {
    this.props.fetchPerson()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchPerson()
    }

    if (prevProps.person !== this.props.person) {
      this.setState({
        person: this.props.person
      })
    }
  }

  editProfile = () => {
    this.setState({editing: true})
  }

  updateSetting = setting => value => {
    this.setState({
      person: {
        ...this.state.person,
        [setting]: value
      }
    })
  }

  saveChanges = () => {
    console.log('save changes')
    this.props.updateUserSettings(this.state.person)
  }

  render () {
    const { goToCommunity, isMe } = this.props
    const { person, editing } = this.state

    if (!person) return <Loading />

    return <ScrollView contentContainerStyle={styles.container}>
      <MemberHeader
        person={person}
        isMe={isMe}
        editProfile={this.editProfile}
        editable={editing}
        updateSetting={this.updateSetting}
        saveChanges={this.saveChanges} />
      <MemberBio person={person}
        editable={editing}
        updateSetting={this.updateSetting}
        saveChanges={this.saveChanges} />
      <Button text={editing ? 'stop edit' : 'edit'} onPress={() => this.setState({editing: !editing})} />
      <MemberSkills person={person} />
      <MemberCommunities person={person} goToCommunity={goToCommunity} />
    </ScrollView>
  }
}

export function MemberBio ({ person: { bio }, editable, updateSetting, saveChanges }) {
  if (isEmpty(bio)) return null

  return <View style={styles.bioContainer}>
    <Text style={styles.sectionLabel}>About Me</Text>
    <Control
      style={styles.bio}
      value={bio}
      editable={editable}
      onChangeText={updateSetting('bio')}
      onBlur={saveChanges}
      multiline />
  </View>
}

export function MemberSkills ({ person: { skills } }) {
  if (isEmpty(skills)) return null

  return <View style={styles.skillsContainer}>
    <Text style={styles.sectionLabel}>My Skills</Text>
    <View style={styles.skills}>{skills.map(skill =>
      <Text style={styles.skill} key={skill.id}>{skill.name.toUpperCase()}</Text>)}</View>
  </View>
}

export function MemberCommunities ({ person: { memberships }, goToCommunity }) {
  if (isEmpty(memberships)) return null

  return <View style={styles.communitiesContainer}>
    <Text style={styles.sectionLabel}>My Hylo Communities</Text>
    {memberships.map(membership =>
      <CommunityRow membership={membership} key={membership.id} goToCommunity={goToCommunity} />)}
  </View>
}

export function CommunityRow ({ membership, goToCommunity }) {
  const { community, hasModeratorRole } = membership

  const formatCount = count => {
    if (count < 1000) return `${count}`
    return `${Number(count / 1000).toFixed(1)}k`
  }
  const memberCount = formatCount(community.memberCount)
  return <View style={styles.communityRow}>
    {hasModeratorRole && <StarIcon style={styles.starIcon} />}
    <TouchableOpacity onPress={() => goToCommunity(community.id)}>
      <Text style={styles.communityName}>{community.name}</Text>
    </TouchableOpacity>
    <Text style={styles.memberCount}>{memberCount}</Text>
    <Icon name='Members' style={styles.memberIcon} />
  </View>
}
