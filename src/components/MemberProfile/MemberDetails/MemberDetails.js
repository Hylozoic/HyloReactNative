import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import { debounce, find, isEmpty, pick } from 'lodash/fp'
import { validateUser } from 'hylo-utils/validators'

import Icon from '../../Icon'
import Loading from '../../Loading'
import MemberHeader, { Control } from '../MemberHeader'
import StarIcon from '../../StarIcon'
import header, { HeaderButton } from 'util/header'
import styles from './MemberDetails.styles'

export function editableFields (person) {
  return pick(['name', 'location', 'tagline', 'bio'], person)
}

export default class MemberDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const editing = navigation.getParam('editing', false)
    const isMe = navigation.getParam('isMe', false)

    const subject = !editing && isMe ? 'You' : 'This Member'
    const title = !editing ? `About ${subject}` : 'Edit Your Profile'
    return header(navigation, { title })
  }

  constructor (props) {
    super(props)
    const { editing, isMe, person } = props
    this.state = {
      editing,
      person: editableFields(person),
      errors: {}
    }
    props.navigation.setParams({
      editing,
      headerRight: editing ? this.saveButton(this.isValid()) : null,
      isMe
    })
  }

  componentDidMount () {
    this.props.fetchPerson()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchPerson()
    }

    if (prevProps.person !== this.props.person) {
      this.setState({
        person: editableFields(this.props.person)
      })
    }

    const isValid = this.isValid()
    const wasValid = this.isValid(prevState.errors)
    if ((!isValid && wasValid) || (isValid && !wasValid)) {
      this.props.navigation.setParams({ headerRight: this.saveButton(isValid) })
    }
  }

  // Errors are strings, or null
  isValid = (errors = this.state.errors) => !find(e => e !== null, errors)

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  validate = debounce(500, () => {
    this.setState(
      {
        errors: {
          // TODO: validate more fields!
          name: validateUser.name(this.state.person.name)
        }
      })
  })

  editProfile = () => {
    this.setState(
      { editing: true },
      () => this.props.navigation.setParams({
        editing: true,
        headerRight: this.saveButton(this.isValid())
      })
    )
  }

  updateSetting = setting => value => {
    this.setState(
      {
        person: {
          ...this.state.person,
          [setting]: value
        }
      },
      this.validate
    )
  }

  saveButton = valid => <HeaderButton
    disabled={!valid}
    onPress={this.saveChanges}
    text='Save' />

  saveChanges = () => {
    if (this.isValid()) {
      this.props.updateUserSettings(this.state.person)
      this.setState(
        { editing: false },
        () => this.props.navigation.setParams({
          editing: false,
          headerRight: null
        })
      )
    }
  }

  render () {
    const { goToCommunity, goToSkills, isMe, person, skills, onPressMessages } = this.props
    const { editing, errors } = this.state
    const personEdits = this.state.person

    if (isEmpty(personEdits)) return <Loading />

    return <ScrollView contentContainerStyle={styles.container}>
      <MemberHeader
        person={personEdits}
        isMe={isMe}
        onPressMessages={onPressMessages}
        editProfile={this.editProfile}
        saveChanges={this.saveChanges}
        editable={editing}
        updateSetting={this.updateSetting}
        errors={errors} />
      <MemberBio person={personEdits}
        editable={editing}
        updateSetting={this.updateSetting}
        isMe={isMe} />
      <MemberSkills
        skills={skills}
        editable={editing}
        goToSkills={goToSkills} />
      <MemberCommunities
        person={person}
        goToCommunity={goToCommunity}
        editing={editing} />
    </ScrollView>
  }
}

export class MemberBio extends React.Component {
  focus = () => {
    this.control && this.control.focus()
  }

  render () {
    const { person: { bio }, editable, updateSetting, isMe } = this.props
    if (isEmpty(bio) && !editable) return null
    return <View style={styles.bioContainer}>
      <View style={styles.labelWrapper}>
        <Text style={styles.sectionLabel}>About Me</Text>
        {editable && <TouchableOpacity onPress={this.focus}>
          <EntypoIcon name='edit' style={styles.editIcon} />
        </TouchableOpacity>}
      </View>
      <Control
        ref={c => { this.control = c }}
        style={styles.bio}
        value={bio}
        placeholder='Description'
        editable={editable}
        onChangeText={updateSetting('bio')}
        isMe={isMe}
        multiline
        hideEditIcon />
    </View>
  }
}

export function MemberSkills ({ skills, editable, goToSkills }) {
  if (isEmpty(skills)) return null

  return <View style={styles.skillsContainer}>
    <View style={styles.labelWrapper}>
      <Text style={styles.sectionLabel}>My Skills</Text>
      {editable && <TouchableOpacity onPress={goToSkills}>
        <EntypoIcon name='edit' style={styles.editIcon} />
      </TouchableOpacity>}
    </View>
    <TouchableOpacity onPress={goToSkills} disabled={!editable}>
      <View style={styles.skills}>{skills.map(skill =>
        <Text style={styles.skill} key={skill.id}>{skill.name.toUpperCase()}</Text>)}
      </View>
    </TouchableOpacity>
  </View>
}

export function MemberCommunities ({ person: { memberships }, goToCommunity, editing }) {
  if (isEmpty(memberships)) return null

  return <View style={styles.communitiesContainer}>
    <Text style={styles.sectionLabel}>My Hylo Communities</Text>
    {memberships.map(membership =>
      <CommunityRow membership={membership} key={membership.id} goToCommunity={goToCommunity} editing={editing} />)}
  </View>
}

export function CommunityRow ({ membership, goToCommunity, editing }) {
  const { community, hasModeratorRole } = membership

  const formatCount = count => {
    if (count < 1000) return `${count}`
    return `${Number(count / 1000).toFixed(1)}k`
  }
  const memberCount = formatCount(community.memberCount)
  return <View style={styles.communityRow}>
    {hasModeratorRole && <StarIcon style={styles.starIcon} />}
    <TouchableOpacity onPress={() => goToCommunity(community.id)} disabled={editing}>
      <Text style={styles.communityName}>{community.name}</Text>
    </TouchableOpacity>
    <Text style={styles.memberCount}>{memberCount}</Text>
    <Icon name='Members' style={styles.memberIcon} />
  </View>
}
