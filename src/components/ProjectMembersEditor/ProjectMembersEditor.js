import React from 'react'
import { View } from 'react-native'
import { scopedFetchPeopleAutocomplete } from '../../store/actions/fetchPeopleAutocomplete'
import { scopedGetPeopleAutocomplete } from '../../store/selectors/getPeopleAutocomplete'
import ItemChooser from '../ItemChooser'
import ProjectMemberItemChooserRow from './ProjectMemberItemChooserRow'

const QUERY_SCOPE = 'ProjectMemberPicker'

export default function ProjectMemberPicker ({
  style,
  navigation
}) {
  const { members, updateMembers } = navigation.state.params
  const done = chosenMembers => {
    updateMembers(chosenMembers)
    navigation.goBack()
  }

  return <View style={style} keyboardShouldPersistTaps='handled'>
    <ItemChooser
      searchPlaceholder='Type in the names of people to add to project'
      initialItems={members}
      ItemRowComponent={ProjectMemberItemChooserRow}
      done={done}
      fetchSearchSuggestions={scopedFetchPeopleAutocomplete(QUERY_SCOPE)}
      getSearchSuggestions={scopedGetPeopleAutocomplete(QUERY_SCOPE)} />
  </View>
}
