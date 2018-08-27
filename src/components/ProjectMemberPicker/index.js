import React from 'react'
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native'

import PeopleChooser from '../PeopleChooser'

import Icon from '../Icon'

export default class ProjectMemberPiccker extends React.Component {
  render () {
    const { style, onCancel, updateMembers, members } = this.props

    return <ScrollView keyboardShouldPersistTaps='handled'
      contentContainerStyle={[styles.container, style]}>
      <TouchableOpacity onPress={onCancel}>
        <Icon name='Ex' style={styles.cancelButton} />
      </TouchableOpacity>
      <PeopleChooser updatePeople={updateMembers} people={members} showRecentContacts />
    </ScrollView>
  }
}

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  cancelButton: {
    fontSize: 20,
    paddingVertical: 5,
    paddingHorizontal: 10
  }
}
