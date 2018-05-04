import React, { Component } from 'react'
import { Alert, FlatList, Text, View, TouchableOpacity } from 'react-native'
import { get, isEmpty } from 'lodash/fp'

import header from 'util/header'
import Avatar from '../Avatar'
import Icon from '../Icon'
import LoadingScreen from '../Loading'
import { SearchType } from '../Search/Search.store'
import Search from '../Search'

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

  removeModerator = (id) => {
    Alert.alert(
      'Remove Moderator',
      '',
      [
        {text: 'No', onPress: () => {}, style: 'No'},
        {text: 'Yes', onPress: () => this.props.removeModerator(id, false)}
      ],
      {cancelable: false}
    )
  }

  addModerator = ({ id }) => {
    this.props.addModerator(id)
    this.cancelPersonPicker()
  }

  cancelPersonPicker = () => this.setState({ showPicker: false })

  isMe = (id) => this.props.currentUser.id === id

  _renderModeratorRow = ({item}) => <ModeratorRow
    moderator={item}
    showMember={this.props.showMember}
    removeModerator={this.isMe(item.id) ? null : this.removeModerator} />

  showPersonPicker = () => this.setState({ showPicker: true })

  render () {
    const { community, moderators } = this.props
    const { showPicker } = this.state

    if (isEmpty(moderators)) {
      return <LoadingScreen />
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
      keyExtractor={item => item.id.toString()}
      renderItem={this._renderModeratorRow}
      ListHeaderComponent={<View style={styles.headerContainer}>
        <Text style={styles.headerText}>{community.name}</Text>
        <View style={styles.addNewContainer}>
          <TouchableOpacity onPress={this.showPersonPicker}>
            <Text style={styles.addNewButton}><Icon name='Plus' green /> Add New</Text>
          </TouchableOpacity>
        </View>
      </View>} />
  }
}

export function ModeratorRow ({moderator, showMember, removeModerator}) {
  return <TouchableOpacity style={styles.row} onPress={() => showMember(moderator.id)}>
    {moderator.avatarUrl && <Avatar style={{width: 50}} avatarUrl={moderator.avatarUrl} />}
    <Text style={styles.moderatorName}>{moderator.name}</Text>
    {removeModerator && <TouchableOpacity hitSlop={{top: 15, bottom: 15, left: 10, right: 10}} onPress={() => removeModerator(moderator.id)}>
      <Text style={styles.removeButton}>Remove</Text>
    </TouchableOpacity>}
  </TouchableOpacity>
}
