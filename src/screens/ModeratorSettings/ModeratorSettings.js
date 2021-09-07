import React, { Component } from 'react'
import { Alert, FlatList, Text, View, TouchableOpacity } from 'react-native'
import { get, isEmpty } from 'lodash/fp'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import LoadingScreen from 'components/Loading'
// Person picker
import scopedFetchPeopleAutocomplete from 'store/actions/scopedFetchPeopleAutocomplete'
import scopedGetPeopleAutocomplete from 'store/selectors/scopedGetPeopleAutocomplete'
import PersonPickerItemRow from 'screens/ItemChooser/PersonPickerItemRow'
import styles from './ModeratorSettings.styles'

export default class ModeratorSettings extends Component {
  componentDidMount () {
    this.props.fetchModerators()
  }

  componentDidUpdate (prevProps, prevState) {
    if (get('group.slug', prevProps) !== get('group.slug', this.props)) {
      this.props.fetchModerators()
    }
  }

  removeModerator = (id) => {
    Alert.alert(
      'Remove Moderator',
      '',
      [
        { text: 'No', onPress: () => {}, style: 'No' },
        { text: 'Yes', onPress: () => this.props.removeModerator(id, false) }
      ],
      { cancelable: false }
    )
  }

  addModerator = ({ id }) => this.props.addModerator(id)

  isMe = (id) => this.props.currentUser.id === id

  _renderModeratorRow = ({ item }) => <ModeratorRow
    moderator={item}
    showMember={this.props.showMember}
    removeModerator={this.isMe(item.id) ? null : this.removeModerator}
                                      />

  openPersonPicker = () => {
    const { navigation } = this.props
    const screenTitle = 'Add Moderator'
    navigation.navigate('ItemChooser', {
      screenTitle,
      ItemRowComponent: PersonPickerItemRow,
      pickItem: this.addModerator,
      searchPlaceholder: 'Type here to search for people',
      fetchSearchSuggestions: scopedFetchPeopleAutocomplete,
      getSearchSuggestions: scopedGetPeopleAutocomplete(screenTitle)
    })
  }

  render () {
    const { group, moderators } = this.props

    if (isEmpty(moderators)) {
      return <LoadingScreen />
    }

    return (
      <FlatList
        style={styles.container}
        data={moderators}
        keyboardShouldPersistTaps='always'
        keyExtractor={item => item.id.toString()}
        renderItem={this._renderModeratorRow}
        ListHeaderComponent={<View style={styles.headerContainer}>
          <View style={styles.addNewContainer}>
            <TouchableOpacity onPress={this.openPersonPicker}>
              <Text style={styles.addNewButton}><Icon name='Plus' green /> Add New</Text>
            </TouchableOpacity>
          </View>
                             </View>}
      />
    )
  }
}

export function ModeratorRow ({ moderator, showMember, removeModerator }) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => showMember(moderator.id)}>
      {moderator.avatarUrl && <Avatar style={{ width: 50 }} avatarUrl={moderator.avatarUrl} />}
      <Text style={styles.moderatorName}>{moderator.name}</Text>
      {removeModerator && <TouchableOpacity hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }} onPress={() => removeModerator(moderator.id)}>
        <Text style={styles.removeButton}>Remove</Text>
                          </TouchableOpacity>}
    </TouchableOpacity>
  )
}
