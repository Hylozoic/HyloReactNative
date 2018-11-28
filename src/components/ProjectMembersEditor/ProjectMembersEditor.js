import React from 'react'
import PropTypes from 'prop-types'
import { View, Alert } from 'react-native'
import { isEqual } from 'lodash/fp'
import header from 'util/header'
import { scopedFetchPeopleAutocomplete } from '../../store/actions/fetchPeopleAutocomplete'
import { scopedGetPeopleAutocomplete } from '../../store/selectors/getPeopleAutocomplete'
import ItemChooser from '../ItemChooser'
import ProjectMemberItemChooserRow from './ProjectMemberItemChooserRow'

const QUERY_SCOPE = 'ProjectMembersEditor'

export default class ProjectMembersEditor extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          updateMembers: PropTypes.func.isRequired,
          members: PropTypes.array.isRequired
        })
      })
    })
  }

  static navigationOptions = ({ navigation }) => {
    const updateMembers = navigation.getParam('updateMembers', undefined)
    const members = navigation.getParam('members', undefined)
    const chosenMembers = navigation.getParam('chosenMembers', members)
    const done = () => {
      updateMembers(chosenMembers)
      navigation.goBack()
    }
    const confirmLeave = onLeave => {
      const changed = !isEqual(chosenMembers, members)
      if (changed) {
        Alert.alert(
          'You have unsaved changes',
          'Are you sure you want to discard your changes?',
          [
            {text: 'Discard', onPress: onLeave},
            {text: 'Continue Editing', style: 'cancel'}
          ])
      } else {
        onLeave()
      }
    }

    return header(navigation, {
      title: 'Project Members',
      headerBackButton: () => confirmLeave(navigation.goBack),
      right: {
        text: 'Done',
        onPress: done
      }
    })
  }

  updateMembers = updatedMembers =>
    this.props.navigation.setParams({ chosenMembers: updatedMembers })

  render () {
    const { style, navigation } = this.props
    const { members } = navigation.state.params

    return <View style={style}>
      <ItemChooser
        searchPlaceholder='Type in the names of people to add to project'
        initialItems={members}
        updateItems={this.updateMembers}
        fetchSearchSuggestions={scopedFetchPeopleAutocomplete(QUERY_SCOPE)}
        getSearchSuggestions={scopedGetPeopleAutocomplete(QUERY_SCOPE)}
        ItemRowComponent={ProjectMemberItemChooserRow} />
    </View>
  }
}
