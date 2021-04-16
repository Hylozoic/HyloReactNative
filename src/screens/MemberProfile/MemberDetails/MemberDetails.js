import React, { useRef } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native'
import { buildTabStackScreenOptions, buildModalScreenOptions } from 'navigation/header'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import { debounce, find, isEmpty, pick } from 'lodash/fp'
import { validateUser } from 'hylo-utils/validators'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import MemberHeader from 'screens/MemberProfile/MemberHeader'
import Control from 'screens/MemberProfile/Control'
import StarIcon from 'components/StarIcon'
import styles from './MemberDetails.styles'
import confirmDiscardChanges from 'util/confirmDiscardChanges'

export function editableFields (person) {
  return pick(['name', 'location', 'tagline', 'bio'], person)
}
export default class MemberDetails extends React.Component {
  constructor (props) {
    super(props)
    const { editing, person } = props
    this.state = {
      editing,
      changed: false,
      person: editableFields(person),
      errors: {}
    }
  }

  setHeader = () => {
    const { editing, changed } = this.state
    const { navigation, route, currentGroup, logout } = this.props
    const headerTitle = editing
      ? 'Edit Your Profile'
      : currentGroup?.name
    if (editing) {
      navigation.setOptions(buildModalScreenOptions({
        route,
        navigation,
        headerTitle,
        headerLeftOnPress: () => this.saveChanges(),
        headerLeftConfirm: changed,
        headerRightButtonLabel: editing ? 'Save' : null,
        headerRightButtonOnPress: this.saveChanges,
        headerRightButtonDisabled: !changed || !this.isValid()
      }))
    } else if (route.name == 'My Profile') {
      navigation.setOptions(buildModalScreenOptions({
        headerTitle: 'My Profile',
        headerLeftOnPress: () => navigation.navigate('Home'),
        headerRightButtonLabel: 'Logout',
        headerRightButtonOnPress: () => confirmDiscardChanges({
          title: 'Logout',
          confirmationMessage: 'Are you sure you want to logout?',
          continueButtonText: 'Cancel',
          disgardButtonText: 'Yes',
          onDiscard: logout
        })
      }))
    } else {  
      navigation.setOptions(buildTabStackScreenOptions({
        route,
        navigation,
        headerTitle
      }))
    }
  }

  componentDidMount () {
    this.props.fetchPerson()
    this.setHeader()
  }

  componentDidUpdate (prevProps) {
    this.setHeader()
  }

  // Errors are strings, or null
  isValid = (errors = this.state.errors) => !find(e => e !== null, errors)

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  validate = debounce(500, () => {
    this.setState({
      errors: {
        // TODO: validate more fields!
        name: validateUser.name(this.state.person.name)
      }
    })
  })

  editProfile = () => {
    this.setState({ editing: true })
  }

  updateSetting = (setting, value) => {
    this.setState({
      person: {
        ...this.state.person,
        [setting]: value
      },
      changed: true
    }, this.validate)
  }

  saveChanges = async () => {
    if (this.isValid()) {
      await this.props.updateUserSettings(this.state.person)
      this.setState(() => ({ editing: false, changed: false }))
    }
  }

  render () {
    const {
      goToEditAccount, goToManageNotifications, goToBlockedUsers,
      goToGroup, goToSkills, isMe, person, onPressMessages, navigation
    } = this.props
    const { editing, errors } = this.state
    const personEdits = this.state.person

    if (isEmpty(personEdits)) return <Loading />

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <MemberHeader
          person={personEdits}
          isMe={isMe}
          onPressMessages={onPressMessages}
          goToManageNotifications={goToManageNotifications}
          goToBlockedUsers={goToBlockedUsers}
          goToEdit={this.editProfile}
          goToEditAccount={goToEditAccount}
          saveChanges={this.saveChanges}
          editable={editing}
          updateSetting={this.updateSetting}
          errors={errors}
          navigation={navigation}
        />
        <MemberBio
          person={personEdits}
          editable={editing}
          updateSetting={this.updateSetting}
          isMe={isMe}
        />
        <MemberSkills
          skills={person.skills.toRefArray()}
          editable={editing}
          goToSkills={goToSkills}
        />
        <MemberGroups
          memberships={person.memberships.toModelArray()}
          goToGroup={goToGroup}
          editing={editing}
        />
      </ScrollView>
    )
  }
}

export function MemberBio (props) {
  const { person: { bio }, editable, updateSetting, isMe } = props
  const controlRef = useRef()
  const focus = () => controlRef.current && controlRef.current.focus()

  if (isEmpty(bio) && !editable) return null
  return (
    <View style={styles.bioContainer}>
      <View style={styles.labelWrapper}>
        <Text style={[styles.sectionLabel, { marginTop: 10 }]}>ABOUT ME</Text>
        {editable && <TouchableOpacity onPress={focus}>
          <EntypoIcon name='edit' style={styles.editIcon} />
        </TouchableOpacity>}
      </View>
      <Control
        ref={controlRef}
        style={styles.bio}
        value={bio}
        placeholder='Description'
        editable={editable}
        onChangeText={value => updateSetting('bio', value)}
        isMe={isMe}
        multiline
        hideEditIcon
      />
    </View>
  )
}

export function MemberSkills ({ skills, editable, goToSkills }) {
  if (isEmpty(skills)) return null

  return (
    <View style={styles.skillsContainer}>
      <View style={styles.labelWrapper}>
        <Text style={styles.sectionLabel}>MY SKILLS</Text>
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
  )
}

export function MemberGroups ({ memberships, goToGroup, editing }) {
  if (isEmpty(memberships)) return null

  return (
    <View style={styles.groupsContainer}>
      <Text style={styles.sectionLabel}>MY GROUPS</Text>
      {memberships.map(membership =>
        <GroupRow membership={membership} key={membership.id}
          goToGroup={goToGroup} editing={editing} />)}
    </View>
  )
}

export function GroupRow ({ membership, goToGroup, editing }) {
  const { group, hasModeratorRole } = membership
  const formatCount = count => {
    if (count < 1000) return `${count}`
    return `${Number(count / 1000).toFixed(1)}k`
  }
  const memberCount = formatCount(group.memberCount)

  return (
    <View style={styles.groupRow}>
      <Image source={{ uri: group.avatarUrl }} style={styles.groupAvatar} />
      <TouchableOpacity onPress={() => goToGroup(group.id)} disabled={editing}>
        <Text style={styles.groupName}>{group.name}</Text>
      </TouchableOpacity>
      {hasModeratorRole && <Icon name='Star' style={styles.starIcon} />}
      <Text style={styles.memberCount}>{memberCount}</Text>
      <Icon name='Members' style={styles.memberIcon} />
    </View>
  )
}
