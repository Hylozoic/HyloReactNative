import React, { Component } from 'react'
import { Alert, FlatList, Text, View, TouchableOpacity } from 'react-native'
import { get, isEmpty } from 'lodash/fp'

import header from 'util/header'
import Avatar from '../Avatar'
import { SearchType } from '../Editor/Search/Search.store'
import Search from '../Editor/Search'

import styles from './ModeratorSettings.styles'

export default class ModeratorSettings extends Component {
  static navigationOptions = ({navigation}) => header(navigation, {
    headerBackButton: () => navigation.goBack(),
    title: 'Community Moderators'
  })

  state = {
    showPicker: false
  }

  componentDidMount () {
    this.props.fetchModerators()
  }

  componentDidUpdate (prevProps, prevState) {
    if (get('community.slug', prevProps) !== get('community.slug', this.props)) {
      this.props.fetchModerators()
    }
  }

  componentWillUnmount () {
    this.props.clearModeratorSuggestions()
  }

  removeModerator = (id) => {
    Alert.alert(
      'Remove Moderator',
      'Also remove from community?',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'No', onPress: () => this.props.removeModerator(id, false)},
        {text: 'Yes', onPress: () => this.props.removeModerator(id, true)}
      ],
      {cancelable: false}
    )
  }

  addModerator = mod => {
    console.log('Add this mod?', mod)

    // this.props.addModerator(moderatorToAdd)
    // this.clearAutocomplete()
  }

  cancelPersonPicker = () => this.setState({ showPicker: false })

  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '90%',
          marginLeft: '5%',
          backgroundColor: '#CED0CE'
        }}
      />
    )
  }

  isMe = (id) => this.props.currentUser.id === id

  _renderModeratorRow = ({item}) => (
    <ModeratorRow moderator={item} showMember={this.props.showMember} removeModerator={this.isMe(item.id) ? null : this.removeModerator} />
  )

  _renderAutocompleteItem = ({ id, name, avatarUrl }) => (
    <TouchableOpacity style={styles.autocompleteItem} onPress={() => this.selectModeratorToAdd(id, name)}>
      <Avatar style={{width: 50}} avatarUrl={avatarUrl} />
      <Text style={{flex: 1}}>{name}</Text>
    </TouchableOpacity>
  )

  showPersonPicker = () => this.setState({ showPicker: true })

  render () {
    const { community, moderators } = this.props
    const { showPicker } = this.state

    if (isEmpty(moderators)) {
      return <Text>Loading...</Text>
    }

    if (showPicker) {
      return <Search style={styles.search}
        communityId={community.id}
        onCancel={this.cancelPersonPicker}
        onSelect={this.addModerator}
        type={SearchType.PERSON} />
    }

    return <FlatList
      style={styles.container}
      data={moderators}
      keyboardShouldPersistTaps='always'
      ItemSeparatorComponent={this._renderSeparator}
      keyExtractor={item => item.id.toString()}
      renderItem={this._renderModeratorRow}
      ListHeaderComponent={<View style={styles.headerContainer}><Text style={styles.headerText}>{community.name}</Text></View>}
      ListFooterComponent={<View style={styles.addModeratorContainer}>
        <View style={styles.addNewContainer}>
          <TouchableOpacity onPress={this.showPersonPicker}>
            <Text style={styles.addNewButton}>+ Add New</Text>
          </TouchableOpacity>
        </View>
      </View>} />
  }
}

export function ModeratorRow ({moderator, showMember, removeModerator}) {
  return <TouchableOpacity style={styles.row} onPress={() => showMember(moderator.id)}>
    {moderator.avatarUrl && <Avatar style={{width: 50}} avatarUrl={moderator.avatarUrl} />}
    <Text style={{flex: 1}}>{moderator.name}</Text>
    {removeModerator && <TouchableOpacity hitSlop={{top: 15, bottom: 15, left: 10, right: 10}} onPress={() => removeModerator(moderator.id)}>
      <Text style={styles.removeButton}>Remove</Text>
    </TouchableOpacity>}
  </TouchableOpacity>
}
