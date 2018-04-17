import React, { Component } from 'react'
import { Alert, FlatList, Text, View, TouchableOpacity } from 'react-native'
import header from 'util/header'
import Avatar from '../Avatar'
import Autocomplete from 'react-native-autocomplete-input'

import { get, isEmpty } from 'lodash/fp'

import styles from './ModeratorSettings.styles'

export default class ModeratorSettings extends Component {
  static navigationOptions = ({navigation}) => header(navigation, {
    headerBackButton: () => navigation.goBack(),
    title: 'Community Moderators'
  })

  state = {
    query: '',
    isAdding: false
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
      'Also remove from community as well?',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'No', onPress: () => this.props.removeModerator(id, false)},
        {text: 'Yes', onPress: () => this.props.removeModerator(id, true)}
      ],
      {cancelable: false}
    )
  }

  addModerator = () => {
    const { moderatorToAdd } = this.state
    if (moderatorToAdd) {
      this.props.addModerator(moderatorToAdd)
    }
    this.clearAutocomplete()
  }

  focusAddNew = () => {
    this.setState({isAdding: true})
    setTimeout(() => this.addModeratorInput.focus(), 100)
  }

  queryModerators = (text) => {
    this.setState({ query: text, moderatorToAdd: null })
    this.props.fetchModeratorSuggestions(text)
  }

  selectModeratorToAdd = (id, name) => {
    this.setState({query: name, moderatorToAdd: id})
  }

  clearAutocomplete = (cancelAdding) => {
    this.setState({
      query: '',
      moderatorToAdd: null,
      isAdding: !cancelAdding
    })
    this.props.clearModeratorSuggestions()
  }

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

  render () {
    const {
      moderators,
      community,
      moderatorSuggestions
    } = this.props

    const {
      isAdding,
      query
    } = this.state

    if (isEmpty(moderators)) {
      return <Text>Loading...</Text>
    }

    return <FlatList
      style={styles.container}
      data={moderators}
      ItemSeparatorComponent={this._renderSeparator}
      keyExtractor={item => item.id.toString()}
      renderItem={this._renderModeratorRow}
      ListHeaderComponent={<View style={styles.headerContainer}><Text style={styles.headerText}>{community.name}</Text></View>}
      ListFooterComponent={<View style={styles.addModeratorContainer}>
        {isAdding && <View>
          <Text>Search here for members to grant moderator powers</Text>
          <View style={styles.addModeratorButtonsContainer}>
            <Autocomplete
              autoCapitalize='none'
              autoCorrect={false}
              ref={input => { this.addModeratorInput = input }}
              containerStyle={styles.autocompleteContainer}
              inputContainerStyle={styles.autocompleteInput}
              data={moderatorSuggestions.length === 1 && query === moderatorSuggestions[0].name ? [] : moderatorSuggestions}
              defaultValue={query}
              onChangeText={text => this.queryModerators(text)}
              placeholder='Enter member name'
              renderItem={this._renderAutocompleteItem}
            />
            <TouchableOpacity style={styles.button} onPress={() => this.clearAutocomplete(true)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => this.addModerator()}>
              <Text style={styles.addButton}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>}

        {!isAdding && <View style={styles.addNewContainer}>
          <TouchableOpacity onPress={this.focusAddNew}>
            <Text style={styles.addNewButton}>+ Add New</Text>
          </TouchableOpacity>
        </View>}
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
