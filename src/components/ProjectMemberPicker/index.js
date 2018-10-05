import React from 'react'
import {
  ScrollView
} from 'react-native'

import PeopleChooser from '../PeopleChooser'
import Button from '../Button'

export default class ProjectMemberPicker extends React.Component {
  render () {
    const { style, onCancel, updateMembers, members } = this.props

    return <ScrollView keyboardShouldPersistTaps='handled'
      contentContainerStyle={[styles.container, style]}>
      <PeopleChooser
        updatePeople={updateMembers}
        placeholderText='Type in the names of people to add to project'
        people={members} />
      <Button
        style={styles.doneButton}
        text='Done'
        onPress={onCancel} />
    </ScrollView>
  }
}

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 50
  },
  cancelButton: {
    fontSize: 20,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  doneButton: {
    width: 100,
    marginLeft: 'auto',
    marginRight: 25,
    marginTop: 'auto',
    marginBottom: 25
  }
}
