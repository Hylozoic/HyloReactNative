import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  BackHandler
} from 'react-native'
import Icon from '../../Icon'
import { HeaderBackButton } from 'react-navigation'
import StarIcon from '../../StarIcon'
import Loading from '../../Loading'
import MemberHeader, { Control } from '../MemberHeader'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import styles from './MemberDetails.styles'
import { isEmpty, pick } from 'lodash/fp'
import header, { tintColor } from 'util/header'

export function editableFields (person) {
  return pick(['name', 'location', 'tagline', 'bio'], person)
}

export default class MemberDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const onPress = navigation.state.params.goBack || (() => {})
    return header(navigation, {
      title: 'About This Member',
      options: {
        headerLeft: <HeaderBackButton onPress={onPress} tintColor={tintColor} />,
        headerBackTitle: null
      }
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      editing: this.props.editing,
      person: editableFields(props.person),
      errors: {}
    }
  }

  componentDidMount () {
    this.props.fetchPerson()
    this.props.navigation.setParams({
      goBack: this.goBack
    })
    BackHandler.addEventListener('hardwareBackPress', this.goBack)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchPerson()
    }

    if (prevProps.person !== this.props.person) {
      this.setState({
        person: editableFields(this.props.person)
      })
    }
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.goBack)
  }

  goBack = () => {
    if (this.saveChanges()) {
      this.props.navigation.goBack()
    }
  }

  validate = () => {
    if (isEmpty(this.state.person.name)) {
      this.setState({errors: {
        ...this.state.errors,
        name: 'Cannot be blank'
      }})
      return false
    }
    return true
  }

  editProfile = () => {
    this.setState({editing: true})
  }

  updateSetting = setting => value => {
    this.setState({
      person: {
        ...this.state.person,
        [setting]: value
      },
      errors: {
        ...this.state.errors,
        [setting]: false
      }
    })
  }

  saveChanges = () => {
    if (this.validate()) {
      this.props.updateUserSettings(this.state.person)
      this.setState({editing: false})
      return true
    }
    return false
  }

  render () {
    const { goToCommunity, goToSkills, isMe, person, skills } = this.props
    const { editing, errors } = this.state
    const personEdits = this.state.person

    if (isEmpty(personEdits)) return <Loading />

    return <ScrollView contentContainerStyle={styles.container}>
      <MemberHeader
        person={personEdits}
        isMe={isMe}
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
