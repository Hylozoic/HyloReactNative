import React from 'react'
import {
  ScrollView
} from 'react-native'
import getPeopleAutocomplete from '../../store/selectors/getPeopleAutocomplete'
import fetchPeopleAutocomplete from '../../store/actions/fetchPeopleAutocomplete'
import Button from '../Button'
import ItemChooser from '../ItemChooser'
import ProjectMemberItemChooserRow from './ProjectMemberItemChooserRow'

export default function ProjectMemberPicker ({
  style,
  onCancel,
  updateMembers,
  members
}) {
  return <ScrollView keyboardShouldPersistTaps='handled'
    contentContainerStyle={[styles.container, style]}>
    <ItemChooser
      chosenItems={members}
      fetchSearchSuggestions={fetchPeopleAutocomplete}
      getSearchSuggestions={getPeopleAutocomplete}
      searchPlaceholder='Type in the names of people to add to project'
      updateItems={updateMembers}
      ItemRowComponent={ProjectMemberItemChooserRow}
      queryScope='ProjectMembers' />
    <Button
      style={styles.doneButton}
      text='Done'
      onPress={onCancel} />
  </ScrollView>
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
