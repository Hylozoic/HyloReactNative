import React from 'react'
import { ScrollView } from 'react-native'
import { scopedFetchPeopleAutocomplete } from '../../store/actions/fetchPeopleAutocomplete'
import { scopedGetPeopleAutocomplete } from '../../store/selectors/getPeopleAutocomplete'
import Button from '../Button'
import ItemChooser from '../ItemChooser'
import ProjectMemberItemChooserRow from './ProjectMemberItemChooserRow'

const QUERY_SCOPE = 'ProjectMemberPicker'

export default function ProjectMemberPicker ({
  style,
  onCancel,
  updateMembers,
  members
}) {
  return <ScrollView contentContainerStyle={[styles.container, style]} keyboardShouldPersistTaps='handled'>
    <ItemChooser
      searchPlaceholder='Type in the names of people to add to project'
      chosenItems={members}
      updateItems={updateMembers}
      ItemRowComponent={ProjectMemberItemChooserRow}
      fetchSearchSuggestions={scopedFetchPeopleAutocomplete(QUERY_SCOPE)}
      getSearchSuggestions={scopedGetPeopleAutocomplete(QUERY_SCOPE)} />
    <Button
      style={styles.doneButton}
      text='Done'
      onPress={onCancel} />
  </ScrollView>
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
  },
  doneButton: {
    width: 100,
    marginLeft: 'auto',
    marginRight: 25,
    marginTop: 'auto',
    marginBottom: 25
  }
}
